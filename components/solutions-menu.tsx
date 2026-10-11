'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { solutions } from '@/lib/solutions-navigation';

type Props = {
  desktop?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function SolutionsMenu({ desktop, mobile, onNavigate }: Props) {
  const [open, setOpen] = useState(false);

  /* ================= DESKTOP ================= */
  if (desktop) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button className="text-sm text-gray-600 hover:text-gray-900">
          Solutions
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="
                absolute
                left-1/2 -translate-x-1/2
                top-full mt-4
                w-[720px]
                rounded-xl
                bg-white
                border
                shadow-xl
                p-6
                z-50
              "
            >

              <div className="grid grid-cols-4 gap-6">
                {Object.entries(solutions).map(([title, items]) => (
                  <Section key={title} title={title} items={items} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ================= MOBILE ================= */
  if (mobile) {
    return (
      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase mb-3">
          Solutions
        </p>
        <div className="space-y-3">
          {Object.values(solutions).flat().map((item: any) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className="block w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-800"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function Section({ title, items }: any) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold text-gray-400 uppercase">
        {title}
      </p>
      <div className="space-y-2">
        {items.map((item: any) => (
          <Link
            key={item.label}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
