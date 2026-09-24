# Troubleshooting

- Missing key/model: run preflight; edit server-only .env.local and restart. Never print the key.
- Port in use: stop other workshop servers. The fixture and DevTools ports are shared.
- DevTools not connected: server must run with NODE_ENV=development (the workshop server sets this by default), and port 4206 must be reachable. Inspect one actual run after opening the panel.
- No native tools: enable Chrome's testing flag, relaunch, use solution 11/12 and wait for React registration. Runner waits up to ten seconds.
- Native executeTool parse error: tested Chrome builds require JSON.stringify(arguments), not a plain object.
- Semantic retrieval unavailable/stale: run prepare:retrieval; confirm model download/cache and corpus fingerprint. Use explicitly labeled RETRIEVAL_MODE=lexical for a venue fallback.
- Startup TODO: exercise 01 intentionally returns 501; starter 12 discovery intentionally throws until implemented. Consult the checkpoint brief.
- Approval pending: approve or deny before sending another message. Do not force client-side mutation to skip the interrupt.
- Unexpected old cart: use the bag's Clear button. Local data is validated on load; no real orders exist.
