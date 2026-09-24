# Source notes and version policy

Reviewed 22 September 2026. Implementation is checked against installed package types and live execution, not just snippets from search indexes.

| Primary source | Used for |
|---|---|
| [React Alicante workshop](https://github.com/shivaycb/reactalicante-agent-workshop) | Product catalog and artwork, storefront journey, checkpoint teaching structure; see LICENSE-ALICANTE |
| [Transformers.js](https://huggingface.co/docs/transformers.js) | Local feature extraction; installed 4.3.0 verified with prepared retrieval tests |
| [Faris Aziz workshop](https://github.com/farisaziz12/nextjs-architecture-workshop) | Numbered exercises/solutions, shared mocks, runners, acceptance-driven structure |
| [TanStack AI](https://tanstack.com/ai/latest) | Library overview and React/server boundary |
| [OpenAI-compatible adapter](https://tanstack.com/ai/latest/docs/adapters/openai-compatible) | Chat Completions adapter configuration |
| [Approval interrupts](https://tanstack.com/ai/latest/docs/interrupts/tool-approval) | `resume`, `parentRunId`, `interrupts`, and `resolveInterrupt` |
| [Client tools](https://tanstack.com/ai/latest/docs/tools/client-tools) | Browser execution and automatic continuation |
| [DevTools](https://tanstack.com/ai/latest/docs/getting-started/devtools) | React plugin and explicit server event bus |
| [TanStack WebMCP](https://tanstack.com/ai/latest/docs/tools/webmcp) | `useWebMCPTools`, cleanup, validation, and prohibition on approval-required tools |
| [WebMCP draft](https://webmachinelearning.github.io/webmcp/) | Current Document API; experimental status and browser invocation boundary |
| [Chrome WebMCP](https://developer.chrome.com/docs/ai/webmcp/) | Browser setup and support guidance |
| [Nebius quickstart](https://docs.tokenfactory.nebius.com/quickstart) | Current `https://api.tokenfactory.nebius.com/v1` endpoint and server-held API key |

The installed `@tanstack/ai` version is 0.58.0, `ai-react` 0.27.3, `ai-client` 0.33.2, and `ai-openai` 0.23.1. All direct dependencies are exact versions and package-lock.json captures transitive dependencies. Run `npm run preflight` to check your configured model because availability can change.

Older tutorials may use `navigator.modelContext` and `addToolApprovalResponse`. This repository uses the current Document API and interrupt API. The local repository’s source/type inspection takes precedence over stale indexed examples. Nebius’s current endpoint is used even where third-party adapter tables still show an older Studio URL.

Source snapshots inspected: Faris repository `228e50a6d8d285891691b2d4de30ab11e0ed839b`; TanStack AI `645757a8cc33c43bf1b6c851d3fbcea5846f16bc`.
