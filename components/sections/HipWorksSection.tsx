// components/HipWorksSection.tsx
import Image from "next/image";

export default function HipWorksSection() {
  const steps = [
    {
      title: "Create Branded Invoice",
      description: "Design and send professional invoices in seconds.",
      image: "/images/people/creator-laptop.jpg",
    },
    {
      title: "Clients Pay Instantly",
      description: "Secure, easy payments that show up immediately.",
      image: "/images/people/client-phone.jpg",
    },
    {
      title: "Automated Follow-ups",
      description: "Reminders sent automatically so you never chase late payments.",
      image: "/images/people/dashboard.jpg",
    },
    {
      title: "Track Growth",
      description: "Monitor sales, payments, and revenue in one dashboard.",
      image: "/images/people/creator-celebrating.jpg",
    },
  ];

  return (
    <section className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Section header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            How HIP Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            From invoice creation to payment and growth tracking, everything in one place.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-16">
          {steps.map((step) => (
            <div key={step.title} className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Image on the left */}
              <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Text on the right */}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
