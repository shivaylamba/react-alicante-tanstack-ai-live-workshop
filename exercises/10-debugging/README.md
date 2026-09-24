# 10 · Inspect runs with TanStack DevTools

15 minutes: learn, build, experiment, and explain your result.

## Start here

Middleware activity works. The shared development server event bus is supplied. DebugPanel currently returns null.

```sh
npm run exercise -- 10
```

Edit files in `exercises/10-debugging/`:

- `DebugPanel.tsx`

## Understand the concept

Observability connects a visible answer to the actual request, tool arguments and returned data. Debugging should identify which boundary failed rather than guessing from model prose.

The APIs and supplied helpers you will use:

- TanStackDevtools comes from @tanstack/react-devtools and mounts the panel.
- aiDevtoolsPlugin() comes from @tanstack/react-ai-devtools and adds AI inspection.
- eventBusConfig={{ connectToServerBus: true }} connects the development panel to the supplied server bus.
- Conversation shows executed runs. The Tools tab is a fixture editor with Fire/Save controls; do not confuse it with the execution trace.

## Make a prediction

If the card price is wrong, which evidence distinguishes bad catalog data, bad tool arguments and a rendering bug?

Write down your prediction before changing the code.

## Build it

Replace DebugPanel.tsx with the small complete component shown below, including imports, the stable plugins array and the server bus option.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Experiment

With DevTools closed, send Find red T-shirts under €30 and wait for the response. Then open the floating Open TanStack Devtools control and select TanStack AI. Under CHAT choose the useChat entry containing the new run, then Conversation. Inspect search_products input and its output under USER VIEW; expand products. Compare with product cards and Run activity. STRUCTURED belongs to the separate comparison feature. If the docked panel covers the composer, close it before sending the next message, then reopen it to inspect.

## Check your result

The selected run contains your prompt, an actual tool call, its arguments and catalog output. You can connect those fields to the rendered answer. Do not press Fire or Replay just to inspect.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

No run: select the correct CHAT hook and send a fresh request after opening the panel. No panel: verify the component export/import. Server event problems: check the single development server and avoid duplicate bus processes.

Compare with [the reference solution](../../solutions/10-debugging/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 10
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
