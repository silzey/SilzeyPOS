
export type Category = "Flower" | "Concentrates" | "Vapes" | "Edibles";

export interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
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

export type OrderStatus = "In-Store" | "Online" | "Pending Checkout"; // Added "Pending Checkout"
export type TransactionStatus = "Completed" | "Pending" | "Failed";

export interface TransactionItem { id?: string; name: string; qty: number; price: number };

export interface Order {
  id: string;
  customerName: string; 
  customerId?: string; // Added to link back to a customer
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  items: CartItem[]; 
  shippingAddress?: string;
  paymentMethod?: string;
  submittedByPOS?: boolean; // Flag for orders from the client POS
  processedAt?: string; // Timestamp for when checkout is completed
}

export interface TransactionType {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: TransactionStatus;
  items: TransactionItem[];
}

// New Customer type
export interface Customer extends UserProfile {
  orderHistory: Order[];
  currentOrder?: Order;
}
