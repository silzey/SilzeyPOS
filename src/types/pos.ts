
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

export interface TransactionItem { id?: string; name: string; qty: number; price: number }; // Added optional id to TransactionItem

export interface Order {
  id: string;
  customerName: string;
  orderDate: string; 
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  items: TransactionItem[]; 
  shippingAddress?: string; 
  paymentMethod?: string; 
}

export interface TransactionType {
  id: string;
  customer: string; 
  date: string;
  amount: string; 
  status: TransactionStatus;
  items: TransactionItem[];
}
