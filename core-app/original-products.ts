export enum Color {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
  PURPLE = 'purple',
  PINK = 'pink',
  BLACK = 'black',
  WHITE = 'white',
  GRAY = 'gray',
}

export const COLORS: Record<Color, { label: string; hex: string }> = {
  [Color.RED]: { label: 'Red', hex: '#EF4444' },
  [Color.GREEN]: { label: 'Green', hex: '#10B981' },
  [Color.BLUE]: { label: 'Blue', hex: '#3B82F6' },
  [Color.YELLOW]: { label: 'Yellow', hex: '#F59E0B' },
  [Color.PURPLE]: { label: 'Purple', hex: '#8B5CF6' },
  [Color.PINK]: { label: 'Pink', hex: '#EC4899' },
  [Color.BLACK]: { label: 'Black', hex: '#111827' },
  [Color.WHITE]: { label: 'White', hex: '#F9FAFB' },
  [Color.GRAY]: { label: 'Gray', hex: '#6B7280' },
};

export enum Size {
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl',
  ONE_SIZE = 'one',
}

export const SIZES: Record<Size, string> = {
  [Size.S]: 'S',
  [Size.M]: 'M',
  [Size.L]: 'L',
  [Size.XL]: 'XL',
  [Size.ONE_SIZE]: 'One Size',
};

export enum Category {
  NEW = 'new',
  CLOTHING = 'clothing',
  ACCESSORIES = 'accessories',
  KITCHEN = 'kitchen',
}

export const CATEGORIES: Record<Category, { label: string; mainCat: boolean }> = {
  [Category.NEW]: { label: 'New Arrivals', mainCat: false },
  [Category.CLOTHING]: { label: 'Clothing', mainCat: true },
  [Category.ACCESSORIES]: { label: 'Accessories', mainCat: true },
  [Category.KITCHEN]: { label: 'Kitchen', mainCat: true },
};

export enum Delivery {
  IN_STOCK = 'in_stock',
  TWO_DAYS = '2_days',
  TWO_WEEKS = '2_weeks',
  NOT_AVAILABLE = 'not_available',
}

export const DELIVERY_TIMES: Record<Delivery, string> = {
  [Delivery.IN_STOCK]: 'In stock',
  [Delivery.TWO_DAYS]: 'Ships in 2 days',
  [Delivery.TWO_WEEKS]: 'Ships in 2 weeks',
  [Delivery.NOT_AVAILABLE]: 'Not available',
};

export interface Product {
  id: string;
  name: string;
  price: number;
  tags: Array<string>;
  categories: Array<Category>;
  colors: Array<Color>;
  sizes: Array<Size>;
  rating?: number;
  image: string;
  description?: string;
  delivery: Delivery;
}

