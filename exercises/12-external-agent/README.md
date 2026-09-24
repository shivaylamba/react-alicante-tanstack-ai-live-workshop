# 12 · Run an external browser agent

20 minutes: learn, build, experiment, and explain your result.

## Start here

The page registers its WebMCP tools. The external runner UI, bounded orchestration and server-side Nebius call are supplied. Two adapter functions in agent.ts intentionally throw.

```sh
npm run exercise -- 12
```

Edit files in `exercises/12-external-agent/`:

- `agent.ts`

## Understand the concept

An external agent discovers a page's capabilities, asks a model to choose a tool and arguments, executes through the browser API, and feeds back the result. The agent must respond to observed tool results rather than claiming actions from prose alone.

The APIs and supplied helpers you will use:

- NativeContext is the workshop's typed boundary around the browser consumer. It exposes getTools() and executeTool(tool, input).
- discover(context) returns context.getTools(); it must use the current native registry rather than a hard-coded catalog.
- execute(context, tool, args) calls context.executeTool(tool, JSON.stringify(args)); the consumer expects serialized arguments.
- The supplied runner in core-app/external-agent.ts handles the model loop, tool results and UI. The provider key stays in the server endpoint.

## Make a prediction

What evidence would distinguish a hard-coded button sequence from a model selecting tools from the discovered registry?

Write down your prediction before changing the code.

## Build it

Replace both throws: return context.getTools() from discover; return context.executeTool(tool, JSON.stringify(args)) from execute. Trace the caller so attendees see the difference between discovery, model selection and execution.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Experiment

In prepared native Chrome open /agent.html in live mode. Ask Find a red medium T-shirt under €30, check its return policy, and show the best match. Leave my bag unchanged. Inspect the discovered registry, model-selected names/arguments, native results, final product view and unchanged bag. Repeat with an impossible constraint and verify the runner does not invent success.

## Check your result

The native registry supplies tools; real Nebius chooses valid calls; native execution updates the storefront; returned data supports the summary; the bag remains unchanged. This proves the workshop's same-origin consumer path, not interoperability with every third-party browser agent.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

A TODO error means one adapter function is unfinished. A missing registry means return to 11. Provider errors require live Nebius configuration. If Chrome lacks the API, report native verification unavailable; a mock registry is not an equivalent pass.

Compare with [the reference solution](../../solutions/12-external-agent/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 12
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
