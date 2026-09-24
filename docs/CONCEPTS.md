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

## AG-UI: the event protocol behind our React UI

AG-UI stands for Agent–User Interaction. It defines a shared event format between an AI backend and a user interface. Our frontend receives events such as RUN_STARTED, TEXT_MESSAGE_CONTENT and RUN_FINISHED rather than waiting for only a finished answer. TanStack AI produces and processes these events for us.

In this workshop, Server-Sent Events, or SSE, carries those events over an HTTP response. SSE is the transport; AG-UI defines the event structure and meaning. chat() produces the stream, toServerSentEventsResponse() sends it over HTTP, and fetchServerSentEvents() connects that response to useChat(). React renders the resulting message state. The model provider runs inference; it is TanStack AI that connects that provider to this application protocol.

```text
Model provider → TanStack AI chat() → AG-UI events over SSE
              → fetchServerSentEvents() → useChat() → React
```

In Exercise 01, inspect these events in the curl response. In Exercise 02, connect them to React state with `useChat()` and inspect `onChunk`. Later exercises add tool-call events and custom activity events. `threadId` identifies a conversation and `runId` identifies one execution; these identifiers alone do not persist a conversation.

AG-UI and WebMCP have different jobs: AG-UI communicates execution to the UI; WebMCP exposes browser application tools for discovery and invocation.

References: [Stream events](https://tanstack.com/ai/latest/docs/chat/stream-events) · [Connection adapters](https://tanstack.com/ai/latest/docs/chat/connection-adapters).
