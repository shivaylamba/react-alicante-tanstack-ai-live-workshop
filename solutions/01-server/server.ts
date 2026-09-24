import { guardChatStream } from '../../core-app/stream-guard';
import { chat, toServerSentEventsResponse } from '@tanstack/ai';
import { nebiusAdapter } from '../../core-app/provider';
import { readChatRequest } from '../../core-app/request';
export async function POST(request: Request) {
  // Supplied: validate incoming messages before calling the provider.
  const params = await readChatRequest(request);
  // Supplied: cancel work when the caller disconnects.
  const controller = new AbortController();
  const abort = () => controller.abort();
  request.signal.addEventListener('abort', abort, { once: true });
  const stream = chat({
    adapter: nebiusAdapter(),
    messages: params.messages,
    threadId: params.threadId,
    runId: params.runId,
    systemPrompts: [
      'You are the Swag Shop assistant. Explain general shopping concepts clearly. You cannot look up products, prices or store policies yet; say so instead of inventing them.',
    ],
    abortController: controller,
  });
  // Supplied: bounded streaming and listener cleanup; inspect in the failure lab later.
  async function* withCleanup() {
    try {
      yield* guardChatStream(stream, controller, request.signal);
    } finally {
      request.signal.removeEventListener('abort', abort);
    }
  }
  return toServerSentEventsResponse(withCleanup(), { abortController: controller });
}
