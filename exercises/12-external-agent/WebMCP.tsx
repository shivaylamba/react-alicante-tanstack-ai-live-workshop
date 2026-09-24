import { useState } from 'react';
import { useWebMCPTools } from '@tanstack/ai-react';
import { browserTools } from '../../core-app/webmcp-tools';
import { filterProducts } from '../../core-app/browser-state';
const options = { onError: (error: unknown) => console.error('WebMCP registration:', error) };
export function WebMCP() {
  useWebMCPTools(browserTools, options);
  const [result, setResult] = useState('');
  return (
    <section className="webmcp">
      <h2>Browser tools</h2>
      <p>
        {'modelContext' in document
          ? 'Native document.modelContext detected.'
          : 'Native WebMCP unavailable; the harness below tests only the shared handler.'}
      </p>
      <button onClick={() => setResult(JSON.stringify(filterProducts({ color: 'red' })))}>
        Harness: filter red
      </button>
      <button
        onClick={() => {
          try {
            filterProducts({ color: 'invalid' });
          } catch {
            setResult('Invalid color rejected.');
          }
        }}
      >
        Harness: invalid input
      </button>
      <output>{result}</output>
      <p>
        Catalog search, details, policies, filtering and product navigation are exposed. Cart and
        checkout are excluded.
      </p>
    </section>
  );
}
