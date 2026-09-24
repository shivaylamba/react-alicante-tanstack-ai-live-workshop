# 08 · Bound a multi-step shopping agent

15 minutes: learn, build, experiment, and explain your result.

## Start here

Search, details, retrieval and approvals work. This checkpoint additionally supplies the filter_products client tool, using the same definition/client pattern taught in 07. The starter deliberately limits the run to one iteration and lacks the task-completion instructions.

```sh
npm run exercise -- 08
```

Edit files in `exercises/08-shopping-agent/`:

- `server.ts`

## Understand the concept

An agent repeats model decision → tool execution → new observation until it can answer or must stop. We have already seen individual tool round trips. Here we deliberately plan and bound a longer workflow. An iteration limit is a safety ceiling, not a guarantee of completing the goal.

The APIs and supplied helpers you will use:

- agentLoopStrategy: maxIterations(8) is an explicit TanStack loop policy, introduced here for the first time in learner endpoint files.
- systemPrompts describes the desired workflow and stopping behavior; it does not register tools or enforce authorization.
- filterDef.client(filterProducts) connects a model-selected browser action to a validated UI-state change. Trace this supplied addition before the server task.
- The model chooses a valid tool sequence. Approval remains an independent execution gate even when the agent is pursuing a larger task.

## Make a prediction

What happens if the model needs another tool call after the configured iteration budget is exhausted?

Write down your prediction before changing the code.

## Build it

Replace maxIterations(1) with maxIterations(8). Replace the TODO sentence in the prompt with the demonstrated multi-step workflow and stopping instruction. Preserve the existing approval safeguards.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Code edits to make

TODO labels use the exercise number plus an edit letter: `08A` is the first edit in this exercise.

1. **`08A` — `server.ts`:** Find the systemPrompts entry and add this workflow instruction at its end: For multi-step requests, search, inspect the chosen variant, retrieve relevant policy, ask approval, then summarize actual results. Stop when the goal is met. At most two proposed additions per user turn. Preserve the existing product-fact and approval instructions. This describes behavior; it does not register tools or enforce a hard tool-call budget.

2. **`08B` — `server.ts`:** Change agentLoopStrategy: maxIterations(1) to agentLoopStrategy: maxIterations(8). This permits a bounded multi-step conversation with tools. Eight is a model-iteration ceiling, not eight individual tool calls; the separate tool budget comes in Exercise 09.

## Experiment

Ask Find a red medium T-shirt under €30, check its return policy, and ask me before adding one to my bag. Inspect calls, verify source and variant, then deny. Ask Filter the visible products to red and inspect the grid. Temporarily return the iteration cap to 1, repeat the multi-step task, observe reduced progress, then restore 8.

## Check your result

The run gathers relevant facts and pauses at an actual approval card before mutation. Filtering changes the visible grid. Do not require one exact tool order or claim that a larger cap guarantees success.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

If the run stops early, inspect the cap and tool events. If it narrates a proposal without calling the tool, the card is absent: clarify the requested action and inspect the trace. Never manufacture approval to keep a demo moving.

Compare with [the reference solution](../../solutions/08-shopping-agent/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 08
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
