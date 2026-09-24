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
  return context.getTools();
}
export async function execute(context: NativeContext, tool: NativeTool, args: unknown) {
  return context.executeTool(tool, JSON.stringify(args));
}
