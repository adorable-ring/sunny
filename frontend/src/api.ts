import type { Item, Review, User, Category } from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api';

export async function createUser(user: User): Promise<User> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function createItem(item: Item): Promise<Item> {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to create item');
  return res.json();
}

export async function listItems(category?: Category): Promise<Item[]> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`${API_BASE}/items${qs}`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function createReview(review: Review): Promise<Review> {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
  if (!res.ok) throw new Error('Failed to create review');
  return res.json();
}

export async function getItemReviews(itemId: number) {
  const res = await fetch(`${API_BASE}/items/${itemId}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}