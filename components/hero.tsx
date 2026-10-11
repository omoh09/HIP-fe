'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageCircle, ReceiptText, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroRightGallery from '@/components/hero-right-gallary';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_45%)]" />
      <div className="page-container relative grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-800 shadow-sm"><span className="h-2 w-2 rounded-full bg-emerald-500" />Built for independent professionals</div>
          <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">Send the invoice.<span className="block text-emerald-600">Get paid.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Create professional invoices, share payment links and keep track of every payment without turning your business into an accounting project.</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-emerald-600 px-6 text-white hover:bg-emerald-700"><Link href="/sign-up">Create your first invoice <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-white"><Link href="#how-it-works">See how it works</Link></Button>
          </div>
          <p className="mt-4 text-sm text-slate-500">Free to start · No credit card required</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Value icon={ReceiptText} text="Professional invoices" />
            <Value icon={MessageCircle} text="Easy sharing" />
            <Value icon={ShieldCheck} text="Secure payments" />
          </div>
        </motion.div>

        <HeroRightGallery />
      </div>
    </section>
  );
}

function Value({ icon: Icon, text }: { icon: typeof ReceiptText; text: string }) {
  return <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 shadow-sm"><Icon className="h-4 w-4 text-emerald-600" />{text}</div>;
}