const productIdCount = new Map<string, number>();
export const PRODUCTS: Array<Product> = [
  {
    name: 'Fire T-Shirt',
    price: 20,
    tags: ['fire', 'hot'],
    categories: [Category.CLOTHING],
    colors: [Color.RED, Color.BLACK],
    sizes: [Size.S, Size.M, Size.L],
    description:
      'This fiery T-shirt features a bold flame emoji design, making it the perfect statement piece for those who love heat and energy. Comfortable fit and high-quality fabric ensure durability and style.',
    rating: 5,
    image: '/products/fire-tshirt.webp',
    delivery: Delivery.TWO_WEEKS,
  },
  {
    name: 'Laughing Mug',
    price: 13,
    tags: ['funny', 'laugh'],
    categories: [Category.KITCHEN],
    colors: [Color.WHITE, Color.YELLOW],
    sizes: [Size.ONE_SIZE],
    rating: 4,
    image: '/products/laughing-mug.webp',
    description:
      'Start your day with laughter! This ceramic mug features the classic laughing emoji, bringing a fun and cheerful touch to your morning coffee or tea.',
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Rocket Hoodie',
    price: 40,
    tags: ['space', 'cool'],
    categories: [Category.CLOTHING],
    colors: [Color.BLACK, Color.BLUE],
    sizes: [Size.M, Size.L, Size.XL],
    rating: 5,
    image: '/products/rocket-hoodie.webp',
    description:
      'Blast off in style with this space-themed hoodie featuring a vibrant rocket emoji. Perfect for space lovers and those who dream big!',
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Cactus Tote Bag',
    price: 15,
    tags: ['nature', 'plants'],
    categories: [Category.ACCESSORIES, Category.NEW],
    colors: [Color.GREEN, Color.BLUE],
    sizes: [Size.ONE_SIZE],
    rating: 4,
    image: '/products/cactus-bag.webp',
    description:
      "Stay eco-friendly with this stylish cactus-themed tote bag. Made from durable material, it's perfect for shopping, school, or everyday use.",
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Pizza Socks',
    price: 10,
    tags: ['food', 'fun'],
    categories: [Category.CLOTHING, Category.ACCESSORIES],
    colors: [Color.YELLOW, Color.RED],
    sizes: [Size.M, Size.L],
    rating: 3,
    image: '/products/pizza-socks.webp',
    description:
      'Show off your love for pizza with these deliciously fun socks! Featuring a pizza slice pattern, these socks are perfect for food lovers.',
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Guitar T-Shirt',
    price: 18,
    tags: ['music', 'cool'],
    categories: [Category.CLOTHING],
    colors: [Color.BLACK, Color.WHITE],
    sizes: [Size.M, Size.L],
    rating: 4,
    image: '/products/guitar-tshirt.webp',
    description:
      'Rock out in style with this cool guitar-themed T-shirt. Made for music lovers, it features a striking guitar emoji design.',
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Alien Beanie',
    price: 17,
    tags: ['space', 'cool'],
    categories: [Category.ACCESSORIES, Category.CLOTHING],
    colors: [Color.GREEN, Color.BLACK],
    sizes: [Size.ONE_SIZE],
    rating: 5,
    image: '/products/alien-beanie.webp',
    description:
      "Stay warm and stylish with this alien-themed beanie. Featuring a bold green alien emoji, it's perfect for sci-fi fans!",
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Bicycle Water Bottle',
    price: 19,
    tags: ['sport', 'cycling'],
    categories: [Category.KITCHEN],
    colors: [Color.BLUE, Color.WHITE],
    sizes: [Size.ONE_SIZE],
    image: '/products/bicycle-water-bottle.webp',
    rating: 4,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Dog Emoji Cap',
    price: 23,
    tags: ['pets', 'cute'],
    categories: [Category.ACCESSORIES],
    colors: [Color.BLACK, Color.BLACK],
    sizes: [Size.ONE_SIZE],
    image: '/products/dog-cap.webp',
    rating: 5,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Avocado Socks',
    price: 12,
    tags: ['food', 'cute'],
    categories: [Category.CLOTHING, Category.ACCESSORIES],
    colors: [Color.GREEN, Color.YELLOW],
    sizes: [Size.M, Size.L],
    image: '/products/avocado-socks.webp',
    rating: 4,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Cool Sunglasses',
    price: 20,
    tags: ['cool', 'style'],
    categories: [Category.ACCESSORIES],
    colors: [Color.BLACK, Color.BLUE],
    sizes: [Size.ONE_SIZE],
    image: '/products/cool-sunglasses.webp',
    rating: 5,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Moon & Stars Hoodie',
    price: 35,
    tags: ['space', 'calm'],
    categories: [Category.CLOTHING],
    colors: [Color.BLACK, Color.WHITE],
    sizes: [Size.S, Size.M, Size.L],
    image: '/products/m-s-hoodie.webp',
    rating: 5,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Cat Coffee Mug',
    price: 16,
    tags: ['pets', 'cute'],
    categories: [Category.KITCHEN],
    colors: [Color.WHITE, Color.GRAY],
    sizes: [Size.ONE_SIZE],
    image: '/products/cat-mug.webp',
    rating: 5,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Sunflower Tote Bag',
    price: 18,
    tags: ['nature', 'flowers'],
    categories: [Category.ACCESSORIES, Category.NEW],
    colors: [Color.YELLOW, Color.GREEN],
    sizes: [Size.ONE_SIZE],
    image: '/products/sunflower-bag.webp',
    rating: 4,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Game Controller T-Shirt',
    price: 22,
    tags: ['gaming', 'fun'],
    categories: [Category.CLOTHING],
    colors: [Color.BLACK, Color.GRAY],
    sizes: [Size.S, Size.M, Size.L],
    image: '/products/game-tshirt.webp',
    rating: 5,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Strawberry Earrings',
    price: 14,
    tags: ['cute', 'fashion'],
    categories: [Category.ACCESSORIES],
    colors: [Color.RED, Color.GREEN],
    sizes: [Size.ONE_SIZE],
    image: '/products/strawberry-earrings.webp',
    rating: 4,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Panda Hoodie',
    price: 38,
    tags: ['animals', 'cute'],
    categories: [Category.CLOTHING, Category.NEW],
    colors: [Color.BLACK],
    sizes: [Size.S, Size.M, Size.L],
    image: '/products/panda-hoodie.webp',
    rating: 5,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Wave Sweatshirt',
    price: 34,
    tags: ['ocean', 'calm'],
    categories: [Category.CLOTHING],
    colors: [Color.BLUE, Color.WHITE],
    sizes: [Size.M, Size.L, Size.XL],
    image: '/products/wave-sweatshirt.webp',
    rating: 4,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Lemon Backpack',
    price: 28,
    tags: ['fruits', 'fun'],
    categories: [Category.ACCESSORIES],
    colors: [Color.YELLOW, Color.GREEN],
    sizes: [Size.ONE_SIZE],
    image: '/products/cactus-bag.webp',
    rating: 5,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Pixel Sunglasses',
    price: 21,
    tags: ['meme', 'fun'],
    categories: [Category.ACCESSORIES],
    colors: [Color.BLACK],
    sizes: [Size.ONE_SIZE],
    image: '/products/pixel-sunglasses.webp',
    rating: 5,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Frog Beanie',
    price: 17,
    tags: ['animals', 'cute'],
    categories: [Category.ACCESSORIES, Category.NEW],
    colors: [Color.GREEN],
    sizes: [Size.ONE_SIZE],
    image: '/products/frog-beanie.webp',
    rating: 5,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Basketball Cap',
    price: 19,
    tags: ['sports', 'active'],
    categories: [Category.ACCESSORIES, Category.NEW],
    colors: [Color.YELLOW, Color.BLACK],
    sizes: [Size.ONE_SIZE],
    image: '/products/basketball-cap.webp',
    rating: 4,
    delivery: Delivery.TWO_DAYS,
  },
  {
    name: 'Racing T-Shirt',
    price: 22,
    tags: ['cars', 'speed'],
    categories: [Category.CLOTHING],
    colors: [Color.RED, Color.BLACK],
    sizes: [Size.M, Size.L],
    image: '/products/racing-tshirt.webp',
    rating: 4,
    delivery: Delivery.TWO_WEEKS,
  },
  {
    name: 'Watermelon Water Bottle',
    price: 20,
    tags: ['food', 'fun'],
    categories: [Category.KITCHEN],
    colors: [Color.RED, Color.GREEN],
    sizes: [Size.ONE_SIZE],
    image: '/products/melon-bottle.webp',
    rating: 4,
    delivery: Delivery.IN_STOCK,
  },
  {
    name: 'Ghost Sweatshirt',
    price: 32,
    tags: ['spooky', 'fun'],
    categories: [Category.CLOTHING],
    colors: [Color.WHITE, Color.BLACK],
    sizes: [Size.M, Size.L],
    image: '/products/ghost-sweatshirt.webp',
    rating: 5,
    delivery: Delivery.IN_STOCK,
  },
].map((product) => {
  const baseId = product.name
    .toLowerCase() // Convert to lowercase
    .normalize('NFD') // Normalize to remove diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
    .trim() // Trim leading and trailing spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-');

  let id = baseId;
  const count = productIdCount.get(baseId) || 0;

  if (count > 0) {
    id = `${baseId}-${count}`;
  }
  productIdCount.set(baseId, count + 1);
  productIdCount.set(id, 1);

  return {
    ...product,
    image: product.image || `/products/coming-soon.webp`,
    id,
  };
});
