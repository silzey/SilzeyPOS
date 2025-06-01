
import type { Product, Category } from '@/types/pos';

export const CATEGORIES: Category[] = ["Flower", "Concentrates", "Vapes", "Edibles"];
export const TAGS: string[] = ["Organic", "Hybrid", "Indica", "Sativa"];

const CATEGORY_IMAGES: Record<Category, { urls: string[], hint: string }> = {
  Flower: {
    urls: [
      "https://images.pexels.com/photos/7667726/pexels-photo-7667726.jpeg?auto=compress&cs=tinysrgb&h=225&w=300",
      "https://images.pexels.com/photos/7667760/pexels-photo-7667760.jpeg?auto=compress&cs=tinysrgb&h=225&w=300",
    ],
    hint: "cannabis flower"
  },
  Concentrates: {
    urls: [
      "https://images.pexels.com/photos/7667727/pexels-photo-7667727.jpeg?auto=compress&cs=tinysrgb&h=225&w=300",
      "https://images.pexels.com/photos/7667723/pexels-photo-7667723.jpeg?auto=compress&cs=tinysrgb&h=225&w=300",
    ],
    hint: "cannabis concentrate"
  },
  Vapes: {
    urls: [
      "https://images.pexels.com/photos/4041323/pexels-photo-4041323.jpeg?auto=compress&cs=tinysrgb&h=225&w=300",
      "https://images.pexels.com/photos/3738934/pexels-photo-3738934.jpeg?auto=compress&cs=tinysrgb&h=225&w=300",
    ],
    hint: "vape pen"
  },
  Edibles: {
    urls: [
      // The provided edible links were not very cannabis-specific, using generic food images for now.
      // Consider updating these with more relevant edible images if available.
      "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&h=225&w=300", // pancakes
      "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&h=225&w=300",   // burger
    ],
    hint: "food edible"
  },
};

export const generateProducts = (category: Category): Product[] =>
  Array.from({ length: 50 }, (_, i) => { // Changed from 20 to 50
    const imageInfo = CATEGORY_IMAGES[category];
    return {
      id: `${category}-${i + 1}`,
      name: `${category.slice(0, -1)} Item ${i + 1}`,
      image: imageInfo.urls[i % imageInfo.urls.length], // Cycle through provided images
      dataAiHint: imageInfo.hint,
      price: (Math.random() * 50 + 10).toFixed(2),
      tags: TAGS[i % TAGS.length],
      rating: (Math.random() * 2.5 + 2.5).toFixed(1),
      category: category,
    };
});

