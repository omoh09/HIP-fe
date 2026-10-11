'use client';
import Link from 'next/link';
import { MessageCircleMore } from 'lucide-react';
export default function WhatsAppSupportWidget() {
  const raw = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP?.replace(/[^0-9]/g, '');
  const href = raw ? `https://wa.me/${raw}?text=${encodeURIComponent('Hi Hip Homorrd, I need help.')}` : '/contact';
  const external = Boolean(raw);
  return <Link href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} aria-label="Chat with Hip Homorrd support" className="fixed bottom-5 right-5 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_38px_-12px_rgba(37,211,102,.65)] transition hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"><MessageCircleMore className="h-6 w-6" /></Link>;
}
