'use client';
import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ShopShell from '@/components/commerce/shop-shell';
import { commerce, money, Product, ShopData } from '@/components/commerce/api';
import { useCart } from '@/components/commerce/cart';
export default function Storefront({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [data, setData] = useState<ShopData | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const { cart, add } = useCart(username);
  useEffect(() => { commerce<{ data: ShopData }>(`public/shops/${username}`).then(v => setData(v.data)).catch(e => setError(e.message)); }, [username]);
  const categories = ['All', ...new Set(data?.products.map(p => p.category || 'Other') || [])];
  const products = useMemo(() => data?.products.filter(p => (category === 'All' || (p.category || 'Other') === category) && `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())) || [], [data, category, query]);
  if (error) return <ShopShell username={username} name="Shop"><p className="mx-auto max-w-5xl p-12">{error}</p></ShopShell>;
  if (!data) return <ShopShell username={username} name="Shop"><p className="p-12 text-center">Loading shop…</p></ShopShell>;
  return <ShopShell username={username} name={data.shop.name}>
    <section className="bg-gradient-to-r from-[#ff4e19] to-[#ff9b37] text-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-5 py-12 md:py-20"><div><p className="mb-3 font-bold uppercase tracking-widest">{data.shop.tagline || 'Shop the latest finds'}</p><h1 className="max-w-2xl text-4xl font-black md:text-6xl">{data.shop.hero_title || 'Find something you love today'}</h1><p className="mt-4 max-w-xl text-lg">{data.shop.hero_description || 'Explore our collection and checkout securely.'}</p><a href="#products" className="mt-7 inline-block rounded-full bg-white px-7 py-3 font-bold text-[#e84b16]">Shop now →</a></div>{data.shop.hero_image_url && <img src={data.shop.hero_image_url} alt="" className="hidden h-64 w-80 rounded-3xl object-cover shadow-2xl md:block" />}</div></section>
    {!!data.shop.home_sections?.length && <section className="mx-auto grid max-w-7xl gap-4 px-4 pt-8 md:grid-cols-3">{data.shop.home_sections.map((section,index) => <a key={index} href="#products" onClick={() => setCategory(section.category || 'All')} className="relative flex min-h-40 flex-col justify-end overflow-hidden rounded-3xl bg-orange-100 p-6">{section.image_url && <><img src={section.image_url} alt="" className="absolute inset-0 h-full w-full object-cover"/><span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/></>}<h2 className={`relative text-xl font-black ${section.image_url ? 'text-white' : 'text-slate-900'}`}>{section.title}</h2><p className={section.image_url ? 'relative text-white' : 'text-slate-700'}>{section.description}</p></a>)}</section>}
    <div className="mx-auto max-w-7xl px-4 py-8" id="products"><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-black">Discover products</h2><Link href={`/shop/${username}/cart`} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white">Cart ({cart.reduce((n,c) => n+c.quantity, 0)})</Link></div><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products" aria-label="Search products" className="w-full rounded-xl border bg-white px-4 py-3 md:max-w-lg" /><div className="my-6 flex gap-2 overflow-x-auto">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${category === c ? 'bg-[#f45118] text-white' : 'bg-white text-slate-700'}`}>{c}</button>)}</div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{products.map(p => <ProductCard key={p.id} p={p} username={username} currency={data.currency} add={add} />)}</div>{products.length === 0 && <p className="py-14 text-center text-slate-500">No matching products yet.</p>}</div>
    {data.content.length > 0 && <section className="mx-auto max-w-7xl px-4 py-8"><h2 className="mb-4 text-2xl font-black">From the shop</h2><div className="grid gap-4 md:grid-cols-3">{data.content.map(c => <Link key={c.id} href={`/shop/${username}/info/${c.type}/${c.slug}`} className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-xs font-bold uppercase text-[#f45118]">{c.type}</span><h3 className="mt-2 text-lg font-bold">{c.title}</h3></Link>)}</div></section>}
  </ShopShell>;
}
function ProductCard({ p, username, currency, add }: { p: Product; username: string; currency: string; add: (id: number) => void }) {
  return <article className="overflow-hidden rounded-2xl bg-white shadow-sm"><Link href={`/shop/${username}/${p.slug}`}><div className="flex aspect-square items-center justify-center bg-orange-50">{p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" /> : <span className="text-5xl">🛍️</span>}</div><div className="px-3 pt-3 text-sm font-semibold line-clamp-2">{p.name}</div></Link><div className="p-3"><p className="text-lg font-black text-[#ee4b16]">{money(p.price, currency)}</p><button disabled={!p.stock} onClick={() => add(p.id)} className="mt-2 w-full rounded-full bg-[#f45118] px-3 py-2 text-sm font-bold text-white disabled:bg-slate-300">{p.stock ? 'Add to cart' : 'Sold out'}</button></div></article>;
}
