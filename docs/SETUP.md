# Participant setup

Complete before the four-hour clock starts. Node 24, npm, Git, a code editor and intermediate React/TypeScript knowledge are expected.

```sh
npm ci
cp .env.example .env.local
# Edit NEBIUS_API_KEY; leave it server-only.
npm run preflight
npm run test:live
npm run solution -- 12
```

Open localhost:3000 and test a product search and approved cart addition. Stop the server before switching lessons. Use `npm run exercise -- 01` to begin.

## Retrieval preparation

The default `RETRIEVAL_MODE=lexical` is a deliberately labeled no-download fallback. RAG means retrieving supplied evidence before generation; lexical retrieval is not semantic search.

For the semantic variant, run `npm run prepare:retrieval` before class. This downloads Xenova/all-MiniLM-L6-v2 and embeds the supplied policies with mean pooling and normalized vectors. Run `npm run test:retrieval` to verify matching sources. Set `RETRIEVAL_MODE=semantic` in .env.local and restart. Queries use exactly the same model/preprocessing; the index stores its model and corpus fingerprint. A changed corpus requires rebuilding. Do not mix the old Alicante vectors with a different query embedding model. Nebius generates answers; the local embedding model handles retrieval.

## Chrome WebMCP

Use a supported Chrome build. Enable `chrome://flags/#enable-webmcp-testing` and, for inspection, `chrome://flags/#devtools-webmcp-support`; relaunch. The solution's Workshop lab reports document.modelContext availability. Full external-runner work uses solution 12 and /agent.html.

Native Console smoke test (Chrome builds expecting serialized arguments):

```js
const tools = await document.modelContext.getTools()
await document.modelContext.executeTool(
  tools.find(t => t.name === 'filter_products'),
  JSON.stringify({ category: 'clothing', color: 'red' }),
)
```

The handler harness is available without native support but does not count as a native test. Check [Chrome documentation](https://developer.chrome.com/docs/ai/webmcp/) if the experimental API changes.

## No-key fallback

Set WORKSHOP_MOCK=1 and restart. The runner starts the deterministic provider automatically. Do not also run mock-api on the same port. This tests streaming/tool/approval plumbing, not model intelligence. The external Nebius runner always uses a real key.

## Ports

Application: 3000 (PORT override); fixture: 4010; DevTools event bus: 4206. Run one workshop server at a time. Browser tests use 3010. Keep the server on loopback. Check current Nebius pricing and project limits; live tests consume tokens.
