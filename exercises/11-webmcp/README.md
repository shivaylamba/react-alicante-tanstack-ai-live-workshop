# 11 · Expose browser tools with WebMCP

15 minutes: learn, build, experiment, and explain your result.

## Start here

The full in-app assistant works. Five browser tool implementations and a local handler harness are supplied, but the registration hook is missing.

```sh
npm run exercise -- 11
```

Edit files in `exercises/11-webmcp/`:

- `WebMCP.tsx`

## Understand the concept

WebMCP lets a supporting browser expose structured page capabilities to an agent. It is distinct from our in-app chat tools and from a remote MCP server. A native registry test proves more than calling a function directly.

The APIs and supplied helpers you will use:

- useWebMCPTools(browserTools, options) is the TanStack React registration hook; React manages registration lifecycle.
- browserTools exposes search_products, get_product_details, search_store_policies, filter_products and show_product.
- document.modelContext is the browser capability checked by this workshop. Use a supported, configured Chrome build for native exercises.
- The harness buttons call shared handlers directly. They can test validation and state changes even when the native browser API is absent; they cannot prove native registration.

## Make a prediction

If a normal button calls filterProducts successfully, have we proved another agent can discover that function through WebMCP?

Write down your prediction before changing the code.

## Build it

Call useWebMCPTools(browserTools, options) at the top level of WebMCP. Inspect the exposed list. Never add cart or checkout actions to this registry for the workshop.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Experiment

Expand Workshop lab. Check the native availability message. Use Harness: filter red and Harness: invalid input to test the handlers. In supported Chrome inspect the registered names with the native consumer described in docs/EXTERNAL-AGENT.md. Continue to 12 for discovery plus actual native execution.

## Check your result

Handler tests filter the visible grid and reject invalid input. Separately, supported Chrome must expose the five tool definitions. If native support is absent, complete the handler experiment and note that native discovery still needs compatible Chrome support.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

No native API: check the prepared Chrome version and capability setup before the workshop. Do not spend the session installing browser builds. Missing tools with native support: check the hook is mounted and registration errors.

Compare with [the reference solution](../../solutions/11-webmcp/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 11
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
