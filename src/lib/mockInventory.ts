
"use client";

import type { InventoryItem, Category } from '@/types/pos';
import { CATEGORIES as PRODUCT_CATEGORIES_LIST, TAGS as PRODUCT_TAGS_LIST } from '@/lib/data';

export const MOCK_SUPPLIERS = ["GreenLeaf Farms", "HighHarvest Co.", "BudBrothers Inc.", "Natural Wonders LLC", "Quality Cannabis Supply"];
const INVENTORY_STORAGE_KEY = 'silzeyAppInventory';

export const generateMockInventory = (): InventoryItem[] => {
  const expectedTotalItems = PRODUCT_CATEGORIES_LIST.length * 50;
  if (typeof window !== 'undefined') {
    const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (storedInventory) {
      try {
        const parsedInventory = JSON.parse(storedInventory) as InventoryItem[];
        if (Array.isArray(parsedInventory) && parsedInventory.length === expectedTotalItems && parsedInventory[0]?.hasOwnProperty('salePrice')) {
            return parsedInventory;
        } else {
            localStorage.removeItem(INVENTORY_STORAGE_KEY); 
        }
      } catch (e) {
        console.error("Error parsing inventory from localStorage:", e);
        localStorage.removeItem(INVENTORY_STORAGE_KEY); 
      }
    }
  }

  const items: InventoryItem[] = [];
  const baseNames: Record<Category, string[]> = {
    "Flower": ["Aurora Haze", "Cosmic Bloom", "Lunar Kush", "Solar Flare OG", "Nebula Nugs", "Terra Bloom", "Zenith Flower", "Midnight Bloom", "Crystal Peak", "Emerald Fire"],
    "Concentrates": ["Galaxy Gold Shatter", "Stardust Rosin", "Pulsar Diamonds", "Void Extract", "Comet Crumble", "Aether Wax", "Nova Oil", "Black Hole Batter", "Supernova Sap", "Quasar Crystals"],
    "Vapes": ["Orion Haze Pen", "Astro-Vape Cartridge", "Zero-G Disposable", "Celestial Cloud Pod", "Meteor Mist Kit", "Photon Vape", "Quasar Cart", "Interstellar Inhaler", "Cosmic Cartridge", "Nebula Vape"],
    "Edibles": ["Lunar Lavender Gummies", "Cosmic Caramel Chews", "Stardust Swirl Brownies", "Nebula Nectar Cookies", "Planet Peach Pastries", "Terra Taffy", "Zenith Zesties", "Milky Way Mints", "Galaxy Grape Bites", "Orion Orange Slices"],
  };

  let itemIndex = 0; 

  PRODUCT_CATEGORIES_LIST.forEach((category) => {
    for (let j = 0; j < 50; j++) { 
      const nameBase = baseNames[category][j % baseNames[category].length]; 
      const stock = Math.floor(Math.random() * 200) + (j % 10 === 0 ? 0 : 5); 
      const lowStockThreshold = Math.floor(Math.random() * 20) + 10;
      const purchasePrice = parseFloat((Math.random() * 20 + 5).toFixed(2));
      const salePrice = parseFloat((purchasePrice * (1.5 + Math.random() * 0.8)).toFixed(2));

      items.push({
        id: `INV-ITEM-${category.substring(0,3).toUpperCase()}-${String(101 + j).padStart(3, '0')}`,
        name: `${nameBase} #${j + 1}`,
        sku: `SKU-${category.substring(0,3).toUpperCase()}-${String(5001 + itemIndex).padStart(4, '0')}`,
        category,
        supplier: MOCK_SUPPLIERS[itemIndex % MOCK_SUPPLIERS.length],
        stock,
        lowStockThreshold,
        purchasePrice,
        salePrice,
        lastRestockDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: `https://placehold.co/300x225.png`,
        dataAiHint: "cannabis",
        notes: Math.random() > 0.8 ? "Limited edition. High demand." : (Math.random() > 0.6 ? "Staff favorite. Recommend." : undefined),
        tags: PRODUCT_TAGS_LIST[itemIndex % PRODUCT_TAGS_LIST.length],
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      });
      itemIndex++;
    }
  });

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

