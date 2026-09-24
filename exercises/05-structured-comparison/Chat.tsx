import { AnswerText } from '../../core-app/answer-text';
import { useEffect, useRef, useState } from 'react';
import { useChat, fetchServerSentEvents } from '@tanstack/ai-react';
import { searchDef, detailDef } from '../../core-app/definitions';
const clientTools = [searchDef, detailDef];
import { Results } from './Results';
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
  const { messages, sendMessage, isLoading, error, stop, queue, cancelQueued } = useChat({
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
      if (chunk.type === 'TEXT_MESSAGE_CONTENT') setActivity('Writing reply');
      if (chunk.type === 'RUN_FINISHED') setActivity('Ready');
      if (chunk.type === 'RUN_ERROR') setActivity('Request failed');
    },
  });
  return (
    <>
      <div className="chat-heading">
        <h2>Shop assistant</h2>
        <span className="mode">{mode}</span>
      </div>
      <p className="caption">TanStack AI · Nebius Token Factory</p>
      <p className="caption" role="status">
        {isLoading ? activity : 'Ready'}
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
        {!messages.length && <p className="empty">“Find a red T-shirt under €30.”</p>}
        {messages.map((message) => (
          <article className="message" key={message.id}>
            <strong>{message.role}</strong>
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
      {(error || actionError) && (
        <div className="error">
          <p role="alert">{error?.message ?? actionError}</p>
          <button
            disabled={isLoading || !lastPrompt}
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
          if (!input.trim() || queue.length >= 3) return;
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
          <button className="primary" disabled={!input.trim() || queue.length >= 3}>
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
