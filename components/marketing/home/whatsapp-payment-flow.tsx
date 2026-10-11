'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Check, CheckCheck, MessageCircle, WalletCards } from 'lucide-react';

export default function WhatsAppPaymentFlow() {
  return (
    <section className="overflow-hidden bg-slate-950 py-20 text-white lg:py-28">
      <div className="page-container grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">Your strongest advantage</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">From WhatsApp conversation to collected payment.</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">Your client does not need to learn a new workflow. Send the invoice in the conversation you already use, let them open and pay, then see the remaining balance update inside Hip Homorrd.</p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold text-slate-300"><span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Invoice created</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Shared instantly</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Partial payment tracked</span></div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <div className="absolute -inset-24 bg-[radial-gradient(circle,rgba(16,185,129,0.16),transparent_58%)] blur-3xl" />
          <div className="relative grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} className="rounded-[26px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white"><MessageCircle className="h-4 w-4" /></span><div><p className="text-xs font-semibold">David A.</p><p className="text-[9px] text-slate-500">WhatsApp</p></div></div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} viewport={{ once: true }} className="mt-7 ml-auto rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-3 text-slate-900">
                <p className="text-xs leading-5">Hi David,<br/>Your invoice for <strong>₦250,000</strong> is ready.</p>
                <div className="mt-3 rounded-xl bg-white p-3 shadow-sm"><p className="text-[9px] uppercase tracking-wider text-slate-400">Invoice INV-0048</p><p className="mt-1 text-sm font-bold">₦250,000</p><p className="mt-2 text-[10px] font-bold text-emerald-700">View invoice →</p></div>
                <p className="mt-1 flex items-center justify-end gap-1 text-[9px] text-slate-400">10:42 <CheckCheck className="h-3 w-3 text-sky-500" /></p>
              </motion.div>
            </motion.div>

            <div className="flex items-center justify-center py-1 sm:px-1"><motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.7, repeat: Infinity }} className="flex h-9 w-9 rotate-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-emerald-300 sm:-rotate-90"><ArrowDown className="h-4 w-4" /></motion.span></div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: 0.15 }} className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Payment</p><p className="mt-2 text-sm font-semibold">₦100,000 received</p></div><span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-slate-950"><WalletCards className="h-4 w-4" /></span></div>
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.7 }} className="mt-5 h-1 origin-left rounded-full bg-emerald-400" />
              </div>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 }} className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[0.14em] text-emerald-300">Hip Homorrd</p><p className="mt-2 text-xs text-emerald-100">Remaining balance</p><p className="mt-1 text-3xl font-bold tracking-tight">₦150,000</p></div><span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-slate-950"><Check className="h-4 w-4" /></span></div>
                <p className="mt-4 text-xs font-semibold text-emerald-200">Payment received ✓</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
