import { motion } from "framer-motion";
import { FiFileText, FiCreditCard, FiCheckCircle } from "react-icons/fi";

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2
          className="text-4xl font-extrabold text-center text-gray-900 tracking-tight mb-12 drop-shadow-sm"
          id="how-it-works-title"
          style={{ textShadow: "0 0 8px rgba(34, 197, 94, 0.4)" }}
        >
          How It Works
        </h2>

        <div
          className="mt-12 grid md:grid-cols-3 gap-12"
          role="list"
          aria-labelledby="how-it-works-title"
        >
          {[
            {
              icon: FiFileText,
              title: "Create an Invoice",
              desc: "Enter client name, amount, and due date.",
            },
            {
              icon: FiCreditCard,
              title: "Share Payment Link",
              desc: "Send via email or WhatsApp.",
            },
            {
              icon: FiCheckCircle,
              title: "Get Paid Instantly",
              desc: "Client pays via Paystack. You get notified.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative cursor-pointer rounded-2xl bg-white bg-opacity-40 backdrop-blur-lg border border-green-200/60 p-8 text-center shadow-lg shadow-green-200/40
                hover:scale-[1.05] hover:shadow-emerald-400/70 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-transform duration-300"
              role="listitem"
              tabIndex={0}
              aria-label={`${title}: ${desc}`}
            >
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 text-white
                  shadow-lg shadow-emerald-500/60"
              >
                <Icon className="h-7 w-7 drop-shadow-md" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 drop-shadow-sm">
                {title}
              </h3>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                {desc}
              </p>

              {/* Glossy shine effect */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-tr from-white/40 via-white/10 to-transparent opacity-30"
                style={{
                  mixBlendMode: "screen",
                  filter: "blur(20px)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
