import { validateComparison } from './comparison-schema';
import { getProduct } from './catalog';
import { ProductCard } from './product-ui';

export function ComparisonResult({ value }: { value: unknown }) {
  let data;
  try {
    data = validateComparison(value);
  } catch {
    return <p role="alert">Comparison rejected: invalid product data.</p>;
  }
  return (
    <article className="comparison-result" aria-label="Product comparison">
      <h3>{data.title}</h3>
      {!data.recommendations.length && (
        <p>No matching products. Try a different budget or preference.</p>
      )}
      <div className="chat-products">
        {data.recommendations.map((item) => (
          <div key={item.productId}>
            <ProductCard compact product={getProduct(item.productId)} />
            <p>{item.reason}</p>
          </div>
        ))}
      </div>
      <p>{data.followUpQuestion}</p>
    </article>
  );
}
