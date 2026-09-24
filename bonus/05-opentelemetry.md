# B5 · Trace a shopping run

20–30 minutes after core 09–10. [OpenTelemetry](https://tanstack.com/ai/latest/docs/advanced/otel) provides model/tool spans; DevTools remains useful for the local UI lifecycle.

**Outcome:** locate latency within a search → policy → approval workflow.

1. Add compatible pinned OTel dependencies, initialize a Node SDK and local exporter, and pass a tracer to `otelMiddleware`.
2. Run a shopping request and identify the root span, model round-trips and tool spans.
3. Compare cache miss/hit runs. Inspect usage only when the provider reports it.
4. Keep content capture off by default; do not export keys or complete shopper prompts just to measure latency.

**Acceptance:** a trace is actually visible in the configured destination; trace IDs correlate to the request. Demonstrate one slow tool and one provider error. Missing usage/cost data must appear unavailable rather than zero.
