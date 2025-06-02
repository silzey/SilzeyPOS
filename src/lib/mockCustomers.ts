
import type { Customer, Order, CartItem, Category as ProductCategory, UserProfile } from '@/types/pos';
import { CATEGORIES as PRODUCT_CATEGORIES_LIST, TAGS as PRODUCT_TAGS_LIST } from '@/lib/data';

// Expanded lists for more variety
const firstNames = [
  'Alice', 'Bob', 'Clara', 'David', 'Eva', 'Finn', 'Grace', 'Henry', 'Ivy', 'Jack',
  'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Ryan', 'Sofia', 'Tom',
  'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara', 'Zane', 'Amber', 'Bruce', 'Chloe',
  'Daniel', 'Emily', 'Felix', 'Gloria', 'Harry', 'Isla', 'Jacob', 'Lily', 'Max',
  'Nora', 'Oscar', 'Penelope', 'Riley', 'Samuel', 'Tara', 'Vincent', 'Willow', 'Zachary'
];
const lastNames = [
  'Smith', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson',
  'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark',
  'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott',
  'Green', 'Baker', 'Adams', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips',
  'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed'
];

const customerAvatars = [
    'https://placehold.co/150x150.png?text=P1',
    'https://placehold.co/150x150.png?text=P2',
    'https://placehold.co/150x150.png?text=P3',
    'https://placehold.co/150x150.png?text=P4',
    'https://placehold.co/150x150.png?text=P5',
    'https://placehold.co/150x150.png?text=P6',
    'https://placehold.co/150x150.png?text=P7',
    'https://placehold.co/150x150.png?text=P8',
    'https://placehold.co/150x150.png?text=P9',
    'https://placehold.co/150x150.png?text=P10',
];
const customerDataHints = ['person face', 'user portrait', 'smiling individual', 'customer photo', 'avatar image', 'profile picture', 'happy user', 'client image', 'member photo', 'user icon'];

const bios = [
  "Loves exploring new flower strains and enjoys a good sativa. Long-time loyal customer.",
  "Prefers edibles and CBD products. Often asks for recommendations for relaxation.",
  "Newer customer, interested in vapes and concentrates. Appreciates quick service.",
  "Connoisseur of high-THC concentrates. Regular high-value purchaser.",
  "Occasional buyer, typically purchases pre-rolls and accessories. Values discretion.",
  "Enthusiast for artisanal edibles and locally sourced products.",
  "Primarily interested in topical CBD for wellness and recovery.",
  "Collects various vape pen models and enjoys trying new cartridge flavors.",
  "Focuses on high-CBD, low-THC flower for daytime use.",
  "Experimental with all product types, always looking for unique effects."
];

const mockProductNamesByCategory: Record<ProductCategory, string[]> = {
  "Flower": ["Mystic Haze", "Stardust Sativa", "Quasar Queen", "Blue Dream", "Green Crack", "Aurora Indica", "Cosmic Kush"],
  "Concentrates": ["Galaxy Gold", "Cosmic Kush Shatter", "Nebula Nectar Wax", "Lunar Rosin", "Solar Flare Oil", "Void Dabs", "Pulsar Crumble"],
  "Vapes": ["Orion Haze Pen", "Pulsar Pineapple Cart", "Zero-G Disposable", "Comet Berry Vape", "Astro Mint Pods", "Celestial Haze Vape", "Meteor Mango Cart"],
  "Edibles": ["Lunar Gummies", "Orion Brownies", "Cosmic Cookies", "Stardust Cereal Bar", "Nebula Chocolate", "Galaxy Grape Bites", "Planet Peach Pastries"],
};

const getMockItemImage = (category: ProductCategory, index: number): { url: string; hint: string } => {
  const hints: Record<ProductCategory, string> = {
    Flower: "cannabis flower",
    Concentrates: "cannabis concentrate",
    Vapes: "vape pen",
    Edibles: "food edible"
  };
  return {
    url: `https://placehold.co/80x80.png?text=${category.substring(0,1)}${index + 1}`,
    hint: hints[category] || "product image"
  };
};

const generateMockCartItemsForCustomer = (itemCount: number): CartItem[] => {
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

    const imageDetails = getMockItemImage(category, i);

    items.push({
      id: `cust-prod-${category}-${Math.random().toString(36).substring(2, 7)}`,
      name: name,
      price: (Math.random() * 35 + 10).toFixed(2), 
      tags: PRODUCT_TAGS_LIST[Math.floor(Math.random() * PRODUCT_TAGS_LIST.length)],
      rating: (Math.random() * 1.5 + 3.5).toFixed(1), 
      category: category,
      image: imageDetails.url,
      dataAiHint: imageDetails.hint,
      quantity: Math.floor(Math.random() * 2) + 1,
    });
  }
  return items;
};

