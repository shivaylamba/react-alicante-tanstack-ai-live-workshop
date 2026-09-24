# B6 · Discover specialist tools and portable skills

20–30 minutes after core 03 and 08–09. Read [Lazy Tool Discovery](https://tanstack.com/ai/latest/docs/tools/lazy-tool-discovery) and [Portable Agent Skills](https://tanstack.com/ai/latest/docs/skills/agent-skills).

**Outcome:** expand the store into a support assistant without sending every full tool schema and instruction on each turn.

1. Add a small read-only support domain with supplied fixture data, such as a size guide and packaging information. Make specialist definitions `lazy: true`.
2. Compare initial request payloads before and after discovery. Observe the model discover a tool, then invoke it.
3. As a separate extension, add a portable SKILL.md bundle for gift recommendations through the documented skill middleware. Read the skill's content as instructions for the demo model, not as execution authority.
4. Keep capability enforcement in the actual handlers and approval flow. Discoverability is not access control.

**Acceptance:** an ordinary product search does not load the support tool; a support question discovers and executes it. Unknown names fail. Loading a skill cannot bypass cart approval.

Provider-hosted skills are a different feature tied to provider execution infrastructure. Do not introduce another provider key into the required Nebius workshop. Our five-tool core does not need lazy discovery for performance; this lab makes the larger-tool-set tradeoff explicit.
