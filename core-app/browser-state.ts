import { useSyncExternalStore } from 'react';
import { z } from 'zod';
import { cartInput } from './definitions';
import { getProduct, filterInput, searchProducts } from './catalog';
const lineSchema = cartInput.omit({ requestId: true });
type Line = z.infer<typeof lineSchema>;
const storageKey = 'swag-shop-cart-v2';
export function validateCart(input: unknown) {
  const value = lineSchema.parse(input);
  const product = getProduct(value.productId);
  if (!product.available) throw new Error('Product unavailable.');
  if (!product.colors.includes(value.color) || !product.sizes.includes(value.size))
    throw new Error('Invalid product variant.');
  return value;
}
function restore(): { cart: Line[]; completed: string[] } {
  if (typeof localStorage === 'undefined') return { cart: [], completed: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
    const cart = z
      .array(lineSchema)
      .max(100)
      .parse(saved.cart ?? [])
      .map(validateCart);
    const completed = z
      .array(z.string())
      .max(500)
      .parse(saved.completed ?? []);
    return { cart, completed };
  } catch {
    return { cart: [], completed: [] };
  }
}
function initialFilters() {
  if (typeof location === 'undefined') return filterInput.parse({});
  const p = new URLSearchParams(location.search);
  const value = filterInput.safeParse({
    category: p.get('category') ?? 'all',
    color: p.get('color') ?? 'all',
    ...(p.has('maxPrice') ? { maxPrice: Number(p.get('maxPrice')) } : {}),
  });
  return value.success ? value.data : filterInput.parse({});
}
let state = { ...restore(), filters: initialFilters(), activity: 'Your shop, your choices.' };
const listeners = new Set<() => void>();
function update(next: typeof state) {
  state = next;
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ cart: state.cart, completed: state.completed }),
      );
    } catch {
      /* Shopping still works if storage is unavailable. */
    }
  }
  listeners.forEach((fn) => fn());
}
export function useBrowserState() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    () => state,
  );
}
export function snapshot() {
  return state;
}
export function addToCart(input: unknown) {
  const args = cartInput.parse(input);
  const line = validateCart(args);
  if (state.completed.includes(args.requestId))
    return { added: false, message: 'This approved request was already applied.' };
  const index = state.cart.findIndex(
    (p) => p.productId === line.productId && p.color === line.color && p.size === line.size,
  );
  const cart = state.cart.map((p) => ({ ...p }));
  if (index >= 0) {
    if (cart[index].quantity + line.quantity > 10)
      throw new Error('Maximum quantity is 10 per variant.');
    cart[index].quantity += line.quantity;
  } else cart.push(line);
  const message = `Added ${line.quantity} × ${getProduct(line.productId).name} (${line.color}, ${line.size})`;
  update({
    ...state,
    cart,
    completed: [...state.completed, args.requestId].slice(-500),
    activity: message,
  });
  return { added: true, message };
}
export function removeFromCart(index: number) {
  update({ ...state, cart: state.cart.filter((_, i) => i !== index), activity: 'Item removed.' });
}
export function clearCart() {
  update({ ...state, cart: [], activity: 'Cart cleared.' });
}
export function resetStore() {
  update({
    ...state,
    cart: [],
    completed: [],
    filters: filterInput.parse({}),
    activity: 'Store reset.',
  });
}
export function filterProducts(input: unknown) {
  const filters = filterInput.parse(input);
  update({ ...state, filters, activity: `Showing ${filters.color} ${filters.category} products` });
  if (typeof window !== 'undefined') {
    const url = new URL(location.href);
    url.search = '';
    url.searchParams.set('category', filters.category);
    url.searchParams.set('color', filters.color);
    if (filters.maxPrice !== undefined) url.searchParams.set('maxPrice', String(filters.maxPrice));
    history.pushState({}, '', url);
    window.dispatchEvent(new Event('popstate'));
  }
  return { ...filters, visible: searchProducts(filters).length };
}
if (typeof window !== 'undefined')
  window.addEventListener('popstate', () => {
    update({ ...state, filters: initialFilters() });
  });
