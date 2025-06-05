
"use client";

import type { Order, CartItem, Category as ProductCategory, OrderStatus } from '@/types/pos';
import { CATEGORIES as PRODUCT_CATEGORIES_LIST, TAGS as PRODUCT_TAGS_LIST } from '@/lib/data';

// Statuses to be used for generating initial mock orders.
// "Pending Checkout" is typically not an initial state for these mocks.
const MOCK_GENERATION_ORDER_STATUSES: OrderStatus[] = ["In-Store", "Online"];

// Copied from src/app/dashboard/orders/page.tsx
const CATEGORY_ORDER_IMAGES: Record<ProductCategory, { url: string; hint: string }[]> = {
  "Flower": [
    { url: "https://images.pexels.com/photos/7667726/pexels-photo-7667726.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", hint: "cannabis flower" },
    { url: "https://images.pexels.com/photos/7955084/pexels-photo-7955084.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", hint: "cannabis bud" },
    { url: "https://images.pexels.com/photos/12960959/pexels-photo-12960959.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", hint: "cannabis plant" },
  ],
  "Concentrates": [
    { url: "https://images.pexels.com/photos/7667723/pexels-photo-7667723.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", hint: "cannabis concentrate" },
    { url: "https://images.pexels.com/photos/7667727/pexels-photo-7667727.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", hint: "cannabis oil" },
  ],
  "Vapes": [
    { url: "https://images.pexels.com/photos/8169697/pexels-photo-8169697.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", hint: "vape pen" },
    { url: "https://images.pexels.com/photos/7667737/pexels-photo-7667737.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", hint: "vape cartridge" },
  ],
  "Edibles": [
    { url: "https://images.pexels.com/photos/7758036/pexels-photo-7758036.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", hint: "cannabis edibles" },
    { url: "https://images.pexels.com/photos/7667756/pexels-photo-7667756.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", hint: "cannabis cookies" },
    { url: "https://images.pexels.com/photos/5407073/pexels-photo-5407073.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", hint: "cannabis chocolate" },
  ],
};

const mockProductNamesByCategory: Record<ProductCategory, string[]> = {
  "Flower": ["Mystic Haze Flower", "Stardust Sativa Pre-Roll", "Quasar Queen Flower", "Blue Dream Bud", "Green Crack Strain"],
  "Concentrates": ["Galaxy Gold Concentrate", "Cosmic Kush Shatter", "Nebula Nectar Wax", "Lunar Rosin", "Solar Flare Oil"],
  "Vapes": ["Orion's Haze Vape Pen", "Pulsar Pineapple Express Cartridge", "Zero-G Indica Disposable", "Comet Berry Vape", "Astro Mint Pods"],
  "Edibles": ["Lunar Lavender Gummies", "Orion's Belt Brownies", "Cosmic Kush Cookies", "Stardust Cereal Bar", "Nebula Nectar Chocolate"],
};

const getMockItemImageForOrder = (category: ProductCategory, index: number): { url: string; hint: string } => {
  const imagesForCategory = CATEGORY_ORDER_IMAGES[category];
  return imagesForCategory[index % imagesForCategory.length];
};

const generateMockCartItemsForOrder = (itemCount: number): CartItem[] => {
  const items: CartItem[] = [];
  const usedNames: Set<string> = new Set();
  for (let i = 0; i < itemCount; i++) {
    const category = PRODUCT_CATEGORIES_LIST[Math.floor(Math.random() * PRODUCT_CATEGORIES_LIST.length)];
    const productNamesForCategory = mockProductNamesByCategory[category];
    let name = productNamesForCategory[Math.floor(Math.random() * productNamesForCategory.length)];
    let uniqueNameAttempt = 0;
    while(usedNames.has(`${category}-${name}`) && uniqueNameAttempt < productNamesForCategory.length * 2) {
        name = productNamesForCategory[Math.floor(Math.random() * productNamesForCategory.length)];
        uniqueNameAttempt++;
    }
    usedNames.add(`${category}-${name}`);
    const imageDetails = getMockItemImageForOrder(category, i);
    items.push({
      id: `product-item-${category}-${Math.random().toString(36).substring(2, 9)}`,
      name: name,
      price: (Math.random() * 40 + 10).toFixed(2),
      tags: PRODUCT_TAGS_LIST[Math.floor(Math.random() * PRODUCT_TAGS_LIST.length)],
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      category: category,
      image: imageDetails.url,
      dataAiHint: imageDetails.hint,
      quantity: Math.floor(Math.random() * 3) + 1,
    });
  }
  return items;
};

export const generateInitialMockOrders = (): Order[] => Array.from({ length: 25 }, (_, i) => {
  // Use MOCK_GENERATION_ORDER_STATUSES for status assignment
  const status = MOCK_GENERATION_ORDER_STATUSES[i % MOCK_GENERATION_ORDER_STATUSES.length];
  const date = new Date(2024, 6, 28 - (i % 28)); // Month is 0-indexed, so 6 is July
  const items = generateMockCartItemsForOrder(Math.floor(Math.random() * 4) + 1);
  const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  return {
    id: `MOCK-ORD-${String(1001 + i).padStart(4, '0')}`,
    customerName: ['Liam Smith', 'Olivia Johnson', 'Noah Williams', 'Emma Brown', 'Oliver Jones'][i % 5],
    orderDate: date.toISOString(),
    status: status,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    items: items,
    shippingAddress: `${123 + i} Main St, Anytown, USA`,
    paymentMethod: ['Credit Card', 'PayPal', 'Stripe', 'Cash'][i % 4]
  };
});
