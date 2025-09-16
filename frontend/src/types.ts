export type MediaType = 'IMAGE' | 'VIDEO';

export interface MediaAsset {
  id?: number;
  url: string;
  type: MediaType;
}

export type Category =
  | 'TECH'
  | 'FASHION'
  | 'BEAUTY'
  | 'FOOD'
  | 'ENTERTAINMENT'
  | 'SPORTS'
  | 'OTHER';

export interface User {
  id?: number;
  username: string;
  email: string;
}

export interface Item {
  id?: number;
  title: string;
  description: string;
  category: Category;
  mediaAssets: MediaAsset[];
}

export interface Review {
  id?: number;
  itemId: number;
  userId: number;
  rating: number; // 1.0 - 5.0 (decimals allowed)
  description: string;
}