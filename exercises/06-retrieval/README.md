# 06 · Retrieve policies and cite sources

15 minutes: learn, build, experiment, and explain your result.

## Start here

Catalog tools and comparisons work. search_store_policies is registered, but its starter implementation returns an empty sources array.

```sh
npm run exercise -- 06
```

Edit files in `exercises/06-retrieval/`:

- `tools.ts`

## Understand the concept

Retrieval supplies relevant external text at answer time. The model uses that evidence to compose an answer; it has not been retrained. Citations let a shopper inspect the actual source.

The APIs and supplied helpers you will use:

- policyDef describes the policy lookup tool and validates input.query.
- retrievePolicies(input.query) is a supplied retrieval helper returning a retrieval mode and source passages.
- Source hrefs point to the storefront FAQ. The supplied renderer displays them as links.
- The prepared retrieval system may use lexical or semantic retrieval depending on available data. Inspect the returned mode; do not label every lookup vector search.

## Make a prediction

Does adding retrieval teach the model permanently, or supply context for this request?

Write down your prediction before changing the code.

## Build it

Replace the empty policy result with retrievePolicies(input.query). Trace the helper to understand ranking and the returned source fields. Do not add made-up policy text to the system prompt.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Experiment

Ask What is the return policy? Open the returned source link and compare it with the answer. Try a paraphrase. Then ask an unsupported policy question and inspect whether any relevant evidence exists; live wording is not deterministic.

## Check your result

The tool returns actual source text and its href; the UI links to the FAQ. The answer should be supported by the passage. A citation is evidence to inspect, not a guarantee that every generated sentence is correct.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

No sources for a known returns question: check that the starter sources: [] was replaced and retrieval data exists. If using the optional semantic preparation, do it before the workshop rather than downloading models during the session.

Compare with [the reference solution](../../solutions/06-retrieval/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 06
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
