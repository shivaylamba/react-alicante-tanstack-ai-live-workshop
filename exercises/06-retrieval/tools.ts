import { searchDef, detailDef, policyDef } from '../../core-app/definitions';
import { searchProducts, getProduct } from '../../core-app/catalog';
import { retrievePolicies } from '../../core-app/retrieval';
export const search = searchDef.server(async (input) => ({
  products: searchProducts(input).slice(0, 6),
}));
export const details = detailDef.server(async (input) => getProduct(input.productId));
export const policy = policyDef.server(
  async (input) => ({
    mode: 'lexical' as const,
    sources: [],
  }) /* TODO 06A: retrieve policies for this query */,
);
export const tools = [search, details, policy];
