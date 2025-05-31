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
