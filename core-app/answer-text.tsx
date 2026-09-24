import { policies } from './policies';
import { products } from './catalog';
// A deliberately small, escaped rich-text renderer: no raw HTML or arbitrary URLs.
export function AnswerText({ text }: { text: string }) {
  const chunks = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <p>
      {chunks.map((chunk, index) => {
        if (chunk.startsWith('**') && chunk.endsWith('**'))
          return <b key={index}>{chunk.slice(2, -2)}</b>;
        const match = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          const [, label, href] = match;
          const allowed =
            policies.some((p) => p.href === href) ||
            products.some((p) => `/?product=${p.id}` === href);
          return allowed ? (
            <a key={index} href={href}>
              {label}
            </a>
          ) : (
            <span key={index}>{label}</span>
          );
        }
        return chunk;
      })}
    </p>
  );
}
