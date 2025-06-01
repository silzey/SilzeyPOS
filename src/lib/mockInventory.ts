
"use client";
// Using "use client" here if it might be used by client components directly,
// though for data generation it's often not strictly necessary unless it uses client-only APIs.
// For this mock data, it's fine.

import type { InventoryItem, Category } from '@/types/pos';
import { CATEGORIES as PRODUCT_CATEGORIES_LIST } from '@/lib/data';

export const MOCK_SUPPLIERS = ["GreenLeaf Farms", "HighHarvest Co.", "BudBrothers Inc.", "Natural Wonders LLC", "Quality Cannabis Supply"];

export const generateMockInventory = (): InventoryItem[] => {
  const items: InventoryItem[] = [];
  const baseNames: Record<Category, string[]> = {
    "Flower": ["Aurora Haze", "Cosmic Bloom", "Lunar Kush", "Solar Flare OG", "Nebula Nugs"],
    "Concentrates": ["Galaxy Gold Shatter", "Stardust Rosin", "Pulsar Diamonds", "Void Extract", "Comet Crumble"],
    "Vapes": ["Orion Haze Pen", "Astro-Vape Cartridge", "Zero-G Disposable", "Celestial Cloud Pod", "Meteor Mist Kit"],
    "Edibles": ["Lunar Lavender Gummies", "Cosmic Caramel Chews", "Stardust Swirl Brownies", "Nebula Nectar Cookies", "Planet Peach Pastries"],
  };

  for (let i = 0; i < 30; i++) { // Number of mock items
    const category = PRODUCT_CATEGORIES_LIST[i % PRODUCT_CATEGORIES_LIST.length];
    const nameBase = baseNames[category][Math.floor(Math.random() * baseNames[category].length)];
    const stock = Math.floor(Math.random() * 200) + (i % 5 === 0 ? 0 : 5); // Some out of stock
    const lowStockThreshold = Math.floor(Math.random() * 20) + 10;
    const purchasePrice = parseFloat((Math.random() * 20 + 5).toFixed(2));
    const salePrice = parseFloat((purchasePrice * (1.5 + Math.random())).toFixed(2)); // 50-150% markup

    items.push({
      id: `INV-ITEM-${String(1001 + i).padStart(4, '0')}`,
      name: `${nameBase} #${Math.floor(i/PRODUCT_CATEGORIES_LIST.length) + 1}`,
      sku: `SKU-${category.substring(0,3).toUpperCase()}-${String(5001 + i).padStart(4, '0')}`,
      category,
      supplier: MOCK_SUPPLIERS[i % MOCK_SUPPLIERS.length],
      stock,
      lowStockThreshold,
      purchasePrice,
      salePrice,
      lastRestockDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(), // Within last 60 days
      imageUrl: `https://placehold.co/64x64.png?text=${nameBase.substring(0,1)}${i+1}`,
      dataAiHint: category.toLowerCase(),
      notes: Math.random() > 0.7 ? "Handle with care." : undefined,
    });
  }
  return items;
};
