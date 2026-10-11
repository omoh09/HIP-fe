'use client';
import { useEffect, useState } from 'react';
type CartLine = { id: number; quantity: number };
function key(shop: string) { return `hip-shop-cart:${shop}`; }
export function readCart(shop: string): CartLine[] {
  try {
    const stored = JSON.parse(localStorage.getItem(key(shop)) || '[]');
    return Array.isArray(stored) ? stored.filter(v => Number.isInteger(v.id) && Number.isInteger(v.quantity) && v.quantity > 0).slice(0, 50) : [];
  } catch { return []; }
}
export function writeCart(shop: string, cart: CartLine[]) {
  localStorage.setItem(key(shop), JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('hip-cart-change'));
}
export function useCart(shop: string) {
  const [cart, setCart] = useState<CartLine[]>([]);
  useEffect(() => {
    const update = () => setCart(readCart(shop));
    update(); window.addEventListener('hip-cart-change', update);
    return () => window.removeEventListener('hip-cart-change', update);
  }, [shop]);
  const add = (id: number, quantity = 1) => {
    const current = readCart(shop);
    const existing = current.find(line => line.id === id);
    if (existing) existing.quantity += quantity;
    else current.push({ id, quantity });
    writeCart(shop, current);
  };
  return { cart, add, setCart: (next: CartLine[]) => writeCart(shop, next) };
}
