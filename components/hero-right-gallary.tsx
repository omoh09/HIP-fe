'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HeroRightGallery() {
  const cards = [
    { src: '/images/creator.png', alt: 'Invoice preview' },
    { src: '/images/invoice-preview.png', alt: 'Payment success' },
    { src: '/images/analytics-preview.png', alt: 'Income analytics' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[480px] perspective-1000">
      {cards.map((card, idx) => {
        const isActive = idx === activeIndex;

        // Z-index order: active on top
        const zIndex = isActive ? 30 : idx === (activeIndex + 1) % cards.length ? 20 : 10;

        // Card offset for depth effect
        const xOffset = isActive ? 0 : idx === (activeIndex + 1) % cards.length ? 40 : -40;
        const yOffset = isActive ? 0 : idx === (activeIndex + 1) % cards.length ? 20 : 40;
        const scale = isActive ? 1 : 0.9;
        const rotateY = isActive ? 0 : idx === (activeIndex + 1) % cards.length ? -5 : 5;
        const opacity = isActive ? 1 : 0.6;

        return (
          <motion.div
            key={idx}
            className="absolute rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xl"
            style={{ zIndex }}
            animate={{
              opacity,
              scale,
              x: xOffset,
              y: yOffset,
              rotateY,
            }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <div className="w-[640px] h-[420px] sm:w-[520px] sm:h-[340px] md:w-[480px] md:h-[300px]">
              <Image
                src={card.src}
                alt={card.alt}
                width={640}
                height={420}
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
