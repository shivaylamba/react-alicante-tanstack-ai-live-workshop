# 09 · Apply middleware and controlled failures

15 minutes: learn, build, experiment, and explain your result.

## Start here

The shopping agent works. Budget and cache middleware are supplied and readable, but the middleware is not attached and the policy cache allowlist is empty.

```sh
npm run exercise -- 09
```

Edit files in `exercises/09-middleware/`:

- `middleware.ts`
- `server.ts`

## Understand the concept

Middleware observes or intervenes at defined execution boundaries. A tool-call budget limits work before execution. A cache can reuse safe read-only results, but caching a mutation could replay or suppress an action incorrectly.

The APIs and supplied helpers you will use:

- workshopMiddleware(limit) creates a fresh per-request budget and returns middleware for chat().
- onBeforeToolCall runs before execution; returning type: 'abort' blocks an over-budget call.
- toolCacheMiddleware({ toolNames, ttl, maxSize }) is a TanStack built-in; only search_store_policies is allowed here.
- ctx.emitCustomEvent sends workshop.middleware activity that the supplied React view displays as Run activity.
- The iteration ceiling and tool-call budget measure different things. This budget resets per POST/continuation; it is not an account-wide spending limit.

## Make a prediction

Should add_to_cart be cached the same way as a public return-policy lookup? What side effect would that risk?

Write down your prediction before changing the code.

## Build it

Set toolNames to ['search_store_policies']. Attach workshopMiddleware to chat(), using 2 for the fixture tool-budget fault and 6 otherwise, exactly as the patch shows. Trace the budget callback before executing the fault experiments.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Code edits to make

TODO labels use the exercise number plus an edit letter: `09A` is the first edit in this exercise.

1. **`09A` — `middleware.ts`:** Inside toolCacheMiddleware, change toolNames: [] to toolNames: ['search_store_policies']. Leave ttl: 60_000 and maxSize: 50 unchanged. Only the read-only policy tool should be cached.

2. **`09B` — `server.ts`:** Inside chat(), add middleware: workshopMiddleware(process.env.WORKSHOP_MOCK === '1' && request.headers.get('x-workshop-fault') === 'tool-budget' ? 2 : 6), at the TODO. The supplied helper applies the budget before the cache. The controlled fixture fault gets two calls; other requests get six.

## Experiment

Run in fixture mode. Select Repeated tools — test budget and ask Find products: inspect Tool 1/2, Tool 2/2 and budget reached. Select Repeated policy — test cache and ask What is the return policy?: inspect miss then hit. Cache lasts 60 seconds; refresh does not clear the server cache. Restore No fault. Optional: approve the Unknown product ID proposal and confirm validation rejects it without changing the bag.

## Check your result

The third tool does not execute when the budget is 2. Repeated policy lookup produces cache activity. A failed tool cannot create a cart item. These are deterministic fixture experiments, not evidence of live model behavior.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

No activity: check middleware is attached and the event handler is present. No miss: restart only the workshop server or wait for cache expiry. Live mode does not inject these faults; confirm FIXTURE MODE.

Compare with [the reference solution](../../solutions/09-middleware/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 09
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
