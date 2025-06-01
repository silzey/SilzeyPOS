
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

// New types for Orders page
export type OrderStatus = "Pending Payment" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";

export interface Order {
  id: string;
  customerName: string;
  orderDate: string; // Consider ISO string for easier sorting/filtering, then format for display
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  shippingAddress?: string; // Optional
  paymentMethod?: string; // Optional
}

export interface TransactionItem { name: string; qty: number; price: number };
export interface TransactionType {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: string;
  items: TransactionItem[];
}
