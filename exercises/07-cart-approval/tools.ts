import { searchDef, detailDef, policyDef, cartDef } from '../../core-app/definitions';
import { searchProducts, getProduct } from '../../core-app/catalog';
import { retrievePolicies } from '../../core-app/retrieval';
export const search = searchDef.server(async (input) => ({
  products: searchProducts(input).slice(0, 6),
}));
export const details = detailDef.server(async (input) => getProduct(input.productId));
export const policy = policyDef.server(async (input) => retrievePolicies(input.query));
export const tools = [search, details, policy, cartDef];
