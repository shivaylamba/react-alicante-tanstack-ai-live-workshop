import { type Product, money, products } from './catalog';
import { policies } from './policies';
export function ProductCard({
  product: p,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  return (
    <article className={compact ? 'product-card compact' : 'product-card'}>
      <a href={`/?product=${p.id}`}>
        <div className="product-image">
          <img src={p.image} alt={p.name} loading="lazy" />
          {!p.available && <span className="sold-out">Unavailable</span>}
        </div>
        <div className="product-caption">
          <h3>{p.name}</h3>
          <strong>{money(p.priceCents)}</strong>
        </div>
      </a>
      <p>
        {p.category} · {p.colors.join(' / ')}
      </p>
    </article>
  );
}
export function GroundedResults({ name, output }: { name: string; output: unknown }) {
  let value: any = output;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (name === 'search_store_policies' && Array.isArray(value?.sources))
    return (
      <div className="sources">
        <p>Retrieved sources · {value.mode}</p>
        {value.sources.length ? (
          value.sources.map((s: any) => {
            const p = policies.find((p) => p.id === s.id);
            return p ? (
              <a key={p.id} href={p.href}>
                {p.title} ↗
              </a>
            ) : null;
          })
        ) : (
          <p>No supporting policy found.</p>
        )}
      </div>
    );
  const items =
    name === 'search_products' ? value?.products : name === 'get_product_details' ? [value] : null;
  if (!Array.isArray(items)) return null;
  // Resolve IDs against the catalog; never render model-authored prices or links.
  const found = items
    .map((item: any) => products.find((p) => p.id === item?.id))
    .filter((p): p is Product => !!p);
  return (
    <div className="chat-products">
      {found.length ? (
        found.map((p) => <ProductCard key={p.id} product={p} compact />)
      ) : (
        <p>No matching products.</p>
      )}
    </div>
  );
}
