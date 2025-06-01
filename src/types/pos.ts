
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
  bio?: string;
  memberSince: string;
  rewardsPoints?: number;
}

export type OrderStatus = "In-Store" | "Online"; // For actual orders
export type TransactionStatus = "Completed" | "Pending" | "Failed"; // For point-of-sale transactions

export interface TransactionItem { name: string; qty: number; price: number };

export interface Order {
  id: string;
  customerName: string;
  orderDate: string; 
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  items: TransactionItem[]; // Added items to Order
  shippingAddress?: string; 
  paymentMethod?: string; 
}

export interface TransactionType {
  id: string;
  customer: string; // Customer name for the transaction
  date: string;
  amount: string; // Formatted string, e.g., "$75.50"
  status: TransactionStatus;
  items: TransactionItem[];
}
