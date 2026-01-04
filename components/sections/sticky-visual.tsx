'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function StickyStreamingShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Image transitions
  const invoiceOpacity = useTransform(scrollYProgress, [0, 0.33], [1, 0]);
  const paymentOpacity = useTransform(scrollYProgress, [0.25, 0.6], [0, 1]);
  const analyticsOpacity = useTransform(scrollYProgress, [0.55, 1], [0, 1]);

  const depthScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const blur = useTransform(scrollYProgress, [0, 1], ['0px', '6px']);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: '260vh' }} // gives scroll room
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20">
        
        {/* LEFT — SCROLLING CONTENT */}
        <div className="pt-[30vh] space-y-32">
          <Block
            title="Create professional invoices"
            text="Generate branded invoices in seconds and send them instantly."
          />
          <Block
            title="Accept payments immediately"
            text="Clients pay online. Funds reconcile automatically."
          />
          <Block
            title="Track revenue in real time"
            text="See payments, overdue invoices, and performance analytics."
          />
        </div>

        {/* RIGHT — STICKY STREAMING VISUAL */}
        <div className="relative">
          <div className="sticky top-24 h-[520px] w-[460px]">
            <motion.div
              className="absolute inset-0 rounded-2xl border bg-white shadow-xl overflow-hidden"
              style={{ scale: depthScale, filter: blur }}
            >
              {/* Invoice */}
              <motion.div style={{ opacity: invoiceOpacity }} className="absolute inset-0">
                <Image
                  src="/images/invoice-preview.png"
                  alt="Invoice"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Payment */}
              <motion.div style={{ opacity: paymentOpacity }} className="absolute inset-0">
                <Image
                  src="/images/payment-preview.png"
                  alt="Payment"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Analytics */}
              <motion.div style={{ opacity: analyticsOpacity }} className="absolute inset-0">
                <Image
                  src="/images/analytics-preview.png"
                  alt="Analytics"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div className="max-w-md">
      <h3 className="text-3xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-4 text-lg text-gray-600">{text}</p>
    </div>
  );
}
