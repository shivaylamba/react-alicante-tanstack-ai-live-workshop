import { chatParamsFromRequest } from '@tanstack/ai';
export async function readChatRequest(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json'))
    throw new Error('Expected application/json');
  const raw = await request.text();
  if (raw.length > 80_000) throw new Error('Conversation is too large. Start a new chat.');
  const body = JSON.parse(raw);
  if (!Array.isArray(body.messages) || body.messages.length > 60)
    throw new Error('Expected at most 60 messages.');
  // The official parser preserves AG-UI resume metadata; do not destructure only messages.
  return chatParamsFromRequest(
    new Request(request.url, { method: 'POST', headers: request.headers, body: raw }),
  );
}
