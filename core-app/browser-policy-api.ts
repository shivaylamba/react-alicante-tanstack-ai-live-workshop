import { webmcpInputs } from './webmcp-contract';
import { retrievePolicies } from './retrieval';
export async function browserPolicyLookup(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return Response.json({ error: 'Origin rejected' }, { status: 403 });
  const text = await request.text();
  if (text.length > 2000) return Response.json({ error: 'Request too large' }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = webmcpInputs.search_store_policies.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid policy query' }, { status: 400 });
  return Response.json(await retrievePolicies(parsed.data.query));
}
