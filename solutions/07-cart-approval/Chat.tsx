import { AnswerText } from '../../core-app/answer-text';
import { useEffect, useRef, useState } from 'react';
import { useChat, fetchServerSentEvents } from '@tanstack/ai-react';
import { searchDef, detailDef, policyDef, cartDef, filterDef } from '../../core-app/definitions';
import { addToCart, filterProducts } from '../../core-app/browser-state';
const clientTools = [searchDef, detailDef, policyDef, cartDef.client(addToCart)];
import { Results } from './Results';
import { products, money } from '../../core-app/catalog';
export function Chat() {
  const [input, setInput] = useState('');
  const [activity, setActivity] = useState('Ready');
  const [mode, setMode] = useState('Connecting');
  const [fault, setFault] = useState('none');
  const faultRef = useRef(fault);
  faultRef.current = fault;
  const [actionError, setActionError] = useState('');
  const [lastPrompt, setLastPrompt] = useState('');
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((h) => setMode(h.mode === 'mock' ? 'FIXTURE MODE' : 'NEBIUS LIVE'))
      .catch(() => setMode('Offline'));
  }, []);
  const {
    messages,
    sendMessage,
    isLoading,
    error,
    stop,
    interrupts,
    resuming,
    queue,
    cancelQueued,
  } = useChat({
    connection: fetchServerSentEvents('/api/chat', () => ({
      headers: { 'x-workshop-fault': faultRef.current },
    })),
    tools: clientTools,
    queue: { whenBusy: 'queue', drain: 'fifo', maxSize: 3 },
    onChunk(chunk) {
      if (chunk.type === 'RUN_STARTED') {
        setActivity('Working');
      }
      if (chunk.type === 'TOOL_CALL_START') setActivity(`Running ${chunk.toolCallName}`);
      if (chunk.type === 'REASONING_MESSAGE_CONTENT') setActivity('Model is thinking…');
      if (chunk.type === 'TEXT_MESSAGE_CONTENT') setActivity('Writing reply');
      if (chunk.type === 'RUN_FINISHED') setActivity('Ready');
      if (chunk.type === 'RUN_ERROR') setActivity('Request failed');
    },
  });
  const pending = interrupts.some((item) => item.status === 'pending');
  return (
    <>
      <div className="chat-heading">
        <h2>Shop assistant</h2>
        <span className="mode">{mode}</span>
      </div>
      <p className="caption">TanStack AI · Nebius Token Factory</p>
      <p className="caption" role="status">
        {pending ? 'Waiting for your approval' : isLoading ? activity : 'Ready'}
      </p>
      {queue.length > 0 && (
        <section aria-label="Pending messages" className="pending-queue">
          <h3>Waiting to send</h3>
          {queue.map((item) => (
            <div key={item.id}>
              <span>{typeof item.content === 'string' ? item.content : 'Attachment'}</span>
              <button onClick={() => cancelQueued(item.id)}>Cancel queued message</button>
            </div>
          ))}
        </section>
      )}
      <div className="messages" aria-live="polite" aria-label="Chat messages">
        {!messages.length && (
          <p className="empty">“Find a red T-shirt under €30. What’s the return policy?”</p>
        )}
        {messages.map((message) => (
          <article className="message" key={message.id}>
            <strong>{message.role}</strong>
            {message.role === 'assistant' &&
              !message.parts.some(
                (part) =>
                  (part.type === 'text' && part.content.trim()) || part.type === 'tool-call',
              ) && (
                <p className="caption">
                  {isLoading && message.id === messages.at(-1)?.id
                    ? 'Waiting for the model’s answer or tool proposal…'
                    : 'No answer was returned for this turn.'}
                </p>
              )}
            {message.parts.map((part, index) =>
              part.type === 'text' ? (
                <AnswerText key={index} text={part.content} />
              ) : part.type === 'tool-call' ? (
                <div key={index}>
                  <Results name={part.name} output={part.output} />
                  <details>
                    <summary>
                      Tool: {part.name} · {part.state}
                    </summary>
                    <pre>{JSON.stringify({ input: part.input, output: part.output }, null, 2)}</pre>
                  </details>
                </div>
              ) : part.type === 'tool-result' && part.state === 'error' ? (
                <p className="error" role="alert" key={index}>
                  {part.error ?? JSON.stringify(part.content)}
                </p>
              ) : null,
            )}
          </article>
        ))}
      </div>
      {!pending && !isLoading && messages.length > 0 && (
        <p className="caption" role="status" aria-label="Cart approval status">
          No cart action is awaiting approval. A proposed addition must appear in a review card with
          Approve and Deny buttons before it can run.
        </p>
      )}
      {interrupts.map((item) =>
        item.kind === 'tool-approval' && item.status === 'pending' ? (
          <section className="approval" key={item.id}>
            <strong>Review cart addition</strong>
            {(() => {
              const args = item.originalArgs as {
                productId?: string;
                color?: string;
                size?: string;
                quantity?: number;
              };
              const p = products.find((p) => p.id === args.productId);
              return (
                <p>
                  {p?.name ?? 'Unknown product'} · {args.color} / {args.size?.toUpperCase()} ·
                  Quantity {args.quantity}
                  <br />
                  {p && Number.isInteger(args.quantity)
                    ? `Total: ${money(p.priceCents * (args.quantity ?? 0))}`
                    : 'Invalid proposal — execution will reject it.'}
                  <br />
                  Local bag only. No purchase or reservation.
                </p>
              );
            })()}
            <button
              disabled={!item.canResolve || resuming}
              onClick={() => item.resolveInterrupt(true)}
            >
              Approve
            </button>
            <button
              disabled={!item.canResolve || resuming}
              onClick={() => item.resolveInterrupt(false)}
            >
              Deny
            </button>
          </section>
        ) : null,
      )}
      {(error || actionError) && (
        <div className="error">
          <p role="alert">{error?.message ?? actionError}</p>
          <button
            disabled={isLoading || pending || !lastPrompt}
            onClick={() => {
              setActionError('');
              void sendMessage(lastPrompt).catch((e) => setActionError(String(e)));
            }}
          >
            Retry last message
          </button>
        </div>
      )}
      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault();
          if (!input.trim() || pending || queue.length >= 3) return;
          setActionError('');
          setLastPrompt(input.trim());
          void sendMessage(input.trim()).catch((e) => setActionError(String(e)));
          setInput('');
        }}
      >
        <label htmlFor="prompt">Ask the shop assistant</label>
        <textarea
          id="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Find a red T-shirt under €30"
        />
        <div className="actions">
          <button className="primary" disabled={pending || !input.trim() || queue.length >= 3}>
            Send message
          </button>
          <button type="button" onClick={stop} disabled={!isLoading}>
            Stop
          </button>
        </div>
      </form>
      <label className="faults">
        Failure lab (mock mode only)
        <select value={fault} onChange={(e) => setFault(e.target.value)}>
          <option value="none">No fault</option>
          <option value="rate-limit">HTTP 429</option>
          <option value="slow">Slow stream — test Stop</option>
        </select>
      </label>
    </>
  );
}
