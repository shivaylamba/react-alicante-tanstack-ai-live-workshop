import './env';
import assert from 'node:assert/strict';
import { chat, toolDefinition, maxIterations } from '@tanstack/ai';
import { z } from 'zod';
import { nebiusAdapter } from '../core-app/provider';
if (process.env.WORKSHOP_MOCK === '1')
  throw new Error('Live verification requires WORKSHOP_MOCK=0.');
let calls = 0,
  text = '';
const lookup = toolDefinition({
  name: 'lookup_workshop_code',
  description: 'Return the current workshop code. You must call this tool to know the code.',
  inputSchema: z.object({}),
  outputSchema: z.object({ code: z.string() }),
}).server(() => {
  calls++;
  return { code: 'CEDAR-42' };
});
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 30_000);
try {
  for await (const chunk of chat({
    adapter: nebiusAdapter(),
    messages: [
      {
        role: 'user',
        content: 'Use lookup_workshop_code and tell me the exact code it returns. Do not guess.',
      },
    ],
    tools: [lookup],
    agentLoopStrategy: maxIterations(3),
    abortController: controller,
  })) {
    if (chunk.type === 'TEXT_MESSAGE_CONTENT') text += chunk.delta;
    if (chunk.type === 'RUN_ERROR') throw new Error(chunk.message);
  }
  assert(calls >= 1, 'Model must invoke the tool');
  assert(text.includes('CEDAR-42'), 'Model must ground the answer in the tool result');
  console.log('PASS: live Nebius streaming + server tool execution + grounded continuation.');
} finally {
  clearTimeout(timer);
}
