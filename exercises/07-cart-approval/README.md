# 07 · Approve or deny a cart action

25 minutes: learn, build, experiment, and explain your result.

## Start here

Read-only tools work. cartDef, its client implementation, the approval card and disabled composer during approval are supplied. Approve and Deny currently do nothing.

```sh
npm run exercise -- 07
```

Edit files in `exercises/07-cart-approval/`:

- `Chat.tsx`

## Understand the concept

A tool proposal is not an executed action. needsApproval pauses the tool call and exposes an interrupt. A human resolves that specific interrupt; only then may the client tool change local cart state.

The APIs and supplied helpers you will use:

- cartDef uses needsApproval: true. Show it in core-app/definitions.ts before touching the buttons.
- cartDef.client(addToCart) attaches the browser-side implementation; addToCart validates the variant and quantity before changing local state.
- useChat.interrupts contains pending approval requests. originalArgs is the proposed action; canResolve and resuming prevent invalid repeat actions.
- item.resolveInterrupt(true) approves this call; item.resolveInterrupt(false) denies it. A typed yes is not that protocol action.
- resume metadata is supplied continuation plumbing in the server. It connects the resumed request to the paused call.

## Make a prediction

If the model prints Approved in its answer, has the application actually received approval? What event authorizes execution?

Write down your prediction before changing the code.

## Build it

Connect the two button callbacks to item.resolveInterrupt(true) and item.resolveInterrupt(false). Read the supplied card and registration first. Do not bypass needsApproval, change the bag directly from a button, or treat a chat message as approval.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Code edits to make

TODO labels use the exercise number plus an edit letter: `07A` is the first edit in this exercise.

1. **`07A` — `Chat.tsx`:** Find the Approve button. Replace its no-op onClick with onClick={() => item.resolveInterrupt(true)}. This resolves this pending approval, allowing the supplied tool implementation to run.

2. **`07B` — `Chat.tsx`:** Find the Deny button. Replace its no-op onClick with onClick={() => item.resolveInterrupt(false)}. Keep both disabled guards and the existing cart tool registration. Do not add an independent add-to-cart call to either button; the tool lifecycle owns execution.

## Experiment

Ask Add one Fire T-Shirt, red, size M to my bag. Check the card and bag count before clicking. Deny: count stays unchanged. Make a fresh proposal and Approve: count increases by one. Attempt to type yes approve while a card is pending; it must not bypass the card. Check the actual bag after every action.

## Check your result

A real review card appears with the correct item, variant and quantity. Denial has no cart side effect. Approval executes once and the UI recovers. A model saying an item was added is insufficient without cart state evidence.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

No card means no pending tool proposal. Ask for a specific item, size, color and quantity; inspect tool calls. If a button does nothing, inspect its callback. If a response stalls, use the visible error and inspect the bag before retrying to avoid a duplicate.

Compare with [the reference solution](../../solutions/07-cart-approval/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 07
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
