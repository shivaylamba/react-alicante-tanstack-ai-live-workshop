import { z } from 'zod';
import { getProduct } from './catalog';

// Only IDs and explanatory prose are generated. Prices, images and links come from the catalog.
export const comparisonSchema = z
  .object({
    title: z.string().min(1).max(120),
    recommendations: z
      .array(
        z
          .object({
            productId: z.string().min(1),
            reason: z.string().min(1).max(300),
          })
          .strict(),
      )
      .max(3),
    followUpQuestion: z.string().max(200),
  })
  .strict();
export type ComparisonData = z.infer<typeof comparisonSchema>;

export function validateComparison(value: unknown, evidenceIds?: Set<string>): ComparisonData {
  const data = comparisonSchema.parse(value);
  const seen = new Set<string>();
  for (const item of data.recommendations) {
    const product = getProduct(item.productId);
    if (!product.available) throw new Error('Comparison contains an unavailable product.');
    if (seen.has(item.productId)) throw new Error('Comparison repeats a product.');
    if (evidenceIds && !evidenceIds.has(item.productId))
      throw new Error('Comparison references a product not retrieved in this run.');
    seen.add(item.productId);
  }
  return data;
}
