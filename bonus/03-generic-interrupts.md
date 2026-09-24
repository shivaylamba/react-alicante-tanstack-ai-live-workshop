# B3 · Collect typed shopping preferences

15–20 minutes after core 07. [Generic Interrupts](https://tanstack.com/ai/latest/docs/interrupts/generic) let the server request data even when no tool call triggered the request.

**Outcome:** present a size/budget preference form before continuing a shopping flow.

1. Define a shared interrupt contract with typed display data and typed answer data.
2. Register the definition with server `chat` and client `useChat`.
3. Render a real form for the pending interrupt. Validate budget and supported sizes before resolving it.
4. Resume the run with the typed answer. Keep this separate from cart-execution approval: a size preference grants no permission to mutate the cart.

**Acceptance:** missing preferences pause the flow; invalid answers do not resume it; valid answers affect catalog search. Cancelling leaves the bag unchanged. If B1 is complete, also test reloading while the form is pending.
