# AI concepts in the shopping journey

1. A model predicts output; the provider hosts it; TanStack manages application protocol and tools.
2. Streaming delivers partial text. Stop cancels a response, but does not roll back already completed actions.
3. Tools expose typed capabilities. A model selects arguments; application code validates and executes them.
4. Grounding resolves facts against catalog records. Model-produced IDs and prices are not authoritative.
5. Retrieval supplies evidence. Embeddings measure semantic similarity; keyword lookup is lexical retrieval. Both can support RAG but neither guarantees relevance or truth.
6. Human approval authorizes one proposed local action. It is not server authentication or authorization.
7. Agent loops alternate model decisions and observations, with explicit limits. Tool traces show actions/results, not private chain-of-thought.
8. Debugging separates transport, provider, schema and business-rule failures.
9. WebMCP exposes document tools to consumers. A client tool inside chat is not automatically a browser-native integration.
10. Evaluate outcomes and state changes. One successful run is not a reliability benchmark.
