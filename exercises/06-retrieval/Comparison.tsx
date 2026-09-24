import { useState } from 'react';
import { useChat, fetchServerSentEvents } from '@tanstack/ai-react';
import { comparisonSchema } from '../../core-app/comparison-schema';
import { ComparisonResult } from '../../core-app/comparison-ui';

export function Comparison() {
  const [input, setInput] = useState('Compare available red T-shirts under €30');
  const [sendError, setSendError] = useState('');
  const { messages, sendMessage, isLoading, error, stop } = useChat({
    connection: fetchServerSentEvents('/api/compare'),
    outputSchema: comparisonSchema,
  });
  return (
    <details className="comparison-panel">
      <summary>Compare products</summary>
      <p>Build a shortlist, then refine it. Comparing never changes your bag.</p>
      <div aria-label="Comparison history" aria-live="polite">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === 'user' &&
              message.parts.map((part, index) =>
                part.type === 'text' ? (
                  <p key={index}>
                    <strong>You:</strong> {part.content}
                  </p>
                ) : null,
              )}
            {message.parts.map((part, index) =>
              part.type === 'structured-output' && part.status === 'complete' ? (
                <ComparisonResult key={index} value={part.data} />
              ) : null,
            )}
          </div>
        ))}
      </div>
      {isLoading && <p role="status">Checking the catalog and building your comparison…</p>}
      {(error || sendError) && <p role="alert">{error?.message ?? sendError}</p>}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!input.trim() || isLoading) return;
          setSendError('');
          void sendMessage(input.trim()).catch((e) => setSendError(String(e)));
          setInput('');
        }}
      >
        <label htmlFor="comparison-prompt">Shopping comparison request</label>
        <textarea
          id="comparison-prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Make the selection cheaper"
        />
        <div className="actions">
          <button className="primary" disabled={isLoading || !input.trim()}>
            Build comparison
          </button>
          <button type="button" disabled={!isLoading} onClick={stop}>
            Stop comparison
          </button>
        </div>
      </form>
    </details>
  );
}
