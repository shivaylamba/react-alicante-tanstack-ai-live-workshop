# 03 · Give the model catalog tools

20 minutes: learn, build, experiment, and explain your result.

## Start here

Streaming chat works. Tool definitions and the UI's expandable call details are supplied. Search currently returns no products and detail lookup uses a deliberately wrong ID.

```sh
npm run exercise -- 03
```

Edit files in `exercises/03-catalog-tools/`:

- `tools.ts`

## Understand the concept

A tool is a named function with a description and an input schema. The model requests a call; application code validates the arguments and executes the function. The result returns to the model so it can answer from data. This request → function → result → answer round trip is introduced here; explicit multi-step agent policy comes in exercise 08.

The APIs and supplied helpers you will use:

- searchDef and detailDef are supplied toolDefinition values in core-app/definitions.ts. Show their names, descriptions and Zod input schemas before implementation.
- definition.server(async input => result) attaches a server implementation to a tool definition.
- searchProducts(input) and getProduct(input.productId) are deterministic catalog helpers, not model calls.
- tools: [search, details] registers capabilities with chat(). Mentioning a function in a prompt does not register it.

## Make a prediction

Can a well-written prompt alone let the model read an in-memory catalog? What code actually performs that lookup?

Write down your prediction before changing the code.

## Build it

In tools.ts return searchProducts(input).slice(0, 6) from search. Pass input.productId into getProduct for details. No policy, cart or filter tools are registered yet.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Experiment

Ask Find red T-shirts under €30. Expand Tool: search_products and compare input and output with the catalog. Ask for details of Fire T-Shirt. Try an impossible search and verify no invented catalog item is rendered. With a live model, request an unsupported policy and discuss why it cannot retrieve that yet.

## Check your result

Search returns real catalog IDs and prices; detail lookup resolves the requested ID. The model's wording may vary, but tool output must match the catalog. Raw tool details are visible; product cards arrive next.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

An empty search result usually means the starter's [] remains. Unknown product ID during details means the literal TODO-product-id remains. Check registered tools as well as the system prompt.

Compare with [the reference solution](../../solutions/03-catalog-tools/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 03
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
