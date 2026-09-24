# Building AI-Powered React Apps with TanStack AI

The attendee repository for the **React Alicante four-hour workshop**. Build one React storefront progressively: streaming chat, typed tools, structured output, retrieval, human approval, bounded agents, debugging and WebMCP. We use **Nebius Token Factory** as the model provider.

## Get started

You need Node.js 24, npm, Git, a code editor and basic React/TypeScript knowledge.

```sh
git clone https://github.com/shivaylamba/react-alicante-tanstack-ai-live-workshop.git
cd react-alicante-tanstack-ai-live-workshop
npm ci
cp .env.example .env.local
```

On Windows PowerShell, use `Copy-Item .env.example .env.local`. Add your provider key to `NEBIUS_API_KEY` in `.env.local`. Keep this file private; never put the key in a `VITE_` variable or commit it.

```sh
npm run preflight
npm run dev
```

Open **http://localhost:3000**. `npm run dev` starts **exercise 01**, where the manual storefront works but the AI endpoint intentionally needs your implementation. Follow [exercise 01](exercises/01-server/README.md).

No API key? Skip `npm run preflight` and set `WORKSHOP_MOCK=1` in `.env.local`. The fixture lets you practice the protocol and UI with scripted responses. Exercise 12's independent model-driven agent requires a real key and WebMCP-enabled Chrome. See [setup](docs/SETUP.md) and [troubleshooting](docs/TROUBLESHOOTING.md).

## Preview what you will build

Stop your current server with Ctrl-C, then run:

```sh
npm run solution -- 12
```

Explore the complete storefront, assistant and product comparison. Return to your current exercise when you finish the preview.

## Working through the exercises

1. Open the numbered exercise README and read the concept and task.
2. Make a prediction, edit its TODOs, and try the experiment.
3. Check the visible result and explain what changed.
4. If stuck, compare with the matching `solutions/` folder.
5. Stop the server with Ctrl-C before starting the next exercise.

```sh
npm run exercise -- 02
# To inspect the completed checkpoint instead:
npm run solution -- 02
```

**Switching exercises does not overwrite your files.** Each checkpoint has its own folder and includes the completed earlier capabilities. Your changes stay in the folder you edited; they are not automatically copied into the next checkpoint. No Git commit or push is required to switch. You may fork this repository and commit your progress if you want your own backup.

## Four-hour schedule

| Clock | Minutes | Segment | Teach / build / experiment / explain |
|---|---:|---|---|
| 00:00–00:10 | 10 | Opening demo and boundaries | — |
| 00:10–00:20 | 10 | [01 · Server + Nebius](exercises/01-server/README.md) | 3 / 3 / 3 / 1 |
| 00:20–00:40 | 20 | [02 · Streaming, queues and events](exercises/02-streaming/README.md) | 5 / 8 / 6 / 1 |
| 00:40–01:00 | 20 | [03 · Typed catalog tools](exercises/03-catalog-tools/README.md) | 5 / 8 / 6 / 1 |
| 01:00–01:10 | 10 | [04 · Grounded product cards](exercises/04-product-ui/README.md) | 3 / 3 / 3 / 1 |
| 01:10–01:30 | 20 | [05 · Structured shopping comparisons](exercises/05-structured-comparison/README.md) | 5 / 8 / 6 / 1 |
| 01:30–01:45 | 15 | [06 · Grounded policy retrieval](exercises/06-retrieval/README.md) | 4 / 6 / 4 / 1 |
| 01:45–01:55 | 10 | Break | — |
| 01:55–02:20 | 25 | [07 · Human-approved cart changes](exercises/07-cart-approval/README.md) | 5 / 13 / 6 / 1 |
| 02:20–02:35 | 15 | [08 · Bounded multi-step shopping](exercises/08-shopping-agent/README.md) | 4 / 6 / 4 / 1 |
| 02:35–02:50 | 15 | [09 · Middleware, caching and budgets](exercises/09-middleware/README.md) | 4 / 6 / 4 / 1 |
| 02:50–03:05 | 15 | [10 · DevTools and failure recovery](exercises/10-debugging/README.md) | 4 / 6 / 4 / 1 |
| 03:05–03:20 | 15 | [11 · Expose a native browser tool](exercises/11-webmcp/README.md) | 4 / 6 / 4 / 1 |
| 03:20–03:40 | 20 | [12 · Independent Nebius browser agent](exercises/12-external-agent/README.md) | 5 / 8 / 6 / 1 |
| 03:40–03:50 | 10 | Capstone | — |
| 03:50–04:00 | 10 | Questions / recovery buffer | — |
| **Total** | **240** | **200 minutes of exercises** | **51 teach / 81 build / 56 experiment / 12 explain** |


## Resources

- [Setup](docs/SETUP.md) · [Troubleshooting](docs/TROUBLESHOOTING.md)
- [AI concepts](docs/CONCEPTS.md) · [Checkpoint map](docs/CHECKPOINTS.md)
- [Learning log](docs/LEARNING-LOG.md) · [Debug worksheet](docs/DEBUG-WORKSHEET.md)
- [External browser agent](docs/EXTERNAL-AGENT.md) · [Capstone](docs/CAPSTONE.md)
- [Optional follow-up labs](bonus/README.md): assignments beyond the four-hour session, without completed reference implementations.

## Project layout

```text
exercises/    12 numbered starters and participant instructions
solutions/    completed reference for each checkpoint
core-app/     shared React storefront and server infrastructure
public/       product images and other assets
docs/         participant setup and reference material
bonus/        optional follow-up assignments
scripts/      checkpoint runner and development utilities
tests/        application and checkpoint tests
```

## Development checks

`npm run check` runs TypeScript checks, application tests and the final client build. `npm run check:checkpoints` builds every starter and solution. Browser tests are optional: install Chromium with `npx playwright install chromium`, then run `npm run test:e2e`. Live-model checks consume provider tokens.

This is a local learning application. The bag is stored in your browser and checkout is a preview, not a real purchase. WebMCP requires compatible Chrome support; its local handler fallback is not the same as native browser integration.

## Credits

The product collection builds on [React Alicante Agent Workshop](https://github.com/shivaycb/reactalicante-agent-workshop). The checkpoint format is inspired by [Faris Aziz's workshop](https://github.com/farisaziz12/nextjs-architecture-workshop). See [attribution](ATTRIBUTION.md) and the included licenses.
