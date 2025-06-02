
export type Category = "Flower" | "Concentrates" | "Vapes" | "Edibles";

export interface Product {
  id: string; // Will correspond to InventoryItem.id
  name: string;
  image: string;
  price: string; // Will correspond to InventoryItem.salePrice
  tags: string;
  rating: string;
  category: Category;
  dataAiHint?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName:string;
  dob: string;
  phoneNumber: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  dataAiHint?: string; // Added for avatars
  bio?: string;
  memberSince: string;
  rewardsPoints?: number;
}

export type OrderStatus = "In-Store" | "Online" | "Pending Checkout";
export type TransactionStatus = "Completed" | "Pending" | "Failed";

// TransactionItem id is optional if it's derived and not a stored DB id.
export interface TransactionItem { id?: string; name: string; qty: number; price: number };

export interface Order {
  id: string;
  customerName: string;
  customerId?: string;
  orderDate: string; // ISO string
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  items: CartItem[];
  shippingAddress?: string;
  paymentMethod?: string;
  submittedByPOS?: boolean;
  processedAt?: string; // ISO string
}

export interface TransactionType {
  id: string;
  customer: string;
  date: string; // This will be the processedAt or orderDate from the Order, as an ISO string
  amount: string; // Formatted as "$XX.XX"
  status: TransactionStatus; // Should always be "Completed" for this table
  items: TransactionItem[];
  originalOrderId?: string; // ID of the Order it was derived from
  originalOrderType?: 'order'; // To know it came from an Order
}

// New Customer type
export interface Customer extends UserProfile {
  orderHistory: Order[];
  currentOrder?: Order;
}

// Updated InventoryItem type to include fields needed for Product display
export interface InventoryItem {
  id: string;          // Unique product identifier
  name: string;
  sku: string;         // Stock Keeping Unit
  category: Category;
  supplier: string;
  stock: number;       // Current stock quantity
  lowStockThreshold: number;
  purchasePrice: number; // Cost to acquire the item
  salePrice: number;    // Price to the customer (will be 'price' for Product)
  lastRestockDate: string; // ISO date string
  imageUrl: string;     // Will be 'image' for Product
  dataAiHint?: string;
  notes?: string;
  tags: string;         // Added from Product
  rating: string;       // Added from Product
}

