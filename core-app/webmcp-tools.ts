import { toolDefinition } from '@tanstack/ai';
import { z } from 'zod';
import { searchDef, detailDef, policyDef, filterDef } from './definitions';
import { searchProducts, getProduct } from './catalog';
import { filterProducts } from './browser-state';
import { webmcpInputs } from './webmcp-contract';
export function showProduct(input: unknown) {
  const { productId } = webmcpInputs.show_product.parse(input);
  const product = getProduct(productId);
  const href = `/?product=${encodeURIComponent(product.id)}`;
  if (typeof window !== 'undefined') {
    history.pushState({}, '', href);
    window.dispatchEvent(new Event('popstate'));
  }
  return { productId: product.id, name: product.name, href };
}
export async function browserPolicies(input: unknown) {
  const args = webmcpInputs.search_store_policies.parse(input);
  const response = await fetch('/api/browser-policies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Policy lookup failed (${response.status}).`);
  return policyDef.outputSchema.parse(await response.json());
}
const showDef = toolDefinition({
  name: 'show_product',
  description:
    'Show an inspected catalog product on the visible storefront. Use its actual ID after checking details. Navigation only; does not select a variant, change cart, reserve or purchase.',
  inputSchema: webmcpInputs.show_product,
  outputSchema: z.object({ productId: z.string(), name: z.string(), href: z.string() }),
});
export const browserTools = [
  searchDef.client(async (input) => ({ products: searchProducts(input).slice(0, 6) })),
  detailDef.client(async (input) => getProduct(input.productId)),
  policyDef.client(browserPolicies),
  filterDef.client(filterProducts),
  showDef.client(showProduct),
];
