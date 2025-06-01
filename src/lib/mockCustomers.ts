
import type { Customer, Order, CartItem, Category as ProductCategory, UserProfile } from '@/types/pos';
import { CATEGORIES as PRODUCT_CATEGORIES_LIST, TAGS as PRODUCT_TAGS_LIST } from '@/lib/data';

// Customer Avatars and AI Hints for them
const customerAvatars = [
    'https://placehold.co/150x150.png?text=AL', // Alice Liddell
    'https://placehold.co/150x150.png?text=BW', // Bob Weaver
    'https://placehold.co/150x150.png?text=CS', // Clara Smith
    'https://placehold.co/150x150.png?text=DJ', // David Jones
    'https://placehold.co/150x150.png?text=EM', // Eva Miller
];
const customerDataHints = ['woman face', 'man face', 'smiling person', 'professional portrait', 'user avatar'];


const mockProductNamesByCategory: Record<ProductCategory, string[]> = {
  "Flower": ["Mystic Haze", "Stardust Sativa", "Quasar Queen", "Blue Dream", "Green Crack"],
  "Concentrates": ["Galaxy Gold", "Cosmic Kush Shatter", "Nebula Nectar Wax", "Lunar Rosin", "Solar Flare Oil"],
  "Vapes": ["Orion Haze Pen", "Pulsar Pineapple Cart", "Zero-G Disposable", "Comet Berry Vape", "Astro Mint Pods"],
  "Edibles": ["Lunar Gummies", "Orion Brownies", "Cosmic Cookies", "Stardust Cereal Bar", "Nebula Chocolate"],
};

const getMockItemImage = (category: ProductCategory, index: number): { url: string; hint: string } => {
  const hints: Record<ProductCategory, string> = {
    Flower: "cannabis flower",
    Concentrates: "cannabis concentrate",
    Vapes: "vape pen",
    Edibles: "food edible"
  };
  // More distinct placeholders for items
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
        const items = generateMockCartItemsForCustomer(Math.floor(Math.random() * 3) + 1); // 1 to 3 items per order
        const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
        orders.push({
            id: `ORD-${customerId.slice(-3)}-${String(301 + i).padStart(3, '0')}`,
            customerName: customerId, 
            orderDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(), // Within last 60 days
            status: Math.random() > 0.3 ? "In-Store" : "Online",
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
            items: items,
            paymentMethod: i % 2 === 0 ? "Credit Card" : "Cash",
            shippingAddress: Math.random() > 0.5 ? `${100+i} Oak St, Townsville, USA` : undefined,
        });
    }
    return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()); // Sort by most recent
};

export const mockCustomers: Customer[] = [
    {
        id: 'cust-001',
        firstName: 'Alice',
        lastName: 'Liddell',
        email: 'alice.liddell@example.com',
        avatarUrl: customerAvatars[0],
        dataAiHint: customerDataHints[0],
        memberSince: 'January 15, 2023',
        rewardsPoints: 1250,
        bio: "Loves exploring new flower strains and enjoys a good sativa. Long-time loyal customer.",
        orderHistory: generateMockOrdersForCustomer(4, 'cust-001'),
        currentOrder: {
            id: `CUR-ORD-AL001`,
            customerName: 'Alice Liddell',
            orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            status: "In-Store", 
            totalAmount: 55.75,
            itemCount: 2,
            items: generateMockCartItemsForCustomer(2),
            paymentMethod: "Pending",
        }
    },
    {
        id: 'cust-002',
        firstName: 'Bob',
        lastName: 'Weaver',
        email: 'bob.weaver@example.com',
        avatarUrl: customerAvatars[1],
        dataAiHint: customerDataHints[1],
        memberSince: 'March 22, 2023',
        rewardsPoints: 850,
        bio: "Prefers edibles and CBD products. Often asks for recommendations for relaxation.",
        orderHistory: generateMockOrdersForCustomer(2, 'cust-002'),
    },
    {
        id: 'cust-003',
        firstName: 'Clara',
        lastName: 'Smith',
        email: 'clara.smith@example.com',
        avatarUrl: customerAvatars[2],
        dataAiHint: customerDataHints[2],
        memberSince: 'July 01, 2023',
        rewardsPoints: 150,
        bio: "Newer customer, interested in vapes and concentrates. Appreciates quick service.",
        orderHistory: generateMockOrdersForCustomer(1, 'cust-003'),
    },
    {
        id: 'cust-004',
        firstName: 'David',
        lastName: 'Jones',
        email: 'david.jones@example.com',
        avatarUrl: customerAvatars[3],
        dataAiHint: customerDataHints[3],
        memberSince: 'November 05, 2022',
        rewardsPoints: 2300,
        bio: "Connoisseur of high-THC concentrates. Regular high-value purchaser.",
        orderHistory: generateMockOrdersForCustomer(6, 'cust-004'),
        currentOrder: {
            id: `CUR-ORD-DJ004`,
            customerName: 'David Jones',
            orderDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
            status: "Online", 
            totalAmount: 120.50,
            itemCount: 3,
            items: generateMockCartItemsForCustomer(3),
            paymentMethod: "Credit Card",
            shippingAddress: "456 Pine Ave, Cityville, USA"
        }
    },
    {
        id: 'cust-005',
        firstName: 'Eva',
        lastName: 'Miller',
        email: 'eva.miller@example.com',
        avatarUrl: customerAvatars[4],
        dataAiHint: customerDataHints[4],
        memberSince: 'September 10, 2023',
        rewardsPoints: 475,
        bio: "Occasional buyer, typically purchases pre-rolls and accessories. Values discretion.",
        orderHistory: generateMockOrdersForCustomer(3, 'cust-005'),
    }
];

export const getCustomerById = (id: string): Customer | undefined => {
    return mockCustomers.find(customer => customer.id === id);
};
