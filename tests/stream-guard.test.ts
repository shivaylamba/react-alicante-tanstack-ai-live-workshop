import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guardChatStream } from '../core-app/stream-guard';
import { EventType, type StreamChunk } from '@tanstack/ai';
async function collect(stream: AsyncIterable<StreamChunk>, ms = 1000) {
  const controller = new AbortController();
  const result = [];
  for await (const c of guardChatStream(stream, controller, new AbortController().signal, ms))
    result.push(c);
  return result;
}
const finish: StreamChunk = {
  type: EventType.RUN_FINISHED,
  threadId: 'test',
  runId: 'test',
  timestamp: Date.now(),
};
test('stalled provider cannot hold response open, even when cleanup hangs', async () => {
  const never = new Promise<IteratorResult<StreamChunk>>(() => {});
  const stream = {
    [Symbol.asyncIterator]() {
      return { next: () => never, return: () => never };
    },
  };
  const result = await collect(stream, 15);
  assert.equal(result[0]?.type, 'RUN_ERROR');
  assert.equal((result[0]?.type === EventType.RUN_ERROR ? result[0].code : undefined), 'WORKSHOP_TIMEOUT');
});
test('empty completion is an explicit error, not a blank successful turn', async () => {
  async function* empty() {
    yield finish;
  }
  const result = await collect(empty());
  assert.equal((result[0]?.type === EventType.RUN_ERROR ? result[0].code : undefined), 'EMPTY_MODEL_RESPONSE');
});
test('approval interrupt remains valid without assistant prose', async () => {
  async function* proposal() {
    yield { ...finish, outcome: { type: 'interrupt' as const, interrupts: [] } };
  }
  const result = await collect(proposal());
  assert.equal(result[0]?.type, 'RUN_FINISHED');
});
test('text answer completes normally and provider failures are actionable', async () => {
  async function* answer() {
    yield {
      type: 'TEXT_MESSAGE_CONTENT',
      messageId: 'm',
      delta: 'Hello',
      timestamp: Date.now(),
    } as StreamChunk;
    yield finish;
  }
  assert.equal((await collect(answer())).at(-1)?.type, 'RUN_FINISHED');
  async function* failed(): AsyncGenerator<StreamChunk> {
    throw new Error('provider internals');
  }
  const result = await collect(failed());
  assert.equal((result[0]?.type === EventType.RUN_ERROR ? result[0].code : undefined), 'PROVIDER_STREAM_ERROR');
  assert(!JSON.stringify(result).includes('provider internals'));
});
test('client cancellation closes without a spurious error', async () => {
  const controller = new AbortController(),
    request = new AbortController();
  request.abort();
  async function* stream(): AsyncGenerator<StreamChunk> {
    await new Promise(() => {});
  }
  const result = [];
  for await (const chunk of guardChatStream(stream(), controller, request.signal, 100))
    result.push(chunk);
  assert.deepEqual(result, []);
});
