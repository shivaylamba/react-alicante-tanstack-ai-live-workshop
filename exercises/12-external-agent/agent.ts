export type NativeTool = {
  name: string;
  description: string;
  inputSchema: string | Record<string, unknown>;
};
export type NativeContext = {
  getTools(): Promise<NativeTool[]>;
  executeTool(tool: NativeTool, input: string): Promise<string>;
};
export async function discover(context: NativeContext) {
  throw new Error('TODO 12A: discover the native registry');
}
export async function execute(context: NativeContext, tool: NativeTool, args: unknown) {
  throw new Error('TODO 12B: execute the selected native tool with serialized arguments');
}
