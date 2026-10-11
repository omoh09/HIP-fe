'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, CheckCheck, FileText, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Create once',
    copy: 'Build the invoice once. Add the client, services, amount and payment terms, then let Hip Homorrd carry those details through the rest of the workflow.',
  },
  {
    number: '02',
    title: 'Share anywhere',
    copy: 'Send the same invoice through WhatsApp, email or a link without recreating the message or copying payment details into another app.',
  },
  {
    number: '03',
    title: 'Track what is due',
    copy: 'Partial payments update the invoice and dashboard automatically, so the amount left to collect is always obvious.',
  },
];

export default function ScrollInvoiceStory() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="border-y border-slate-200 bg-slate-50">
      <div className="page-container grid gap-14 py-20 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 lg:py-28">
        <div>
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">One invoice. One connected flow.</p>
            <h2 className="mt-4 max-w-xl text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl">Create once. Share anywhere. Track what is due.</h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">The page moves the same way the product does: from creating an invoice to sending it, collecting a payment and knowing exactly what remains.</p>
            <div className="mt-8 hidden gap-1 lg:flex" aria-hidden="true">
              {steps.map((step, index) => <span key={step.number} className={`h-1.5 flex-1 rounded-full transition ${index <= active ? 'bg-emerald-500' : 'bg-slate-200'}`} />)}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-5">
            {steps.map((step, index) => (
              <motion.article
                key={step.number}
                onViewportEnter={() => setActive(index)}
                viewport={{ amount: 0.55, margin: '-15% 0px -35% 0px' }}
                className={`min-h-[230px] rounded-2xl border p-6 transition-all duration-300 lg:min-h-[320px] ${active === index ? 'border-slate-300 bg-white shadow-lg shadow-slate-950/5' : 'border-transparent bg-transparent'}`}
              >
                <p className={`text-xs font-bold tracking-[0.16em] ${active === index ? 'text-emerald-700' : 'text-slate-400'}`}>{step.number}</p>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.copy}</p>
                <div className="mt-6 lg:hidden">
                  <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white p-3 shadow-lg shadow-slate-950/5">
                    {index === 0 && <CreateVisual />}
                    {index === 1 && <ShareVisual />}
                    {index === 2 && <TrackVisual />}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="relative hidden lg:block">
            <div className="sticky top-28 flex min-h-[660px] items-center">
              <div className="w-full overflow-hidden rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.45)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-xs font-semibold text-slate-500">Hip Homorrd workspace</span></div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">INV-0048</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -14, scale: 0.985 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {active === 0 && <CreateVisual />}
                    {active === 1 && <ShareVisual />}
                    {active === 2 && <TrackVisual />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function CreateVisual() {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Invoice</p><p className="mt-1 text-xl font-bold">INV-0048</p></div><FileText className="h-5 w-5 text-slate-400" /></div>
        <div className="mt-8 space-y-3">
          {[['Client', 'David Adebayo'], ['Service', 'Website design'], ['Amount', '₦250,000'], ['Due', '28 Aug 2026']].map(([label, value], index) => (
            <motion.div key={label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className="grid grid-cols-[90px_1fr] items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 text-xs">
              <span className="text-slate-400">{label}</span><span className="font-semibold text-slate-800">{value}</span>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.35, duration: 0.5 }} className="mt-5 h-1 origin-left rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}

function ShareVisual() {
  return (
    <div className="relative min-h-[500px] overflow-hidden rounded-2xl bg-[#eaf8ef] p-5">
      <motion.div initial={{ x: -60, rotate: -3 }} animate={{ x: 0, rotate: -1 }} transition={{ duration: 0.5 }} className="absolute left-6 top-14 w-[62%] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">INV-0048</p><p className="mt-2 text-sm font-semibold">David Adebayo</p><p className="mt-10 text-xs text-slate-400">Amount due</p><p className="mt-1 text-2xl font-bold">₦250,000</p>
      </motion.div>
      <motion.div initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="absolute bottom-10 right-5 w-[72%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-4 shadow-xl">
        <div className="flex items-center gap-2 text-[#159447]"><MessageCircle className="h-4 w-4" /><span className="text-xs font-bold">WhatsApp</span></div>
        <p className="mt-3 text-xs leading-5 text-slate-800">Hi David, your invoice for <strong>₦250,000</strong> is ready.</p>
        <button className="mt-4 w-full rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-emerald-700 shadow-sm">View invoice →</button>
        <p className="mt-2 flex items-center justify-end gap-1 text-[9px] text-slate-400">10:42 <CheckCheck className="h-3 w-3 text-sky-500" /></p>
      </motion.div>
    </div>
  );
}

function TrackVisual() {
  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white">
      <p className="text-xs font-semibold text-slate-400">Outstanding balance</p>
      <div className="mt-3 flex items-baseline gap-3"><motion.p initial={{ opacity: 0.4 }} animate={{ opacity: 0.55 }} className="text-2xl font-bold text-slate-400 line-through">₦250,000</motion.p><span className="text-slate-600">→</span><motion.p initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="text-4xl font-bold tracking-tight">₦150,000</motion.p></div>
      <div className="mt-8 grid grid-cols-2 gap-3"><DashCard label="Collected" value="₦100,000" /><DashCard label="Remaining" value="₦150,000" /></div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-slate-950"><Check className="h-4 w-4" /></span><div><p className="text-sm font-semibold">₦100,000 payment recorded</p><p className="text-xs text-emerald-200">Invoice status changed to Partial</p></div>
      </motion.div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800"><motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ delay: 0.2, duration: 0.7 }} className="h-full rounded-full bg-emerald-400" /></div>
    </div>
  );
}

function DashCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-[10px] text-slate-400">{label}</p><p className="mt-1 text-lg font-bold">{value}</p></div>;
}
