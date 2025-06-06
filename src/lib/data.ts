
import type { Product, Category } from '@/types/pos';

export const CATEGORIES: Category[] = ["Flower", "Concentrates", "Vapes", "Edibles"];
export const TAGS: string[] = ["Organic", "Hybrid", "Indica", "Sativa"];

// This CATEGORY_IMAGES is part of a legacy generateProducts function and might not be actively used
// for the main inventory display. However, updating it ensures consistency if it's ever called.
// The primary product images are driven by mockInventory.ts which uses its own Pexels links.
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
  Edibles: { // Updated to use cannabis-specific Pexels images
    urls: [
      "https://images.pexels.com/photos/7758036/pexels-photo-7758036.jpeg?auto=compress&cs=tinysrgb&w=300&h=225&dpr=1", // cannabis gummies
      "https://images.pexels.com/photos/7667756/pexels-photo-7667756.jpeg?auto=compress&cs=tinysrgb&w=300&h=225&dpr=1", // cannabis cookies
      "https://images.pexels.com/photos/5407073/pexels-photo-5407073.jpeg?auto=compress&cs=tinysrgb&w=300&h=225&dpr=1", // cannabis chocolate
    ],
    hint: "cannabis edible"
  },
};

// This function generates products based on the CATEGORY_IMAGES above.
// It's likely legacy and not the primary source for your app's inventory,
// which comes from src/lib/mockInventory.ts.
export const generateProducts = (category: Category): Product[] =>
  Array.from({ length: 50 }, (_, i) => {
    const imageInfo = CATEGORY_IMAGES[category];
    return {
      id: `${category}-${i + 1}`,
      name: `${category.slice(0, -1)} Item ${i + 1}`,
      image: imageInfo.urls[i % imageInfo.urls.length],
      dataAiHint: imageInfo.hint,
      price: (Math.random() * 50 + 10).toFixed(2),
      tags: TAGS[i % TAGS.length],
      rating: (Math.random() * 2.5 + 2.5).toFixed(1),
      category: category,
    };
});
