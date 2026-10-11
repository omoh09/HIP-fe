export type Product = { id: number; slug: string; name: string; description?: string; category?: string; image_url?: string; price: string; currency: string; stock: number; published: boolean };
export type ShopData = { shop: { name: string; tagline?: string; hero_title?: string; hero_description?: string; hero_image_url?: string; home_sections?: { title: string; description?: string; image_url?: string; category?: string }[] }; username: string; currency: string; products: Product[]; content: { id: number; type: string; slug: string; title: string; body: string }[] };
export async function commerce<T>(path: string, method = 'GET', data?: unknown): Promise<T> {
  const res = await fetch(`/api/commerce/${path}`, {
    method, credentials: 'same-origin', cache: 'no-store',
    headers: data ? { 'Content-Type': 'application/json' } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });
  const body = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(body?.message || 'Request failed.');
  return body as T;
}
export function money(value: string | number, currency: string) {
  try { return new Intl.NumberFormat('en', { style: 'currency', currency }).format(Number(value)); }
  catch { return `${currency} ${Number(value).toFixed(2)}`; }
}
