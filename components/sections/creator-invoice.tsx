import Image from "next/image";

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
  },
  {
    title: "Automated Reminders",
    description:
      "Unpaid invoices are followed up automatically so you don’t have to chase.",
  },
];



export default function CreatorInvoice() {
  return (
    <section
      aria-labelledby="creator-invoice-hub"
      className="bg-white px-6 py-16 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
          {/* LEFT CONTENT */}
          {/* LEFT CONTENT */}
{/* LEFT CONTENT */}
<div>
  <h2
    id="creator-invoice-hub"
    className="text-3xl font-semibold leading-tight text-gray-900 md:text-4xl"
  >
    Get Paid Without Chasing Clients
  </h2>
  <p className="max-w-xl text-lg font-medium leading-relaxed text-gray-700">
    Send invoices that look professional, get paid instantly, and let automation
    handle the follow-ups.
  </p>

  {/* DIAGONAL FLOW */}
  <ol className="mt-12 space-y-10">
    {invoiceFlow.map((step, index) => (
      <li
        key={step.title}
        className="relative"
        style={{
          marginLeft: `${index * 1.0}rem`,
        }}
      >
        {/* Bullet */}
        <span
          aria-hidden
          className="absolute -left-10 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg"
        >
          {index + 1}
        </span>

        {/* Card */}
        <div className="rounded-xl bg-white px-6 py-5 shadow-[0_14px_34px_rgba(0,0,0,0.1)]">
          <p className="text-base font-semibold text-gray-900 md:text-lg">
            {step.title}
          </p>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            {step.description}
          </p>
        </div>
      </li>
    ))}
  </ol>
</div>


         {/* RIGHT CONTENT — MINIMAL LUXURY × BOLD FINTECH */}
<div className="relative grid grid-cols-2 gap-8">
  {/* COLUMN 1 — OFFSET DOWN */}
  <div className="mt-20 space-y-8">
    {/* Branded Invoice */}
    <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100
      shadow-[0_10px_20px_rgba(0,0,0,0.06)]
      md:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
      transition-all duration-300 hover:-translate-y-1
      md:hover:shadow-[0_30px_60px_rgba(0,0,0,0.14)]">
      <Image
        src="/images/creator-invoice/branded-invoice.jpg"
        alt="Branded invoice sent to client"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
      <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-gray-900 shadow-sm">
        Branded Invoice
      </span>
    </div>

    {/* Payment Confirmed */}
    <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-emerald-100
      shadow-[0_10px_20px_rgba(0,0,0,0.06)]
      md:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
      transition-all duration-300 hover:-translate-y-1
      md:hover:shadow-[0_30px_60px_rgba(0,0,0,0.14)]">
      <Image
        src="/images/creator-invoice/payment-confirmed.jpg"
        alt="Payment confirmed instantly"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      <span className="absolute bottom-4 left-4 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md">
        Paid Instantly
      </span>
    </div>
  </div>

  {/* COLUMN 2 — HIGHER */}
  <div className="space-y-8">
    {/* Client Payment */}
    <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-blue-100
      shadow-[0_10px_20px_rgba(0,0,0,0.06)]
      md:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
      transition-all duration-300 hover:-translate-y-1
      md:hover:shadow-[0_30px_60px_rgba(0,0,0,0.14)]">
      <Image
        src="/images/creator-invoice/client-payment.jpg"
        alt="Client paying invoice"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      <span className="absolute bottom-4 left-4 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md">
        Client Pays
      </span>
    </div>

    {/* Automated Reminder */}
    <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-purple-100
      shadow-[0_10px_20px_rgba(0,0,0,0.06)]
      md:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
      transition-all duration-300 hover:-translate-y-1
      md:hover:shadow-[0_30px_60px_rgba(0,0,0,0.14)]">
      <Image
        src="/images/creator-invoice/automated-reminder.jpg"
        alt="Automated invoice reminders"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      <span className="absolute bottom-4 left-4 rounded-full bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md">
        Auto Reminder
      </span>
    </div>
  </div>
</div>


        </div>
      </div>
    </section>
  );
}
