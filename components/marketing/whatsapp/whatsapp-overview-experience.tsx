'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, CheckCheck, Clock3, FileText, MessageCircle, WalletCards } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const steps = [
  { label: 'Invoice ready', amount: '₦250,000', detail: 'INV-0048' },
  { label: 'Sent on WhatsApp', amount: '₦250,000', detail: 'Delivered 10:42' },
  { label: 'Payment received', amount: '+₦100,000', detail: 'Partial payment' },
  { label: 'Balance updated', amount: '₦150,000', detail: 'Remaining' },
];

export default function WhatsAppOverviewExperience() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setStep(3);
      return;
    }
    const timer = window.setInterval(() => setStep((current) => (current + 1) % steps.length), 1900);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const paid = step >= 2;

  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="absolute -inset-12 rounded-[4rem] bg-[radial-gradient(circle_at_50%_40%,rgba(37,211,102,0.20),transparent_62%)] blur-3xl" />
      <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/90 p-3 shadow-[0_35px_100px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[.92fr_1.08fr]">
          <div className="rounded-[22px] border border-slate-200 bg-slate-950 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">Hip Homorrd</p>
                <p className="mt-1 text-sm font-semibold">Invoice activity</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><FileText className="h-4 w-4" /></span>
            </div>

            <div className="mt-8 rounded-2xl bg-white p-4 text-slate-950">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">INV-0048</p>
                  <p className="mt-2 text-sm font-semibold">David Adebayo</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${paid ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>{paid ? 'PARTIAL' : 'DUE'}</span>
              </div>
              <div className="mt-8 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400">Invoice total</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">₦250,000</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <StatusMini label="Paid" value={paid ? '₦100,000' : '₦0'} active={paid} />
                <StatusMini label="Remaining" value={paid ? '₦150,000' : '₦250,000'} active={step >= 3} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={steps[step].label}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-slate-950"><Check className="h-4 w-4" /></span>
                <div>
                  <p className="text-xs font-semibold">{steps[step].label}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{steps[step].detail}</p>
                </div>
                <span className="ml-auto text-xs font-bold text-emerald-300">{steps[step].amount}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[22px] bg-[#e9f8ef] p-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2.5 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white"><MessageCircle className="h-4 w-4" /></span>
              <div>
                <p className="text-xs font-semibold text-slate-900">David A.</p>
                <p className="text-[10px] text-slate-400">online</p>
              </div>
              <Clock3 className="ml-auto h-3.5 w-3.5 text-slate-300" />
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: step >= 1 ? 1 : 0.28, y: step >= 1 ? 0 : 10 }}
              className="ml-auto mt-8 max-w-[92%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-3 shadow-sm"
            >
              <p className="text-xs leading-5 text-slate-800">Hi David, your invoice <strong>INV-0048</strong> for <strong>₦250,000</strong> is ready.</p>
              <div className="mt-2.5 rounded-xl bg-white/80 p-3 ring-1 ring-black/5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white"><FileText className="h-3.5 w-3.5" /></span>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Hip Homorrd invoice</p>
                    <p className="mt-0.5 text-xs font-semibold">₦250,000 due</p>
                  </div>
                </div>
                <p className="mt-3 text-[11px] font-bold text-emerald-700">View invoice →</p>
              </div>
              <div className="mt-1.5 flex justify-end gap-1 text-[9px] text-slate-400">10:42 <CheckCheck className={`h-3 w-3 ${step >= 1 ? 'text-sky-500' : ''}`} /></div>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 10 }}
              className="mt-4 max-w-[84%] rounded-2xl rounded-tl-sm bg-white p-3 shadow-sm"
            >
              <p className="text-xs leading-5 text-slate-800">I’ve paid ₦100,000 now. I’ll clear the rest shortly.</p>
              <p className="mt-1 text-right text-[9px] text-slate-400">10:47</p>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 10 }}
              className="absolute inset-x-3 bottom-3 rounded-2xl border border-emerald-200 bg-white p-3.5 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white"><WalletCards className="h-4 w-4" /></span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Payment received ✓</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">₦100,000 paid · ₦150,000 remaining</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {steps.map((item, index) => (
          <button
            type="button"
            key={item.label}
            onClick={() => setStep(index)}
            className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${index === step ? 'bg-slate-950 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-950'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusMini({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`rounded-xl border p-2.5 transition ${active ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
      <p className="text-[9px] font-medium text-slate-400">{label}</p>
      <p className={`mt-1 text-xs font-bold ${active ? 'text-emerald-700' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}

export function WhatsAppMessageTemplates() {
  const templates = [
    { label: 'Send invoice', text: 'Hi David, your invoice INV-0048 for ₦250,000 is ready. You can view it and make payment here.' },
    { label: 'Friendly reminder', text: 'Hi David, just a quick reminder that ₦150,000 is still outstanding on invoice INV-0048. Here is the payment link again.' },
    { label: 'Payment received', text: 'Thanks, David. We received ₦100,000 on INV-0048. Your remaining balance is ₦150,000.' },
  ];
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">Built for real follow-up</p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">The right message, with the right balance, at the right moment.</h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">Stop copying invoice numbers, amounts and payment details from one screen into another. Start from the invoice, choose the action, and keep the client conversation tied to what is actually due.</p>
        <div className="mt-7 flex flex-wrap gap-2">
          {templates.map((template, index) => (
            <button key={template.label} onClick={() => setActive(index)} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active === index ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{template.label}</button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-md rounded-3xl bg-[#e9f8ef] p-4 shadow-sm ring-1 ring-slate-200/70">
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white"><MessageCircle className="h-4 w-4" /></span>
            <div><p className="text-xs font-semibold text-slate-900">David A.</p><p className="text-[10px] text-slate-400">WhatsApp</p></div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="ml-auto mt-8 max-w-[92%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-4 shadow-sm">
              <p className="text-sm leading-6 text-slate-800">{templates[active].text}</p>
              <div className="mt-3 flex justify-end gap-1 text-[10px] text-slate-400">10:42 <CheckCheck className="h-3.5 w-3.5 text-sky-500" /></div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex justify-center">
          <Link href="/sign-up" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">Create your first invoice <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>
  );
}
