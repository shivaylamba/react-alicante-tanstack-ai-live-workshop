import { discover, execute, type NativeTool } from '@lesson/agent';
import { webmcpNames, validateBrowserCall } from './webmcp-contract';
// Independent consumer: no imports from the app's tool definitions or handlers.

type ModelContext = {
  getTools(): Promise<NativeTool[]>;
  executeTool(tool: NativeTool, input: string): Promise<string>;
};
const frame = document.querySelector<HTMLIFrameElement>('#workshop')!;
const prompt = document.querySelector<HTMLTextAreaElement>('#prompt')!;
const run = document.querySelector<HTMLButtonElement>('#run')!;
const status = document.querySelector<HTMLElement>('#status')!;
const trace = document.querySelector<HTMLElement>('#trace')!;
run.disabled = true;
async function waitForRegistry() {
  run.disabled = true;
  status.textContent = 'Waiting for native tool registration…';
  for (let attempt = 0; attempt < 100; attempt++) {
    const target = frame.contentDocument as Document & { modelContext?: ModelContext };
    const registry = target?.modelContext ? await target.modelContext.getTools() : [];
    if (
      target?.modelContext &&
      webmcpNames.every((name) => registry.some((tool) => tool.name === name))
    ) {
      status.textContent = 'Ready. Native shopping tools discovered.';
      run.disabled = false;
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  status.textContent =
    'Native shopping tools unavailable. Enable Chrome WebMCP and load solution 12, then reload this page.';
}
frame.addEventListener('load', () => {
  void waitForRegistry();
});
void waitForRegistry();
run.onclick = async () => {
  run.disabled = true;
  trace.textContent = '';
  status.textContent = 'Discovering native tools…';
  const log = (event: string, data: unknown) => {
    trace.textContent += `${event}\n${JSON.stringify(data, null, 2)}\n\n`;
  };
  try {
    const target = frame.contentDocument as Document & { modelContext?: ModelContext };
    const context = target?.modelContext;
    if (!context) throw new Error('Native WebMCP unavailable. Enable Chrome flags and relaunch.');
    const registry = await discover(context);
    log(
      'Native registry',
      registry.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
    );
    if (
      registry.length !== webmcpNames.length ||
      !webmcpNames.every((name) => registry.some((tool) => tool.name === name))
    )
      throw new Error('Expected exactly the five allowed shopping tools; no cart or checkout.');
    const tools = registry.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: typeof t.inputSchema === 'string' ? JSON.parse(t.inputSchema) : t.inputSchema,
    }));
    const messages: Record<string, unknown>[] = [{ role: 'user', content: prompt.value }];
    let toolCalls = 0;
    for (let step = 0; step < 8; step++) {
      status.textContent = `Waiting for Nebius (step ${step + 1})…`;
      const response = await fetch('/api/external-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools, messages }),
        signal: AbortSignal.timeout(65_000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Agent request failed');
      log('Nebius selected response', data);
      messages.push(data.message);
      const calls = data.message.tool_calls;
      if (!calls?.length) {
        status.textContent = 'Complete. Inspect the trace and target page.';
        return;
      }
      for (const call of calls) {
        const tool = registry.find((t) => t.name === call.function.name);
        if (!tool) throw new Error('Model requested a tool outside the discovered registry.');
        const args = JSON.parse(call.function.arguments);
        if (++toolCalls > 12) throw new Error('Agent tool-call limit reached (12).');
        validateBrowserCall(tool.name, args);
        const result = await execute(context, tool, args);
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        log('Native execution result', { name: tool.name, arguments: args, result });
        log('Rendered target evidence', {
          productId: new URL(frame.contentWindow!.location.href).searchParams.get('product'),
          heading: target.querySelector('h1')?.textContent,
          category: target.querySelector<HTMLSelectElement>('[aria-label=Category]')?.value,
          color: target.querySelector<HTMLSelectElement>('[aria-label="Product color"]')?.value,
          cards: target.querySelectorAll('.product-grid .product-card').length,
        });
        messages.push({ role: 'tool', tool_call_id: call.id, content: result });
      }
    }
    throw new Error('Agent step limit reached.');
  } catch (error) {
    status.textContent = `Failed: ${error instanceof Error ? error.message : String(error)}`;
  } finally {
    run.disabled = false;
  }
};
