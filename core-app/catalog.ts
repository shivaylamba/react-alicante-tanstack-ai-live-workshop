import { z } from 'zod';
import { PRODUCTS } from './original-products';
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  priceCents: z.number().int(),
  category: z.string(),
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
  image: z.string(),
  description: z.string(),
  available: z.boolean(),
});
export type Product = z.infer<typeof productSchema>;
export const products: Product[] = PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  priceCents: Math.round(p.price * 100),
  category: p.categories.find((c) => c !== 'new') ?? 'accessories',
  colors: [...new Set(p.colors)],
  sizes: [...new Set(p.sizes)],
  image: p.image,
  description: p.description ?? '',
  available: p.id === 'fire-t-shirt' || p.delivery !== 'not_available',
}));
export const filterInput = z.object({
  category: z.enum(['all', 'clothing', 'accessories', 'kitchen']).default('all'),
  color: z
    .enum(['all', 'red', 'green', 'blue', 'yellow', 'purple', 'pink', 'black', 'white', 'gray'])
    .default('all'),
  maxPrice: z.number().min(0).max(10000).optional(),
});
export const searchInput = filterInput.extend({
  query: z.string().max(160).default(''),
  size: z
    .enum(['all', 's', 'm', 'l', 'xl', 'one'])
    .default('all')
    .describe('Use all if the shopper has no size preference.'),
  availableOnly: z.boolean().default(false),
});
export function searchProducts(input: unknown) {
  const q = searchInput.parse(input);
  const terms = q.query.toLowerCase().split(/\s+/).filter(Boolean);
  return products.filter(
    (p) =>
      (q.category === 'all' || p.category === q.category) &&
      (q.color === 'all' || p.colors.includes(q.color)) &&
      (q.size === 'all' || p.sizes.includes(q.size)) &&
      (!q.availableOnly || p.available) &&
      (q.maxPrice === undefined || p.priceCents <= Math.round(q.maxPrice * 100)) &&
      terms.every((t) => `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(t)),
  );
}
export function getProduct(id: string) {
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error('Unknown product ID. Search the catalog first.');
  return product;
}
export function money(cents: number) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}
