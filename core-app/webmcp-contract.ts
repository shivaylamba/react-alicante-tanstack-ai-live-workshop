import { z } from 'zod';
import { searchInput, filterInput } from './catalog';
// Shared validation only. The independent consumer never imports tool handlers.
export const webmcpNames = [
  'search_products',
  'get_product_details',
  'search_store_policies',
  'filter_products',
  'show_product',
] as const;
export const webmcpInputs = {
  search_products: searchInput.strict(),
  get_product_details: z.object({ productId: z.string().min(1).max(120) }).strict(),
  search_store_policies: z.object({ query: z.string().min(1).max(240) }).strict(),
  filter_products: filterInput.strict(),
  show_product: z.object({ productId: z.string().min(1).max(120) }).strict(),
};
export function validateBrowserCall(name: string, args: unknown) {
  if (!Object.hasOwn(webmcpInputs, name)) throw new Error('Tool outside the browser allowlist.');
  return webmcpInputs[name as keyof typeof webmcpInputs].parse(args);
}
