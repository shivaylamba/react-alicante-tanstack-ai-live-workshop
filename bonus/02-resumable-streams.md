# B2 · Resume a dropped shopping response

20–30 minutes after B1. [Resumable Streams](https://tanstack.com/ai/latest/docs/resumable-streams/overview) records emitted events; it is separate from saving chat messages.

**Outcome:** reconnect to a running product explanation without paying for a duplicate model run.

1. Add the documented durability adapter to the SSE response and a replay GET endpoint.
2. Persist the active run identifier separately from the transcript and use `joinRun` for attachment.
3. Keep transport disconnection distinct from the explicit Stop action. Review the core abort-on-disconnect setup: a resumable producer must be owned by the durability mechanism, not simply aborted when its first client leaves.
4. Show sequence offsets and verify replay de-duplication. Start with the documented memory adapter for transport behavior; use durable storage if testing process restart.

**Acceptance:** count provider calls; start a slow run, disconnect/reconnect, and confirm no extra generation call. Text must not duplicate. Explicit Stop must remain effective. State exactly whether only network reconnection or process-restart recovery was tested.
