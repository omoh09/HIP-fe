// components/TestimonialsSection.tsx
import Image from "next/image";

const testimonials = [
  {
    name: "Tina M.",
    role: "Freelancer",
    quote:
      "Creator Invoice Hub completely changed how I invoice clients. Payments are faster and I spend less time chasing!",
    avatar: "/images/people/tina.jpg",
  },
  {
    name: "James K.",
    role: "Small Business Owner",
    quote:
      "Our team loves how automated reminders reduce late payments. Our revenue tracking is effortless now.",
    avatar: "/images/people/james.jpg",
  },
  {
    name: "Lara P.",
    role: "Consultant",
    quote:
      "Finally, a tool that grows with my business. I can focus on my clients while invoices handle themselves.",
    avatar: "/images/people/lara.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Loved by Creators & Businesses
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Real people, real stories, real impact.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
              <p className="text-gray-700 text-base">"{t.quote}"</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
