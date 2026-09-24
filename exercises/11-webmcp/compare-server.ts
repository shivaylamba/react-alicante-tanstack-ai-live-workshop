import { chat, maxIterations, toServerSentEventsResponse } from '@tanstack/ai';
import { nebiusAdapter } from '../../core-app/provider';
import { readChatRequest } from '../../core-app/request';
import { comparisonSchema } from '../../core-app/comparison-schema';
import {
  comparisonTools,
  comparisonGrounding,
  comparisonPrompt,
  validatedComparisonStream,
} from '../../core-app/comparison-server';

export async function POST(request: Request) {
  const params = await readChatRequest(request);
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (request.signal.aborted) abort();
  request.signal.addEventListener('abort', abort, { once: true });
  const deadline = setTimeout(abort, 60_000);
  const evidence = { ids: new Set<string>(), searched: false };
  const stream = chat({
    adapter: nebiusAdapter(request.headers.get('x-workshop-fault') ?? 'none'),
    messages: params.messages,
    threadId: params.threadId,
    runId: params.runId,
    systemPrompts: [comparisonPrompt],
    tools: comparisonTools(evidence),
    middleware: [comparisonGrounding(evidence)],
    outputSchema: comparisonSchema,
    stream: true,
    agentLoopStrategy: maxIterations(4),
    abortController: controller,
  });
  async function* withCleanup() {
    try {
      yield* validatedComparisonStream(stream, evidence);
    } finally {
      clearTimeout(deadline);
      request.signal.removeEventListener('abort', abort);
    }
  }
  return toServerSentEventsResponse(withCleanup(), { abortController: controller });
}
