# 04 · Render grounded product cards

10 minutes: learn, build, experiment, and explain your result.

## Start here

The chat already renders text and expandable tool input/output. Results.tsx deliberately returns null, so there are no rich cards.

```sh
npm run exercise -- 04
```

Edit files in `exercises/04-product-ui/`:

- `Results.tsx`

## Understand the concept

A model can choose a tool, but React owns the interface. Product cards should be rendered from validated tool output and canonical catalog data. Model-generated prose is not a trusted product database.

The APIs and supplied helpers you will use:

- GroundedResults is our supplied React renderer in core-app/product-ui.tsx. It receives a tool name and output, validates them, and renders known products.
- Results is the checkpoint's component name. Re-exporting GroundedResults as Results connects the supplied renderer to Chat.tsx.
- Tool-call parts carry name, state, input and output. A tool result is data; React chooses how to display it.

## Make a prediction

Should the model supply the image URL and price shown on a card, or should our application resolve a known product ID?

Write down your prediction before changing the code.

## Build it

Replace the null Results component with the exact GroundedResults re-export in the patch. Then trace one product ID through the supplied renderer. The coding task is intentionally small; spend the remaining time on validation and UI inspection.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Code edits to make

TODO labels use the exercise number plus an edit letter: `04A` is the first edit in this exercise.

1. **`04A` — `Results.tsx`:** Replace the placeholder Results function that returns null with export { GroundedResults as Results } from '../../core-app/product-ui';. This connects the already supplied card renderer to the chat. Open that helper to trace how catalog IDs become cards; you are wiring the renderer, not writing the whole card layout.

## Experiment

Ask Find red T-shirts under €30. Compare card prices and IDs with expanded tool output. Click a card to open its product page, then return. Inspect the supplied validation code and explain what happens to an unknown product ID.

## Check your result

Matching product cards appear, their prices come from the catalog, and their links open the correct detail pages. Text answers still render. No model-written HTML is injected.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

If raw results appear but cards do not, check the Results export and its import in Chat.tsx. If no tool result exists, return to the catalog-tool checkpoint first.

Compare with [the reference solution](../../solutions/04-product-ui/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 04
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
