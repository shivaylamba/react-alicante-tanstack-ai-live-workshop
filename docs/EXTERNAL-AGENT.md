# Independent Nebius storefront agent

Start solution 12 and open /agent.html in native-WebMCP Chrome. Wait for Ready, enter a natural-language request, and inspect both trace and visible embedded shop.

The separate document discovers exactly `search_products`, `get_product_details`, `search_store_policies`, `filter_products`, and `show_product`, sends their schemas to `/api/external-agent`, and lets Nebius select automatically. It validates every call's arguments against the supplied allowlist, executes through the native API, and returns results to the model for the next step. The runner allows up to eight model turns and twelve tool calls. Policy search uses the same-origin server endpoint and existing retrieval flow. The API key stays server-side. No cart or checkout tool is available.

Run: “Find a red medium T-shirt under €30, check its return policy, and show me the best matching product. I will decide whether to add it.” Inspect the sequence of native calls, policy result and visible product page. An unrelated greeting should require no tool.

Each run starts a fresh model conversation; embedded UI state remains. Copy the visible trace to preserve evidence. This demonstrates a bounded multi-step flow in our same-origin consumer, not third-party browser-agent interoperability. The external runner always uses real Nebius even when the in-app assistant is in fixture mode.
