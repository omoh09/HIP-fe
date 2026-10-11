'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BarChart3, Blocks, CreditCard, FileCheck2, MessageCircle, SplitSquareVertical } from 'lucide-react';
import { useEffect, useState } from 'react';

const features = [
  { title: 'Professional invoices', detail: 'Branded, client-ready invoices with clear line items and terms.', icon: FileCheck2, pos: 'left-0 top-8' },
  { title: 'Payment collection', detail: 'Give every invoice a direct path to payment.', icon: CreditCard, pos: 'right-0 top-8' },
  { title: 'WhatsApp invoicing', detail: 'Send the invoice where clients are already talking to you.', icon: MessageCircle, pos: 'left-0 bottom-8' },
  { title: 'Partial payments', detail: 'Record deposits and keep the remaining balance visible.', icon: SplitSquareVertical, pos: 'right-0 bottom-8' },
  { title: 'Reports', detail: 'See collected revenue and outstanding balances at a glance.', icon: BarChart3, pos: 'left-1/2 top-0 -translate-x-1/2' },
  { title: 'Business workflows', detail: 'Projects, retainers, consulting and service work in one flow.', icon: Blocks, pos: 'left-1/2 bottom-0 -translate-x-1/2' },
];

export default function FeatureOrbit() {
  const [active, setActive] = useState(2);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % features.length), 2600);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section className="page-container py-20 lg:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Everything around the invoice</p>
        <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl">The invoice is the centre. Everything else stays connected.</h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">Hip Homorrd turns one invoice into the working record for sending, collecting, following up and reporting—without making you manage six separate tools.</p>
      </div>

      <div className="relative mx-auto mt-14 hidden h-[610px] max-w-5xl lg:block">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 610" aria-hidden="true">
          {[[500,305,180,93],[500,305,820,93],[500,305,180,517],[500,305,820,517],[500,305,500,65],[500,305,500,545]].map(([x1,y1,x2,y2], index) => (
            <motion.line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={active === index ? '#10b981' : '#e2e8f0'} strokeWidth={active === index ? 2 : 1} strokeDasharray="5 7" animate={{ pathLength: active === index ? 1 : 0.75, opacity: active === index ? 1 : 0.8 }} />
          ))}
        </svg>

        <div className="absolute left-1/2 top-1/2 w-[390px] -translate-x-1/2 -translate-y-1/2">
          <motion.div layout className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_28px_80px_-38px_rgba(15,23,42,0.45)]">
            <div className="flex items-start justify-between"><div><span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">H</span><p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">INV-0048</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Partial</span></div>
            <p className="mt-7 text-xs text-slate-400">David Adebayo · Website project</p>
            <div className="mt-2 flex items-end justify-between"><p className="text-sm font-semibold text-slate-500">Remaining balance</p><p className="text-3xl font-bold tracking-tight text-slate-950">₦150,000</p></div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[40%] rounded-full bg-emerald-500" /></div>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-5 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">{(() => { const Icon = features[active].icon; return <Icon className="h-4 w-4" />; })()}</span><div><p className="text-xs font-bold text-slate-900">{features[active].title}</p><p className="mt-0.5 text-[11px] leading-5 text-slate-500">{features[active].detail}</p></div></div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {features.map(({ title, icon: Icon, pos }, index) => (
          <button
            key={title}
            type="button"
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
            className={`absolute ${pos} w-[220px] rounded-2xl border bg-white p-4 text-left shadow-sm transition-all duration-300 ${active === index ? 'z-10 -translate-y-1 border-emerald-300 shadow-xl shadow-emerald-950/10' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${active === index ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}><Icon className="h-5 w-5" /></span>
            <p className="mt-4 text-sm font-bold text-slate-950">{title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{features[index].detail}</p>
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:hidden">
        {features.map(({ title, detail, icon: Icon }, index) => (
          <button key={title} type="button" onClick={() => setActive(index)} className={`rounded-2xl border p-5 text-left transition ${active === index ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-white'}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white"><Icon className="h-4 w-4" /></span><p className="mt-4 font-bold text-slate-950">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
