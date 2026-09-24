import { toolDefinition } from '@tanstack/ai';
import { z } from 'zod';
import { productSchema, searchInput, filterInput } from './catalog';
export { filterInput, searchInput } from './catalog';
export const searchDef = toolDefinition({
  name: 'search_products',
  description:
    'Search the actual store catalog. Use category, color, size, maxPrice in euros and availableOnly for constraints; query is plain product keywords, not the entire user sentence. Empty query lists products. Return actual IDs.',
  inputSchema: searchInput,
  outputSchema: z.object({ products: z.array(productSchema) }),
});
export const detailDef = toolDefinition({
  name: 'get_product_details',
  description: 'Get the current price, available colors and sizes for a known product ID.',
  inputSchema: z.object({ productId: z.string() }),
  outputSchema: productSchema,
});
export const policyDef = toolDefinition({
  name: 'search_store_policies',
  description:
    'Retrieve store policies for returns, shipping, sizing and demo payments. Cite returned source links. Empty results mean no supporting policy.',
  inputSchema: z.object({ query: z.string().min(1).max(240) }),
  outputSchema: z.object({
    mode: z.enum(['lexical', 'semantic']),
    sources: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        text: z.string(),
        href: z.string(),
        score: z.number(),
      }),
    ),
  }),
});
export const cartInput = z.object({
  productId: z.string(),
  color: z.string(),
  size: z.string(),
  quantity: z.number().int().min(1).max(10),
  requestId: z.string().min(1).max(100),
});
export const cartDef = toolDefinition({
  name: 'add_to_cart',
  description:
    'Propose adding an exact catalog product variant and quantity to the local cart. Call this tool to CREATE the Approve/Deny card; describing a proposal in text does not create one. Execution pauses for human approval. Ask for missing size/color preferences first. A singular item request means quantity 1; use larger quantities only when explicitly requested. Supply a unique requestId for this proposal, reuse it only for a retry. Does not purchase or reserve anything.',
  inputSchema: cartInput,
  outputSchema: z.object({ added: z.boolean(), message: z.string() }),
  needsApproval: true,
});
export const filterDef = toolDefinition({
  name: 'filter_products',
  description:
    'Filter the visible storefront product grid by category, color and optional maxPrice in euros. Use all to clear a filter. Reversible browsing only; cannot change cart or buy products.',
  inputSchema: filterInput,
  outputSchema: z.object({ category: z.string(), color: z.string(), visible: z.number() }),
});
