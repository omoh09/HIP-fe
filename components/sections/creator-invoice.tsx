"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/* ---------------- DATA ---------------- */
const invoiceFlow = [
  {
    title: "Create a Branded Invoice",
    description:
      "Create a professional invoice with your brand and send it in seconds.",
  },
  {
    title: "Client Receives & Pays",
    description:
      "Your client receives the invoice and pays securely using their preferred method.",
  },
  {
    title: "Payment Confirmed Instantly",
    description:
      "Payment is confirmed immediately — no delays, no follow-ups.",
    success: true,
  },
  {
    title: "Automated Reminders",
    description:
      "Unpaid invoices are followed up automatically so you don’t have to chase.",
  },
];

/* ---------------- MOTION SYSTEM ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

/* ---------------- IMAGE CARD ---------------- */
function ParallaxCard({
  src,
  alt,
  label,
  badgeClass,
  pulse,
}: {
  src: string;
  alt: string;
  label: string;
  badgeClass: string;
  pulse?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -40]
  );

  return (
    <motion.div
      style={{ y }}
      whileHover={reduceMotion ? {} : { y: -8 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="relative aspect-[4/5] overflow-hidden rounded-2xl
      shadow-[0_20px_40px_rgba(0,0,0,0.12)] bg-neutral-100"
    >
      <Image src={src} alt={alt} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

      {/* BADGE */}
      <motion.span
        animate={
          pulse && !reduceMotion
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(16,185,129,0.6)",
                  "0 0 0 14px rgba(16,185,129,0)",
                ],
              }
            : {}
        }
        transition={
          pulse
            ? { repeat: Infinity, duration: 1.8, ease: "easeOut" }
            : undefined
        }
        className={`absolute bottom-4 left-4 rounded-full px-4 py-1.5
        text-xs font-semibold text-white ${badgeClass}`}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function CreatorInvoice() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className="relative bg-white px-6 py-24 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:items-center">

          {/* LEFT CONTENT */}
          <motion.div variants={stagger}>
            <motion.h2
              variants={fadeUp}
              className="max-w-xl text-3xl font-semibold leading-tight text-gray-900 md:text-4xl"
            >
              Get Paid Without Chasing Clients
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-xl text-lg leading-relaxed text-gray-700"
            >
              Send beautiful invoices, collect payments instantly,
              and let automation handle the follow-ups.
            </motion.p>

            {/* FLOW */}
            <motion.ol className="mt-14 space-y-10">
              {invoiceFlow.map((step, index) => (
                <motion.li
                  key={step.title}
                  variants={fadeUp}
                  style={{ marginLeft: `${index * 1}rem` }}
                  className="relative"
                >
                  <span className="absolute -left-10 top-4 flex h-8 w-8
                    items-center justify-center rounded-full bg-green-600
                    text-sm font-semibold text-white shadow-md">
                    {index + 1}
                  </span>

                  <div className="rounded-xl bg-white px-6 py-5
                    shadow-[0_14px_34px_rgba(0,0,0,0.1)]">
                    <p className="text-base font-semibold text-gray-900 md:text-lg">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-base">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>

            {/* CTA */}
            <motion.a
              href="/create-invoice"
              whileHover={reduceMotion ? {} : { scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="mt-10 inline-flex items-center justify-center
              rounded-full bg-green-600 px-7 py-3 text-sm font-semibold
              text-white shadow-lg hover:bg-green-700"
            >
              Create Your First Invoice
            </motion.a>
          </motion.div>

          {/* RIGHT VISUALS */}
          <div className="relative grid grid-cols-2 gap-8">
            <div className="mt-24 space-y-8">
              <ParallaxCard
                src="/images/creator-invoice/branded-invoice.jpg"
                alt="Branded invoice"
                label="Branded Invoice"
                badgeClass="bg-gray-900"
              />
              <ParallaxCard
                src="/images/creator-invoice/payment-confirmed.jpg"
                alt="Payment confirmed"
                label="Paid Instantly"
                badgeClass="bg-emerald-600"
                pulse
              />
            </div>

            <div className="space-y-8">
              <ParallaxCard
                src="/images/creator-invoice/client-payment.jpg"
                alt="Client payment"
                label="Client Pays"
                badgeClass="bg-blue-600"
              />
              <ParallaxCard
                src="/images/creator-invoice/automated-reminder.jpg"
                alt="Automated reminder"
                label="Auto Reminder"
                badgeClass="bg-purple-600"
              />
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
