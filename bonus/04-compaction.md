# B4 · Compact a long shopping session

20–25 minutes after core 08–09. [Compaction](https://tanstack.com/ai/latest/docs/advanced/compaction) reduces provider context while preserving the canonical transcript.

**Outcome:** keep a long comparison session within a chosen context budget.

1. Add a compatible pinned `@tanstack/ai-compaction` version and install `withCompaction`.
2. Use a prepared long conversation; start with `evictOldest`, then compare `clearToolResults` or `summarizeOldest`.
3. Inspect provider-bound messages before and after compaction. Keep durable preferences in explicit application state rather than assuming the summary cannot forget them.
4. Preserve active tool/result and approval relationships; test a pending proposal explicitly.

**Acceptance:** the provider receives shorter context but the UI retains history. The shopper's size and budget remain effective. No proposal gains approval through summarization. Distinguish measured provider usage from estimated token counts; summarization may add a model call.
