'use client';

import { useState } from "react";
import Image from "next/image";

export default function FAQSection() {
  const faqs = [
    {
      question: "How do I create a branded invoice?",
      answer:
        "You can create a branded invoice quickly by uploading your logo, adding your business details, and customizing the invoice template to match your brand identity.",
      avatar: "/images/people/avatar-1.jpg",
    },
    {
      question: "How does my client receive and pay the invoice?",
      answer:
        "Clients receive the invoice via email or a secure payment link. They can pay instantly using multiple payment methods supported by our platform.",
      avatar: "/images/people/avatar-2.jpg",
    },
    {
      question: "Do I get paid immediately after the client pays?",
      answer:
        "Yes, payments are confirmed instantly and the funds are available in your account without delay, ensuring smooth cash flow.",
      avatar: "/images/people/avatar-3.jpg",
    },
    {
      question: "Are there automated reminders for unpaid invoices?",
      answer:
        "Absolutely! Our system sends automated, polite reminders to clients for any outstanding invoices to help you get paid faster.",
      avatar: "/images/people/avatar-4.jpg",
    },
    {
      question: "Can I track all my invoice payments and statuses?",
      answer:
        "Yes, our dashboard provides real-time reports and status updates for all your invoices, helping you stay on top of your finances.",
      avatar: "/images/people/avatar-5.jpg",
    },
    {
      question: "Is my invoice and payment data secure?",
      answer:
        "We use industry-standard encryption and security protocols to ensure your data and payments are always protected.",
      avatar: "/images/people/avatar-6.jpg",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="creator-invoice-faq-heading"
      className="bg-white px-6 py-28 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            id="creator-invoice-faq-heading"
            className="text-4xl font-extrabold text-gray-900 leading-tight"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know before getting started.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid gap-12 md:grid-cols-2">
          {faqs.map(({ question, answer, avatar }, idx) => (
            <div
              key={question}
              className="flex gap-4 rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={avatar}
                    alt="User avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                    {question}
                  </h3>
                  <span className="text-green-600 text-xl font-bold">
                    {openIndex === idx ? "−" : "+"}
                  </span>
                </div>

                {openIndex === idx && (
                  <p className="mt-3 text-base text-gray-700 leading-relaxed">
                    {answer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
