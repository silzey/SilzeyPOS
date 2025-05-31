import type { Product, Category } from '@/types/pos';

export const CATEGORIES: Category[] = ["Flower", "Concentrates", "Vapes", "Edibles"];
export const TAGS: string[] = ["Organic", "Hybrid", "Indica", "Sativa"];

const PLACEHOLDER_IMAGE_INFO: Record<Category, { url: string, hint: string }> = {
  Flower: { url: "https://placehold.co/300x200.png", hint: "cannabis flower" },
  Concentrates: { url: "https://placehold.co/300x200.png", hint: "cannabis concentrate" },
  Vapes: { url: "https://placehold.co/300x200.png", hint: "vape pen" },
  Edibles: { url: "https://placehold.co/300x200.png", hint: "cannabis edible" },
};

export const generateProducts = (category: Category): Product[] =>
  Array.from({ length: 20 }, (_, i) => { // Reduced to 20 for faster loading initially
    const imageInfo = PLACEHOLDER_IMAGE_INFO[category];
    return {
      id: `${category}-${i + 1}`,
      name: `${category.slice(0, -1)} Item ${i + 1}`, // e.g. Flower Item 1
      image: imageInfo.url,
      dataAiHint: imageInfo.hint,
      price: (Math.random() * 50 + 10).toFixed(2),
      tags: TAGS[i % TAGS.length],
      rating: (Math.random() * 2.5 + 2.5).toFixed(1), // Rating 2.5 - 5.0 for better appearance
      category: category,
    };
});
