import { searchDef, detailDef } from '../../core-app/definitions';
import { searchProducts, getProduct } from '../../core-app/catalog';
export const search = searchDef.server(async (input) => ({
  products: searchProducts(input).slice(0, 6),
}));
export const details = detailDef.server(async (input) => getProduct(input.productId));
export const tools = [search, details];
