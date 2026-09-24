# B1 · Persist a shopping conversation

25–35 minutes. Begin with solution 12. Core chat history currently survives client navigation, not page reload or process restart. Local cart persistence is a separate mechanism.

**Outcome:** return to a saved shopping conversation, including an unresolved approval, without replaying a cart change.

1. Read [Chat Persistence](https://tanstack.com/ai/latest/docs/persistence/chat-persistence). Add a compatible pinned `@tanstack/ai-persistence` version.
2. Give each conversation a stable thread ID and use a real durable adapter/store. Keep the comparison and shopping conversations separate.
3. Install `withPersistence` on the server and hydrate from its authoritative transcript. An in-memory map is not proof of restart durability.
4. Inspect how pending interrupts are restored. Do not automatically approve or execute restored proposals.
5. Explain where ownership checks would go before using this outside the local single-user workshop.

**Acceptance:** ask about returns, reload, restart the server and recover the same transcript. Save a pending approval, reload, and verify unchanged bag state until a deliberate approval. Verify a previously applied request ID cannot add twice.

**Discuss:** browser storage, server transcript persistence and transaction idempotency solve different problems. This brief does not add production authentication.