const generateMockOrdersForCustomer = (orderCount: number, customerId: string): Order[] => {
    const orders: Order[] = [];
    for (let i = 0; i < orderCount; i++) {
        const items = generateMockCartItemsForCustomer(Math.floor(Math.random() * 4) + 1); // 1 to 4 items per order
        const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
        const orderDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000); // Within last year
        orders.push({
            id: `ORD-${customerId.slice(-3)}-${String(101 + i).padStart(3, '0')}`,
            customerName: customerId, 
            customerId: customerId, // Ensure customerId is present for linking
            orderDate: orderDate.toISOString(),
            processedAt: Math.random() > 0.1 ? new Date(orderDate.getTime() + Math.random() * 10 * 60 * 1000).toISOString() : undefined, // Most orders processed shortly after
            status: Math.random() > 0.3 ? "In-Store" : "Online",
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
            items: items,
            paymentMethod: i % 3 === 0 ? "Credit Card" : (i % 3 === 1 ? "Cash" : "PayPal"),
            shippingAddress: Math.random() > 0.6 ? `${100+i} ${['Oak', 'Pine', 'Maple', 'Elm'][i%4]} St, ${['Townsville', 'Cityburg', 'Villagetown'][i%3]}, USA` : undefined,
        });
    }
    return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()); // Sort by most recent
};


export const mockCustomers: Customer[] = Array.from({ length: 50 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  let email, specificBio, specificRewards, specificMemberSince, specificId;

  if (i === 0) { 
    email = 'kim.l@silzeypos.com';
    specificBio = 'Enthusiastic budtender with a passion for quality cannabis products and customer education. Helping people find the perfect strain since 2020.';
    specificRewards = 1250;
    specificMemberSince = new Date(2023, 0, 15).toISOString(); // Jan 15, 2023 as ISO
    specificId = 'user-kim-123';
  } else {
    email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.com`;
    specificBio = bios[i % bios.length];
    specificRewards = Math.floor(Math.random() * 3000) + 50;
    specificMemberSince = new Date(Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000).toISOString(); // Within last 2 years as ISO
    specificId = `cust-${String(i + 1).padStart(3, '0')}`;
  }
  
  return {
    id: specificId,
    firstName: firstName,
    lastName: `${lastName}${i < lastNames.length || i === 0 ? '' : Math.floor(i / lastNames.length)}`, 
    email: email,
    avatarUrl: customerAvatars[i % customerAvatars.length],
    dataAiHint: customerDataHints[i % customerDataHints.length],
    memberSince: specificMemberSince,
    rewardsPoints: specificRewards,
    bio: specificBio,
    orderHistory: generateMockOrdersForCustomer(Math.floor(Math.random() * 8) + 1, specificId),
    currentOrder: Math.random() > 0.7 ? { 
        id: `CUR-ORD-${specificId.slice(-3)}-${String(Math.floor(Math.random()*99)+1).padStart(2,'0')}`,
        customerName: `${firstName} ${lastName}`,
        customerId: specificId,
        orderDate: new Date(Date.now() - Math.random() * 5 * 60 * 60 * 1000).toISOString(), 
        status: Math.random() > 0.5 ? "In-Store" : "Online", 
        totalAmount: parseFloat((Math.random() * 150 + 20).toFixed(2)),
        itemCount: Math.floor(Math.random() * 3) + 1,
        items: generateMockCartItemsForCustomer(Math.floor(Math.random() * 3) + 1),
        paymentMethod: "Pending",
        shippingAddress: Math.random() > 0.5 && Math.random() > 0.5 ? `${200+i} ${['Willow', 'Birch', 'Cedar'][i%3]} Ave, ${['Metropolis', 'Gotham', 'Star City'][i%3]}, USA` : undefined,
    } : undefined,
  };
});

const NEWLY_REGISTERED_USERS_STORAGE_KEY = 'newlyRegisteredUsersSilzey';

export const getCustomerById = (id: string): Customer | undefined => {
    const staticCustomer = mockCustomers.find(customer => customer.id === id);
    if (staticCustomer) {
        return staticCustomer;
    }

    if (typeof window !== 'undefined') {
        const newlyRegisteredUsersRaw = localStorage.getItem(NEWLY_REGISTERED_USERS_STORAGE_KEY);
        if (newlyRegisteredUsersRaw) {
            try {
                const newlyRegisteredProfiles: UserProfile[] = JSON.parse(newlyRegisteredUsersRaw);
                const foundProfile = newlyRegisteredProfiles.find(profile => profile.id === id);
                if (foundProfile) {
                    return {
                        ...foundProfile,
                        orderHistory: [], 
                        currentOrder: undefined,
                        rewardsPoints: foundProfile.rewardsPoints !== undefined ? foundProfile.rewardsPoints : 0,
                    };
                }
            } catch (e) {
                console.error("Error parsing newly registered users from localStorage:", e);
            }
        }
    }
    return undefined;
};
