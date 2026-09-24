# 05 · Build a structured comparison

20 minutes: learn, build, experiment, and explain your result.

## Start here

Chat and product cards work. A separate comparison form, schema, catalog-search helpers and validation are supplied. The server is missing outputSchema and the client does not render completed structured parts.

```sh
npm run exercise -- 05
```

Edit files in `exercises/05-structured-comparison/`:

- `compare-server.ts`
- `Comparison.tsx`

## Understand the concept

A structured tool call is a model-generated tool name and schema-shaped arguments asking the application to do something, such as search_products for red shirts under €30. The application validates and executes the call. Structured output is the model’s answer shaped to a schema, such as a comparison title, product IDs and reasons that React can render. Both use schemas, but one requests an action and the other supplies answer data. They can work together: search first, then generate the comparison from the results. A valid shape alone does not prove a recommendation is real: we also verify product IDs against the catalog and the search evidence.

The APIs and supplied helpers you will use:

- comparisonSchema is the supplied Zod contract in core-app/comparison-schema.ts; inspect its actual fields before editing.
- chat({ outputSchema, stream: true }) produces a streamed structured result. useChat is configured with the same schema on the client.
- A structured-output message part with status='complete' has data ready for ComparisonResult.
- comparisonTools, comparisonGrounding and validatedComparisonStream are supplied safety infrastructure. They require fresh catalog evidence and reject unsupported recommendations. Their middleware internals are not this task; middleware is taught in 09.

## Make a prediction

Can JSON have the right fields but still refer to a nonexistent product? How would our application detect that?

Write down your prediction before changing the code.

## Build it

Add outputSchema: comparisonSchema to the comparison chat configuration. In Comparison.tsx render <ComparisonResult key={index} value={part.data} /> for the completed structured-output branch. Keep the supplied evidence validation intact.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Experiment

Expand Compare products. Submit Compare available red T-shirts under €30. Then send Make the selection cheaper. Keep everything under €20. Finally try At most €20. Compare strict under with inclusive at most; an empty valid result is allowed. Check that the bag remains unchanged.

## Check your result

A completed comparison renders real products. The follow-up refreshes the catalog and respects the tighter budget. Schema or grounding failures display an error, not fabricated recommendations.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

No structured completion: check server outputSchema. Data events but no cards: check the completed part renderer. Rejected output: inspect search evidence and schema errors; do not weaken validation to make a bad answer display.

Compare with [the reference solution](../../solutions/05-structured-comparison/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 05
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
