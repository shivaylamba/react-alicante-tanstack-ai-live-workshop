# Architecture

The manual storefront uses shared catalog, filter and cart commands. Each checkpoint swaps only its lesson modules through the Vite alias.

```mermaid
flowchart LR
  Chat[React chat and queue] --> API[/api/chat]
  API --> Loop[TanStack agent loop]
  Loop --> Model[Nebius]
  Loop --> Reads[Catalog and policy server tools]
  Loop --> Approval[Human approval]
  Approval --> Cart[Validated browser cart command]
  Compare[Comparison conversation] --> CompareAPI[/api/compare]
  CompareAPI --> Search[Read-only catalog tools]
  Search --> Structured[Model structured response]
  Structured --> Validate[Schema and retrieved-ID validation]
  Validate --> Cards[Catalog-backed comparison cards]
```

The Nebius adapter selects separate tool execution and structured finalization; the live model skipped retrieval in combined mode. The catalog schema uses an explicit `all` size instead of an ambiguous optional free-form size.

The comparison conversation is separate from the regular chat so generated objects do not interfere with cart-approval continuations. Both live in the same storefront. Its schema contains product IDs and explanations, never model-owned prices or image URLs. The server checks completion against IDs retrieved during that request; the renderer validates again. Shape and ID grounding do not prove every sentence or inferred preference is correct.

From lesson 09, the chat server installs a per-POST server-tool budget before a policy-only cache. Custom events expose count, hit/miss and budget termination in the run trace. Six calls per request is a teaching execution limit, not a durable spending quota. Approval continuations are separate requests. Browser commands still enforce variants and replay protection. Policy cache entries expire after 60 seconds; its process-local maximum is 50.

Chat messages are session state; only the local cart and applied cart request IDs persist across reload. Comparison history remains during client navigation but is not server-persisted. Persistence and stream resumption are separate bonus assignments.

Policy retrieval defaults to labeled lexical matching. Optional prepared semantic mode embeds documents and queries with the same local model.

External runner → embedded storefront's native registry → discovered schemas → server-side Nebius automatic selection → validated native executeTool → visible product grid → result returned to model. Only filtering is exposed. The independent runner imports no app tool handler and does not implement third-party or cross-origin interoperability.
