import { existsSync } from 'node:fs';
for (const name of ['.env.local', '.env']) {
  if (existsSync(name)) process.loadEnvFile(name);
}
