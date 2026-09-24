import { guardChatStream } from '../../core-app/stream-guard';
import { chat, toServerSentEventsResponse } from '@tanstack/ai';
import { nebiusAdapter } from '../../core-app/provider';
import { readChatRequest } from '../../core-app/request';
import { tools } from './tools';
export async function POST(request: Request) {
  const params = await readChatRequest(request);
  const controller = new AbortController();
  const abort = () => controller.abort();
  request.signal.addEventListener('abort', abort, { once: true });
  const stream = chat({
    adapter: nebiusAdapter(request.headers.get('x-workshop-fault') ?? 'none'),
    messages: params.messages,
    threadId: params.threadId,
    runId: params.runId,
    systemPrompts: [
      'You are the Swag Shop assistant. Use search_products and get_product_details for product facts. Never invent products, prices or availability. You cannot retrieve store policies or change the bag yet.',
    ],
    tools,
    abortController: controller,
  });
  async function* withCleanup() {
    try {
      yield* guardChatStream(stream, controller, request.signal);
    } finally {
      request.signal.removeEventListener('abort', abort);
    }
  }
  return toServerSentEventsResponse(withCleanup(), { abortController: controller });
}
