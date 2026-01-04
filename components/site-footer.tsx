import Link from "next/link";
import { useState } from "react";

export default function SiteFooter() {
  const [open, setOpen] = useState(false);

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* FOOTER CTA */}
        <div className="mb-20 rounded-3xl border border-green-200 p-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-green-50">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Start sending invoices that get paid faster
            </h3>
            <p className="mt-2 text-gray-700 max-w-lg">
              Join creators and businesses simplifying invoicing, payments, and cash flow — all in one place.
            </p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-700 transition"
          >
            Join the waitlist
          </Link>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-12 gap-y-10 text-sm">
          {[
            {
              title: "Products",
              links: [
                "Invoicing",
                "Payment Links",
                "Recurring Payments",
                "Reports & Analytics",
                "Accounting Integration",
                "Notifications & Reminders",
              ],
            },
            {
              title: "Solutions",
              links: [
                "Freelancers & Creators",
                "Small Businesses",
                "Enterprises",
                "Subscription Management",
                "Multi-Currency Support",
              ],
            },
            {
              title: "Resources",
              links: ["Guides", "Customer Stories", "Blog", "FAQ"],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Press", "Contact Sales"],
            },
            {
              title: "Support",
              links: [
                "Help Center",
                "Sign In",
                "hi@creatorinvoicehub.com",
                "+233 30 700 0924",
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-gray-900 mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4 text-gray-600">
                {section.links.map((item) => (
                  <li key={item}>
                    {item.includes("@") ? (
                      <a
                        href={`mailto:${item}`}
                        className="hover:text-green-600 transition"
                      >
                        {item}
                      </a>
                    ) : item.startsWith("+") ? (
                      <a
                        href={`tel:${item}`}
                        className="hover:text-green-600 transition"
                      >
                        {item}
                      </a>
                    ) : (
                      <Link
                        href="#"
                        className="hover:text-green-600 transition"
                      >
                        {item}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* TRUST + APPS */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-gray-200 pt-10">

          {/* TRUST BADGES */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Trusted & Secure</span>
            <span className="px-3 py-1 border border-green-500 text-green-600 rounded-full font-medium">
              CBN Regulated
            </span>
            <span className="px-3 py-1 border border-green-500 text-green-600 rounded-full font-medium">
              PCI-DSS Compliant
            </span>
            <span className="px-3 py-1 border border-green-500 text-green-600 rounded-full font-medium">
              SSL Secured
            </span>
          </div>

          {/* APP STORE BUTTONS */}
          <div className="flex gap-4">
            <Link
              href="#"
              className="flex items-center gap-2 border border-green-600 rounded-lg px-4 py-2 text-sm text-green-600 font-medium hover:bg-green-50 transition"
            >
              <span className="text-lg">🍎</span>
              App Store
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 border border-green-600 rounded-lg px-4 py-2 text-sm text-green-600 font-medium hover:bg-green-50 transition"
            >
              <span className="text-lg">▶️</span>
              Google Play
            </Link>
          </div>
        </div>

        {/* LEGAL + COUNTRY */}
        <div className="mt-10 flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500">

          {/* COUNTRY SELECTOR */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 border border-green-500 px-4 py-2 rounded-lg hover:bg-green-50 text-green-600 font-medium transition"
            >
              🇳🇬 Nigeria
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" />
              </svg>
            </button>

            {open && (
              <div className="absolute mt-2 w-44 bg-white border border-green-200 rounded-lg shadow-lg z-10">
                {["Nigeria", "Ghana", "Kenya", "South Africa"].map((country) => (
                  <button
                    key={country}
                    className="block w-full text-left px-4 py-2 hover:bg-green-50 transition"
                  >
                    {country}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LEGAL */}
          <div className="flex flex-wrap gap-6">
            <Link href="#" className="hover:text-green-600 transition">Privacy</Link>
            <Link href="#" className="hover:text-green-600 transition">Terms</Link>
            <Link href="#" className="hover:text-green-600 transition">Cookies</Link>
          </div>
        </div>

        {/* COPYRIGHT */}
        <p className="mt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} Creator Invoice Hub Technologies Limited.
          Regulated by the Central Bank of Nigeria (CBN).
        </p>
      </div>
    </footer>
  );
}
