import { searchDef, detailDef } from '../../core-app/definitions';
import { searchProducts, getProduct } from '../../core-app/catalog';
export const search = searchDef.server(async (input) => ({
  products: [] /* TODO 03: search the real catalog using validated input */,
}));
export const details = detailDef.server(
  async (input) => getProduct('TODO-product-id') /* TODO 03: resolve the requested ID */,
);
export const tools = [search, details];
