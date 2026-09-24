# Checkpoints

Every starter includes the prior solution plus scaffolding for one new capability. Intentional TODOs remain only for that checkpoint’s task. Later starters include working earlier features, so participants can catch up without copying files. Shared helpers provide the manual storefront and validation boundaries.

| Step | Folder | Edit | Expected outcome |
|---|---|---|---|
| 01 | `01-server` | `server.ts` | Server + Nebius |
| 02 | `02-streaming` | `Chat.tsx` | Streaming, queues and events |
| 03 | `03-catalog-tools` | `tools.ts` | Typed catalog tools |
| 04 | `04-product-ui` | `Results.tsx` | Grounded product cards |
| 05 | `05-structured-comparison` | `compare-server.ts, Comparison.tsx` | Structured shopping comparisons |
| 06 | `06-retrieval` | `tools.ts` | Grounded policy retrieval |
| 07 | `07-cart-approval` | `Chat.tsx` | Human-approved cart changes |
| 08 | `08-shopping-agent` | `server.ts` | Bounded multi-step shopping |
| 09 | `09-middleware` | `middleware.ts, server.ts` | Middleware, caching and budgets |
| 10 | `10-debugging` | `DebugPanel.tsx` | DevTools and failure recovery |
| 11 | `11-webmcp` | `WebMCP.tsx` | Register five validated native browser tools |
| 12 | `12-external-agent` | `agent.ts` | Independent Nebius browser agent |

Run `npm run exercise -- NN` or `npm run solution -- NN`, for 01 through 12. Default `npm run dev` opens solution 12. Stop one server before starting another. These commands select folders; they do not mutate your work.

The `storefront-starter`, `storefront-complete` and `storefront-step-*` refs are for the original ten-exercise curriculum. They are deliberately unchanged. The twelve-exercise version lives on `workshop/learn-by-experiment`; use its folder runner.

All 24 clients should build, including TODO starters. A successful starter build is not a completed exercise: run its acceptance checks after implementing the named TODOs. The fixture-backed integration suite checks all twelve solution chat endpoints and all eight structured-comparison endpoints (05–12).

Each checkpoint has an experiment and explanation prompt in its README. Use the matching solution as a reference after attempting the task. Exercise 03 introduces tool calls; Exercise 08 introduces an explicit agent loop limit.
