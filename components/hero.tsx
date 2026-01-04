'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import HeroRightGallery from '@/components/hero-right-gallary';

export default function Hero() {
  const [email, setEmail] = useState('');
  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  return (
    <section className="relative overflow-hidden py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT — COPY */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Stop waiting. <span className="block text-green-600">Get paid instantly.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Millions of creators in Africa like Chioma lose ₦12B every month to slow payments.
            Homord Invoice Payment turns "I'll pay you later" into "Paid" — in under 5 minutes.
          </p>

          {/* EMAIL CTA */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-full border border-gray-300 pl-10 pr-4 text-sm
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <Link href={isValidEmail ? `/sign-up?email=${encodeURIComponent(email)}` : '#'}>
              <Button
                size="lg"
                disabled={!isValidEmail}
                className={clsx(
                  'rounded-full px-6 transition-all',
                  isValidEmail
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-300 cursor-not-allowed'
                )}
              >
                Start now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <p className="mt-4 text-sm text-gray-500">
            No credit card required • Free to start
          </p>

          {/* HIGHLIGHT KEY VALUE */}
          <div className="mt-8 flex flex-col sm:flex-row gap-6">
            <div className="bg-green-100 text-green-800 rounded-xl px-4 py-3 text-center flex-1 font-semibold">
              ⏱ 5 minutes to get paid
            </div>
            <div className="bg-green-100 text-green-800 rounded-xl px-4 py-3 text-center flex-1 font-semibold">
              💳 Multiple payment options
            </div>
            <div className="bg-green-100 text-green-800 rounded-xl px-4 py-3 text-center flex-1 font-semibold">
              📈 Track all invoices & payments
            </div>
          </div>
        </motion.div>

        {/* RIGHT — VISUAL GALLERY */}
        <HeroRightGallery />
      </div>
    </section>
  );
}
