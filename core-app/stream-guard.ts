import { EventType, type StreamChunk } from '@tanstack/ai';

/** Bound the response even if the provider ignores cancellation or ends without an answer. */
export async function* guardChatStream(
  stream: AsyncIterable<StreamChunk>,
  controller: AbortController,
  requestSignal: AbortSignal,
  timeoutMs = 60_000,
): AsyncGenerator<StreamChunk> {
  const iterator = stream[Symbol.asyncIterator]();
  const timeout = Symbol('timeout');
  const disconnected = Symbol('disconnected');
  let timer: ReturnType<typeof setTimeout>;
  let disconnect!: () => void;
  const deadline = new Promise<typeof timeout>((resolve) => {
    timer = setTimeout(() => resolve(timeout), timeoutMs);
  });
  const cancelled = new Promise<typeof disconnected>((resolve) => {
    disconnect = () => resolve(disconnected);
    requestSignal.addEventListener('abort', disconnect, { once: true });
    if (requestSignal.aborted) disconnect();
  });
  let visible = false;
  let terminal = false;
  try {
    while (true) {
      const next = await Promise.race([iterator.next(), deadline, cancelled]);
      if (next === disconnected) return;
      if (next === timeout) {
        yield {
          type: EventType.RUN_ERROR,
          code: 'WORKSHOP_TIMEOUT',
          message:
            'The model took too long to respond. Check your bag before retrying; any earlier approved addition still counts.',
          timestamp: Date.now(),
        };
        return;
      }
      if (next.done) break;
      const chunk = next.value;
      if (
        (chunk.type === 'TEXT_MESSAGE_CONTENT' && chunk.delta.trim()) ||
        chunk.type === 'TOOL_CALL_START'
      )
        visible = true;
      if (chunk.type === 'RUN_ERROR') terminal = true;
      if (chunk.type === 'RUN_FINISHED') {
        // Interrupts are valid responses even without an assistant text part.
        if (chunk.outcome?.type === 'interrupt') visible = true;
        if (!visible && !terminal) {
          yield {
            type: EventType.RUN_ERROR,
            code: 'EMPTY_MODEL_RESPONSE',
            message:
              'The model finished without an answer or a tool proposal. Check your bag before retrying.',
            timestamp: Date.now(),
          };
          return;
        }
        terminal = true;
      }
      yield chunk;
    }
    if (!terminal)
      yield {
        type: EventType.RUN_ERROR,
        code: 'INCOMPLETE_STREAM',
        message: 'The response ended unexpectedly. Check your bag before retrying.',
        timestamp: Date.now(),
      };
  } catch {
    if (!requestSignal.aborted)
      yield {
        type: EventType.RUN_ERROR,
        code: 'PROVIDER_STREAM_ERROR',
        message: 'The model connection failed. Check your connection and bag before retrying.',
        timestamp: Date.now(),
      };
  } finally {
    clearTimeout(timer!);
    requestSignal.removeEventListener('abort', disconnect);
    controller.abort();
    // A stalled iterator may not settle return(); never let cleanup hold the HTTP stream open.
    void iterator.return?.().catch(() => {});
  }
}
