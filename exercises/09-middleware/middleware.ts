import type { ChatMiddleware } from '@tanstack/ai';
import { toolCacheMiddleware } from '@tanstack/ai/middlewares';

// One bounded cache per server module. Only public, read-only policy results are reusable.
const policyCache = toolCacheMiddleware({
  toolNames: [], // TODO 09A: cache only search_store_policies.
  ttl: 60_000,
  maxSize: 50,
});

export function workshopMiddleware(limit = 6): ChatMiddleware[] {
  let calls = 0;
  const budget: ChatMiddleware = {
    name: 'workshop-tool-budget',
    onBeforeToolCall(ctx, { toolName }) {
      calls += 1;
      if (calls > limit) {
        ctx.emitCustomEvent('workshop.middleware', {
          message: `Tool budget reached (${limit}). Stopped before ${toolName}.`,
        });
        return {
          type: 'abort',
          reason: `Tool budget reached (${limit}). Refine the request and try again.`,
        };
      }
      ctx.emitCustomEvent('workshop.middleware', {
        message: `Tool ${calls}/${limit}: ${toolName}`,
      });
    },
  };
  const observedCache: ChatMiddleware = {
    ...policyCache,
    async onBeforeToolCall(ctx, info) {
      const decision = await policyCache.onBeforeToolCall?.(ctx, info);
      if (info.toolName === 'search_store_policies')
        ctx.emitCustomEvent('workshop.middleware', {
          message: decision?.type === 'skip' ? 'Policy cache hit' : 'Policy cache miss',
        });
      return decision;
    },
  };
  // Count calls before the cache can skip execution. Re-created for each POST/continuation.
  return [budget, observedCache];
}
