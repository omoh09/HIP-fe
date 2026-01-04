// components/WaitlistCTASection.tsx
import Link from "next/link";

export default function WaitlistCTASection() {
  return (
    <section className="bg-green-600 py-28 text-white">
      <div className="max-w-3xl mx-auto text-center px-6 space-y-6">
        <h2 className="text-4xl sm:text-5xl font-bold">
          Start Sending Invoices Today

        </h2>
        <p className="text-lg sm:text-xl">
          Create your first invoice in under 2 minutes and get paid Instantly.
        </p>
        <Link href="/create-invoice">
          <button className="mt-4 px-8 py-4 bg-white text-green-600 font-semibold rounded-full text-lg hover:bg-gray-100 transition">
            Create invoice for free
          </button>
        </Link>
        <p className="mt-4 text-sm opacity-80">
          No credit card required. Limited spots available!
        </p>
      </div>
    </section>
  );
}
