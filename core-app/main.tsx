import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Chat } from '@lesson/Chat';
import { Comparison } from '@lesson/Comparison';
import { WebMCP } from '@lesson/WebMCP';
import { DebugPanel } from '@lesson/DebugPanel';
import { ProductCard } from './product-ui';
import { products, searchProducts, money } from './catalog';
import {
  useBrowserState,
  addToCart,
  filterProducts,
  clearCart,
  removeFromCart,
} from './browser-state';
import { policies } from './policies';
import './style.css';
function App() {
  const state = useBrowserState();
  const [url, setUrl] = useState(location.href),
    [chatOpen, setChatOpen] = useState(true),
    [notice, setNotice] = useState(''),
    [color, setColor] = useState(''),
    [size, setSize] = useState('');
  useEffect(() => {
    const sync = () => setUrl(location.href);
    const navigate = (event: MouseEvent) => {
      const a = (event.target as Element).closest('a');
      if (
        !a ||
        a.target ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const next = new URL(a.href);
      if (next.origin !== location.origin || next.pathname !== '/') return;
      event.preventDefault();
      history.pushState({}, '', next);
      window.dispatchEvent(new Event('popstate'));
      if (next.hash)
        setTimeout(() => document.getElementById(next.hash.slice(1))?.scrollIntoView(), 0);
      else window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', sync);
    document.addEventListener('click', navigate);
    return () => {
      window.removeEventListener('popstate', sync);
      document.removeEventListener('click', navigate);
    };
  }, []);
  const params = new URL(url).searchParams,
    page = params.get('page') ?? 'products';
  const product = products.find((p) => p.id === params.get('product'));
  useEffect(() => {
    setColor(product?.colors[0] ?? '');
    setSize(product?.sizes[0] ?? '');
    setNotice('');
  }, [product?.id]);
  const total = state.cart.reduce(
    (sum, l) => sum + (products.find((p) => p.id === l.productId)?.priceCents ?? 0) * l.quantity,
    0,
  );
  const count = state.cart.reduce((sum, l) => sum + l.quantity, 0);
  const visible = searchProducts(state.filters);
  return (
    <>
      <div className="announcement">
        GOOD THINGS. A LITTLE MORE PERSONAL. <span>Free demo shipping over €50</span>
      </div>
      <header className="site-header">
        <a className="brand" href="/">
          swag<span> / </span>shop
        </a>
        <nav aria-label="Shop navigation">
          <a href="/">The collection</a>
          <a href="/?page=faq">Good to know</a>
          <a href="/?page=cart">Your bag ({count})</a>
        </nav>
        <button onClick={() => setChatOpen(!chatOpen)} aria-expanded={chatOpen}>
          Shopping assistant {chatOpen ? '−' : '+'}
        </button>
      </header>
      <main className={chatOpen ? 'store-layout' : 'store-layout wide'}>
        <section className="shop-content">
          {page === 'faq' ? (
            <>
              <div className="intro">
                <span className="eyebrow">THE SMALL PRINT, MADE SIMPLE</span>
                <h1>Good to know.</h1>
                <p>Clear answers for this fictional workshop store.</p>
              </div>
              {policies.map((p) => (
                <section className="policy" id={p.id} key={p.id}>
                  <h2>{p.title}</h2>
                  <p>{p.text}</p>
                </section>
              ))}
            </>
          ) : page === 'cart' ? (
            <>
              <div className="intro">
                <span className="eyebrow">YOUR FINDS</span>
                <h1>A good little bag.</h1>
                <p>Review your choices before creating a local order preview.</p>
              </div>
              <section aria-label="Shopping cart">
                <h2>Your bag ({count})</h2>
                {!count ? (
                  <p>
                    Your bag is empty. <a href="/">Explore the collection</a>
                  </p>
                ) : (
                  state.cart.map((line, index) => {
                    const p = products.find((p) => p.id === line.productId)!;
                    return (
                      <div
                        className="cart-line"
                        key={`${line.productId}-${line.color}-${line.size}`}
                      >
                        <img src={p.image} alt="" />
                        <div>
                          <a href={`/?product=${p.id}`}>{p.name}</a>
                          <p>
                            {line.color} / {line.size.toUpperCase()} · Quantity {line.quantity}
                          </p>
                          <strong>{money(p.priceCents * line.quantity)}</strong>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          aria-label={`Remove ${p.name}`}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })
                )}
                <div className="cart-total">
                  <span>Subtotal</span>
                  <strong>{money(total)}</strong>
                </div>
                <p>
                  Demo shipping: {total >= 5000 ? 'Free' : money(count ? 400 : 0)}. No payment is
                  collected.
                </p>
                <button
                  disabled={!count}
                  className="primary"
                  onClick={() =>
                    setNotice(
                      `Local order preview: ${count} item(s), total ${money(total + (total >= 5000 ? 0 : 400))}. No order was placed and no payment was taken.`,
                    )
                  }
                >
                  Preview checkout
                </button>{' '}
                <button disabled={!count} onClick={clearCart}>
                  Clear bag
                </button>
                <p role="status">{notice}</p>
              </section>
            </>
          ) : params.has('product') ? (
            product ? (
              <div className="product-detail">
                <a href="/">← Back to collection</a>
                <img className="detail-image" src={product.image} alt={product.name} />
                <span className="eyebrow">{product.category}</span>
                <h1>{product.name}</h1>
                <strong className="price">{money(product.priceCents)}</strong>
                <p>{product.description}</p>
                <div className="variant-controls">
                  <label>
                    Color
                    <select value={color} onChange={(e) => setColor(e.target.value)}>
                      {product.colors.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Size
                    <select value={size} onChange={(e) => setSize(e.target.value)}>
                      {product.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  className="primary"
                  disabled={!product.available}
                  onClick={() => {
                    try {
                      setNotice(
                        addToCart({
                          productId: product.id,
                          color,
                          size,
                          quantity: 1,
                          requestId: crypto.randomUUID(),
                        }).message,
                      );
                    } catch (e) {
                      setNotice(String(e));
                    }
                  }}
                >
                  {product.available ? 'Add to bag' : 'Unavailable'}
                </button>
                <p role="status">{notice}</p>
              </div>
            ) : (
              <h1>Product not found.</h1>
            )
          ) : (
            <>
              <div className="intro">
                <span className="eyebrow">THE EVERYDAY, WITH PERSONALITY</span>
                <h1>
                  Find your
                  <br />
                  <em>kind of thing.</em>
                </h1>
                <p>
                  Wear it. Carry it. Make your desk a little happier.
                  <br />
                  Small finds from the Alicante collection.
                </p>
              </div>
              <div className="filter-bar">
                <label>
                  Category
                  <select
                    aria-label="Category"
                    value={state.filters.category}
                    onChange={(e) => filterProducts({ ...state.filters, category: e.target.value })}
                  >
                    {['all', 'clothing', 'accessories', 'kitchen'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Color
                  <select
                    aria-label="Product color"
                    value={state.filters.color}
                    onChange={(e) => filterProducts({ ...state.filters, color: e.target.value })}
                  >
                    {[
                      'all',
                      'red',
                      'green',
                      'blue',
                      'yellow',
                      'purple',
                      'pink',
                      'black',
                      'white',
                      'gray',
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Budget (€)
                  <input
                    aria-label="Maximum price"
                    type="number"
                    min="0"
                    max="10000"
                    placeholder="Any"
                    value={state.filters.maxPrice ?? ''}
                    onChange={(e) =>
                      filterProducts({
                        ...state.filters,
                        maxPrice: e.target.value === '' ? undefined : Number(e.target.value),
                      })
                    }
                  />
                </label>
                <button onClick={() => filterProducts({})}>Reset</button>
              </div>
              <p className="result-count">{visible.length} finds for you</p>
              <div className="product-grid" aria-label="Product catalog">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {!visible.length && (
                <p>No products match. Try another color or clear your filters.</p>
              )}
            </>
          )}
          <p className="activity" role="status">
            {state.activity}
          </p>
          <details className="workshop-lab">
            <summary>Workshop lab</summary>
            <WebMCP />
            <p>
              Local demo storefront. Product availability and policies are fixtures. Cart changes
              stay on this device.
            </p>
            <a href="/agent.html" target="_blank" rel="noreferrer">
              Open external Nebius agent ↗
            </a>
          </details>
        </section>
        <aside hidden={!chatOpen} className="chat-panel" aria-label="Shopping assistant">
          <Chat />
          <Comparison />
        </aside>
      </main>
      <footer>
        <a className="brand" href="/">
          swag / shop
        </a>
        <p>Made to learn. Built to explore.</p>
        <span>React Alicante × TanStack AI × Nebius</span>
      </footer>
      <DebugPanel />
    </>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
