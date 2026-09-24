export const policies = [
  {
    id: 'returns',
    title: 'Returns and refunds',
    text: 'Return unused products within 30 days of delivery in their original packaging. Contact the demo store support team before returning. Refunds go to the original payment method after inspection.',
    keywords: 'return returns refund refunds exchange unwanted fit size',
    questions:
      'Can I send back something that does not fit? How do I get my money back? What is the return policy?',
    href: '/?page=faq#returns',
  },
  {
    id: 'shipping',
    title: 'Shipping',
    text: 'Demo delivery is 3–5 business days for available products. Shipping is free for baskets of €50 or more; otherwise it costs €4. Delivery estimates are fictional workshop data.',
    keywords: 'shipping delivery arrive days postage cost free',
    questions: 'When will my package arrive? How much does delivery cost?',
    href: '/?page=faq#shipping',
  },
  {
    id: 'sizing',
    title: 'Choosing a size',
    text: 'Available sizes are listed on each product page. Select one of the listed variants before adding to your cart. One-size accessories use the size value one.',
    keywords: 'sizes sizing medium large small variant measurements',
    questions: 'Which sizes can I choose?',
    href: '/?page=faq#sizing',
  },
  {
    id: 'payments',
    title: 'Demo checkout',
    text: 'This workshop store does not process payments or place real orders. Its checkout creates a local order preview only. Never enter payment details.',
    keywords: 'payment pay checkout order purchase credit card',
    questions: 'Can I pay for an order here?',
    href: '/?page=faq#payments',
  },
];
export type Policy = (typeof policies)[number];
