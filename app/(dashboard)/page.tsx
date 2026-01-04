'use client';

import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/hero';
import TrustSection from "@/components/sections/trust-section";
import StickyStreamingShowCase from "@/components/sections/stick-streaming";
import FAQSection from "@/components/sections/faq";
import CreatorInvoice from '@/components/sections/creator-invoice';
import BoostSalesSection from '@/components/sections/boost-sales';
import HowItWork from '@/components/sections/how-it-works';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import WaitlistCTASection from '@/components/sections/WaitlistCTASection';
import HipWorksSection from '@/components/sections/HipWorksSection';

export default function LandingPage() {
  return (
    <main className="bg-white">
      {/* REFERRAL BANNER */}
      <div className="bg-green-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-3 text-center text-sm text-green-800">
          🎁 Refer 3 creators and get 1 month of Pro free
        </div>
      </div>

      {/* HERO */}
      <Hero />
      
      {/* <StickyStreamingShowCase /> */}
      <CreatorInvoice />
      
      <TrustSection />
      <BoostSalesSection />
      
      {/* PROBLEM → SOLUTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Invoicing Shouldn’t Be Stressful
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
            {[
              'Sending invoices on Excel is messy',
              'Chasing payments wastes your time',
              'Clients want easy Paystack checkout'
            ].map((text) => (
              <div
                key={text}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <p className="text-gray-700">{text}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-lg text-gray-700 font-medium">
            Creator Invoice Hub fixes this.
          </p>
        </div>
      </section>
      {/* <HowItWork /> */}
       <HipWorksSection />
      

      <FAQSection />

      {/* PAYSTACK TRUST */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          <ShieldCheck className="h-10 w-10 text-green-600" />
          <p className="mt-4 text-lg text-gray-700">
            Powered by Paystack — trusted by thousands of African businesses
            for secure payments.
          </p>
        </div>
      </section> */}

      {/* FINAL CTA */}
      {/* <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Start Sending Paystack Invoices Today
          </h2>
          <p className="mt-4 text-gray-600">
            Create your first invoice in under 2 minutes.
          </p>

          <Link href="/login">
            <Button
              size="lg"
              className="mt-8 rounded-full bg-green-600 hover:bg-green-700"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section> */}

      <TestimonialsSection />
     
      {/* <WaitlistCTASection /> */}
    </main>
  );
}
