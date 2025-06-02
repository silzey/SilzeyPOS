
"use client";

import type { InventoryItem, Category } from '@/types/pos';
import { CATEGORIES as PRODUCT_CATEGORIES_LIST, TAGS as PRODUCT_TAGS_LIST } from '@/lib/data';

export const MOCK_SUPPLIERS = ["GreenLeaf Farms", "HighHarvest Co.", "BudBrothers Inc.", "Natural Wonders LLC", "Quality Cannabis Supply"];
const INVENTORY_STORAGE_KEY = 'silzeyAppInventory';

export const generateMockInventory = (): InventoryItem[] => {
  if (typeof window !== 'undefined') {
    const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (storedInventory) {
      try {
        const parsedInventory = JSON.parse(storedInventory) as InventoryItem[];
        // Basic validation: check if it's an array and has some expected properties
        if (Array.isArray(parsedInventory) && parsedInventory.length > 0 && parsedInventory[0].hasOwnProperty('salePrice')) {
            return parsedInventory;
        } else {
            localStorage.removeItem(INVENTORY_STORAGE_KEY); // Clear invalid data
        }
      } catch (e) {
        console.error("Error parsing inventory from localStorage:", e);
        localStorage.removeItem(INVENTORY_STORAGE_KEY); // Clear corrupted data
      }
    }
  }

  const items: InventoryItem[] = [];
  const baseNames: Record<Category, string[]> = {
    "Flower": ["Aurora Haze", "Cosmic Bloom", "Lunar Kush", "Solar Flare OG", "Nebula Nugs"],
    "Concentrates": ["Galaxy Gold Shatter", "Stardust Rosin", "Pulsar Diamonds", "Void Extract", "Comet Crumble"],
    "Vapes": ["Orion Haze Pen", "Astro-Vape Cartridge", "Zero-G Disposable", "Celestial Cloud Pod", "Meteor Mist Kit"],
    "Edibles": ["Lunar Lavender Gummies", "Cosmic Caramel Chews", "Stardust Swirl Brownies", "Nebula Nectar Cookies", "Planet Peach Pastries"],
  };

  for (let i = 0; i < 50; i++) { // Generate 50 items to cover POS display needs
    const category = PRODUCT_CATEGORIES_LIST[i % PRODUCT_CATEGORIES_LIST.length];
    const nameBase = baseNames[category][Math.floor(Math.random() * baseNames[category].length)];
    const stock = Math.floor(Math.random() * 200) + (i % 5 === 0 ? 0 : 5);
    const lowStockThreshold = Math.floor(Math.random() * 20) + 10;
    const purchasePrice = parseFloat((Math.random() * 20 + 5).toFixed(2));
    const salePrice = parseFloat((purchasePrice * (1.5 + Math.random() * 0.8)).toFixed(2)); // Adjusted markup

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
      lastRestockDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: `https://placehold.co/300x225.png?text=${nameBase.substring(0,1)}${i+1}`, // Match ProductCard image aspect
      dataAiHint: category.toLowerCase(),
      notes: Math.random() > 0.7 ? "Handle with care. Check for seasonal availability." : undefined,
      tags: PRODUCT_TAGS_LIST[i % PRODUCT_TAGS_LIST.length], // Added tags
      rating: (Math.random() * 2.5 + 2.5).toFixed(1),   // Added rating (2.5 to 5.0)
    });
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving generated inventory to localStorage:", e);
    }
  }
  return items;
};

export const saveInventory = (inventory: InventoryItem[]): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
    } catch (e) {
      console.error("Error saving inventory to localStorage:", e);
    }
  }
};
