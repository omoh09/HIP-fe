'use client';

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useAnimationFrame,
} from 'framer-motion';
import { useRef } from 'react';

const blocks = [
  { title: 'Create professional invoices', text: 'Generate branded invoices instantly.', media: '/videos/invoice.mp4' },
  { title: 'Accept payments immediately', text: 'Clients pay securely online.', media: '/videos/payment.mp4' },
  { title: 'Instant payment confirmation', text: 'Know the moment a client pays.', media: '/videos/confirmation.mp4' },
  { title: 'Automated invoice reminders', text: 'Reduce late payments effortlessly.', media: '/videos/reminder.mp4' },
  { title: 'Track revenue in real time', text: 'One dashboard. Full visibility.', media: '/videos/analytics.mp4' },
];

export default function StickyStreamingShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const glowX = useTransform(cursorX, [-200, 200], ['20%', '80%']);
  const glowY = useTransform(cursorY, [-200, 200], ['20%', '80%']);

  function handleMouseMove(e: React.MouseEvent) {
    if (!phoneRef.current) return;
    const rect = phoneRef.current.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left - rect.width / 2);
    cursorY.set(e.clientY - rect.top - rect.height / 2);

    phoneRef.current.style.transform = `
      rotateX(${-(cursorY.get() / 30)}deg)
      rotateY(${cursorX.get() / 30}deg)
    `;
  }

  function resetTilt() {
    if (!phoneRef.current) return;
    phoneRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
  }

  const hapticY = useMotionValue(0);
  useAnimationFrame(() => {
    hapticY.set((Math.random() - 0.5) * 0.4);
  });

  return (
    <section ref={sectionRef} className="relative bg-white" style={{ height: '260vh' }}>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24">

        {/* LEFT — TEXT */}
        <div className="pt-24 space-y-[120px]">
          {blocks.map((b, i) => {
            const start = i / blocks.length;
            const end = (i + 1) / blocks.length;
            const opacity = useTransform(smoothProgress, [start, end], [1, 0.25]);

            return (
              <motion.div key={b.title} style={{ opacity }} className="max-w-md">
                <h3 className="text-3xl font-semibold text-gray-900">{b.title}</h3>
                <p className="mt-4 text-lg text-gray-600">{b.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT — PHONE */}
        <div className="relative">
          <div className="sticky top-24 h-[500px] max-w-[360px] w-full"> {/* reduced height and width */}
            <motion.div
              ref={phoneRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={resetTilt}
              className="relative h-full w-full rounded-[36px] bg-white overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.18)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Device Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 h-6 w-28 rounded-full bg-black/90" />

              {/* Media Stream */}
              {blocks.map((b, i) => {
                const start = i / blocks.length;
                const end = (i + 1) / blocks.length;
                const opacity = useTransform(smoothProgress, [start, end], [1, 0]);

                return (
                  <motion.video
                    key={b.media}
                    src={b.media}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ opacity, y: hapticY }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                );
              })}

              {/* Cursor Glow */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(220px at ${glowX} ${glowY}, rgba(255,255,255,0.35), transparent 60%)`,
                }}
              />

              {/* Reflection Sweep */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{ x: ['-60%', '140%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
                }}
              />
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
