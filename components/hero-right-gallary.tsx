'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const cards = [
  { src: '/images/invoice-preview.webp', alt: 'Hip Homorrd invoice preview' },
  { src: '/images/creator.webp', alt: 'Hip Homorrd product dashboard' },
  { src: '/images/analytics-preview.webp', alt: 'Hip Homorrd payment analytics' },
];

export default function HeroRightGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setActiveIndex((value) => (value + 1) % cards.length), 5000);
    return () => window.clearInterval(interval);
  }, []);

  return <div className="relative mx-auto h-[380px] w-full max-w-[560px] sm:h-[440px]" aria-label="Product preview"><div className="absolute inset-x-5 bottom-4 h-40 rounded-full bg-emerald-200/30 blur-3xl" />{cards.map((card, index) => { const active = index === activeIndex; const next = index === (activeIndex + 1) % cards.length; return <motion.div key={card.src} className="absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" style={{ zIndex: active ? 30 : next ? 20 : 10 }} animate={{ opacity: active ? 1 : 0.5, scale: active ? 1 : 0.9, x: active ? '-50%' : next ? 'calc(-50% + 28px)' : 'calc(-50% - 20px)', y: active ? '-50%' : next ? 'calc(-50% + 18px)' : 'calc(-50% + 28px)' }} transition={{ duration: 0.8, ease: 'easeInOut' }}><Image src={card.src} alt={card.alt} width={640} height={420} className="h-auto w-full object-cover" priority={index === 0} /></motion.div>; })}</div>;
}
