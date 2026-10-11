'use client';
import { use, useEffect, useState } from 'react';
import ShopShell from '@/components/commerce/shop-shell';
import { commerce, ShopData } from '@/components/commerce/api';
export default function ShopArticle({params}:{params:Promise<{username:string;type:string;slug:string}>}) {
  const {username,type,slug}=use(params); const [data,setData]=useState<ShopData>(); const [error,setError]=useState('');
  useEffect(()=>{commerce<{data:ShopData}>(`public/shops/${username}`).then(v=>setData(v.data)).catch(e=>setError(e.message));},[username]);
  const page=data?.content.find(c=>c.type===type && c.slug===slug);
  return <ShopShell username={username} name={data?.shop.name || 'Shop'}><article className="mx-auto max-w-3xl px-4 py-14">{error || (data && !page ? 'Page not found.' : '')}{page && <><p className="text-sm font-bold uppercase text-[#f45118]">{page.type}</p><h1 className="mt-3 text-4xl font-black">{page.title}</h1><p className="mt-8 whitespace-pre-wrap leading-8 text-slate-700">{page.body}</p></>}</article></ShopShell>;
}
