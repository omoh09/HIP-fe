'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, CheckCheck, Eye, FileText, MessageCircle, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';

const stages = [
  { label: 'Invoice created', icon: FileText },
  { label: 'Shared on WhatsApp', icon: MessageCircle },
  { label: 'Client opened', icon: Eye },
  { label: 'Payment received', icon: WalletCards },
  { label: 'Balance updated', icon: Check },
];

export default function HeroWorkflowDemo() {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setStage(4);
      return;
    }
    const timer = window.setInterval(() => setStage((current) => (current + 1) % stages.length), 1800);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const paid = stage >= 3 ? 100000 : 0;
  const remaining = 250000 - paid;

  return (
    <div className="relative mx-auto w-full max-w-[620px] lg:ml-auto">
      <div className="absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.18),transparent_58%)] blur-2xl" />

      <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-3 shadow-[0_32px_90px_-38px_rgba(15,23,42,0.35)] sm:p-4">
        <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Live product flow</span>
        </div>

        <div className="grid gap-3 pt-3 sm:grid-cols-[1.08fr_.92fr]">
          <motion.div layout className="relative min-h-[370px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:min-h-[400px]">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">H</div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Invoice</p>
                  <p className="mt-1 text-lg font-bold text-slate-950">INV-0048</p>
                </div>
                <motion.span
                  layout
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${stage >= 3 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}
                >
                  {stage >= 3 ? 'Partial' : 'Due'}
                </motion.span>
              </div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-3 border-t border-slate-100 pt-5"
              >
                <Line label="Website design" value="₦180,000" />
                <Line label="Launch support" value="₦70,000" />
                <div className="h-px bg-slate-100" />
                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm font-medium text-slate-500">Total due</span>
                  <span className="text-xl font-bold tracking-tight text-slate-950">₦250,000</span>
                </div>
              </motion.div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Metric label={stage >= 3 ? 'Payment received' : 'Paid'} value={paid ? '+₦100,000' : '₦0'} accent={stage >= 3} />
              <Metric label="Remaining" value={`₦${remaining.toLocaleString('en-NG')}`} accent={stage >= 4} />
            </div>

            <AnimatePresence mode="wait">
              {stage >= 3 && (
                <motion.div
                  key={stage}
                  initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 shadow-lg shadow-emerald-950/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"><Check className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-semibold text-emerald-950">Payment received</p>
                    <p className="text-xs text-emerald-700">+₦100,000 from David</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-[#e9f8ef] p-3 sm:min-h-[400px]">
            <div className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white"><MessageCircle className="h-4 w-4" /></span>
              <div>
                <p className="text-xs font-semibold text-slate-900">David A.</p>
                <p className="text-[10px] text-slate-400">online</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <motion.div
                initial={false}
                animate={{ opacity: stage >= 1 ? 1 : 0.28, y: stage >= 1 ? 0 : 8 }}
                className="ml-auto max-w-[92%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-3 shadow-sm"
              >
                <p className="text-xs leading-5 text-slate-800">Hi David, your invoice for <strong>₦250,000</strong> is ready.</p>
                <div className="mt-2 rounded-xl bg-white/80 p-2.5 ring-1 ring-black/5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Hip Homorrd</p>
                  <p className="mt-1 text-xs font-semibold text-slate-900">INV-0048 · ₦250,000</p>
                  <p className="mt-1 text-[11px] font-semibold text-emerald-700">View invoice →</p>
                </div>
                <div className="mt-1.5 flex justify-end gap-1 text-[9px] text-slate-400">10:42 <CheckCheck className={`h-3 w-3 ${stage >= 2 ? 'text-sky-500' : ''}`} /></div>
              </motion.div>

              <motion.div
                initial={false}
                animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 10 }}
                className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white p-3 shadow-sm"
              >
                <p className="text-xs text-slate-800">Got it. Opening now.</p>
                <p className="mt-1 text-right text-[9px] text-slate-400">10:44</p>
              </motion.div>

              <motion.div
                initial={false}
                animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 10 }}
                className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-3 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Payment received ✓</p>
                    <p className="text-[10px] text-slate-500">₦100,000 paid · ₦150,000 left</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : -8 }}
        className="absolute -right-1 -top-5 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl sm:flex lg:-right-8"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#159447]"><MessageCircle className="h-4 w-4" /></span>
        <div>
          <p className="text-xs font-semibold text-slate-900">Invoice INV-0048 has been sent.</p>
          <p className="mt-0.5 text-[10px] text-slate-400">via WhatsApp</p>
        </div>
      </motion.div>

      <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Workflow animation status">
        {stages.map(({ label, icon: Icon }, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStage(index)}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold transition ${index === stage ? 'bg-slate-950 text-white' : index < stage ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}
            aria-label={`Show ${label}`}
          >
            <Icon className="h-3 w-3" />{label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 text-xs"><span className="text-slate-500">{label}</span><span className="font-semibold text-slate-800">{value}</span></div>;
}

function Metric({ label, value, accent }: { label: string; value: string; accent: boolean }) {
  return (
    <motion.div layout className={`rounded-xl border p-3 transition ${accent ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
      <p className="text-[10px] font-medium text-slate-400">{label}</p>
      <AnimatePresence mode="wait">
        <motion.p key={value} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className={`mt-1 text-sm font-bold ${accent ? 'text-emerald-700' : 'text-slate-900'}`}>{value}</motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
