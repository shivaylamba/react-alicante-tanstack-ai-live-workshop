import { TanStackDevtools } from '@tanstack/react-devtools';
import { aiDevtoolsPlugin } from '@tanstack/react-ai-devtools';
const plugins = [aiDevtoolsPlugin()];
export function DebugPanel() {
  return <TanStackDevtools plugins={plugins} eventBusConfig={{ connectToServerBus: true }} />;
}
