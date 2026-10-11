'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export default function MobileMenuPortal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
