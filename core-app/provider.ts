import OpenAI from 'openai';
import { OpenAICompatibleChatAdapter } from '@tanstack/ai-openai/compatible';

// Our live Nebius model can answer with empty JSON when tools and schema compete.
// Use TanStack's separate tool-loop then structured-finalization path instead.
class NebiusWorkshopAdapter extends OpenAICompatibleChatAdapter<string> {
  override supportsCombinedToolsAndSchema() {
    return false;
  }
}
export function nebiusAdapter(fault = 'none') {
  const mock = process.env.WORKSHOP_MOCK === '1';
  const apiKey = mock ? 'local-fixture' : process.env.NEBIUS_API_KEY;
  if (!apiKey) throw new Error('Missing NEBIUS_API_KEY. Set .env.local or use WORKSHOP_MOCK=1.');
  const client = new OpenAI({
    baseURL: mock
      ? 'http://127.0.0.1:4010/v1'
      : (process.env.NEBIUS_BASE_URL ?? 'https://api.tokenfactory.nebius.com/v1'),
    apiKey,
    defaultHeaders: mock ? { 'x-workshop-fault': fault } : undefined,
    maxRetries: 0,
    timeout: 25_000,
  });
  return new NebiusWorkshopAdapter(
    client,
    process.env.NEBIUS_MODEL ?? 'zai-org/GLM-5.3-Flash',
    'nebius-workshop',
  );
}
