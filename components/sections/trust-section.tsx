'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const stories = [
  {
    title: "Create & Send",
    desc: "Send a professional invoice in seconds.",
    img: "/images/people/creator-laptop.jpg",
  },
  {
    title: "Get Paid Instantly",
    desc: "Your client pays instantly using their preferred method.",
    img: "/images/people/client-phone.jpg",
  },
  {
    title: "Celebrate Your Success",
    desc: "Money in your account, no follow-ups needed.",
    img: "/images/people/creator-celebrating.jpg",
  },
  {
    title: "Grow Effortlessly",
    desc: "Analytics, automation, and insights help you scale.",
    img: "/images/people/dashboard.jpg",
  },
];

export default function StorySection() {
  return (
    <section className="relative py-28 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-24">
        {/* Headline */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Endless payment possibilities
          </h2>
          <p className="text-xl sm:text-2xl text-green-600 font-semibold">
            For every creator, freelancer, and entrepreneur
          </p>
        </motion.div>

        {/* Story Steps */}
        <div className="grid gap-16">
          {stories.map((story, idx) => (
            <motion.div
              key={story.title}
              className={`grid gap-8 items-center ${
                idx % 2 === 0 ? "lg:grid-cols-2" : "lg:grid-cols-2 lg:flex-row-reverse"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              {/* Text */}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900">{story.title}</h3>
                <p className="text-lg text-gray-600">{story.desc}</p>
              </div>
              {/* Image */}
              <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <Image
                  src={story.img}
                  alt={story.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Metrics / Social Proof */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white shadow-xl rounded-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <p className="text-5xl font-bold text-gray-900">12,500+</p>
            <p className="mt-2 text-gray-600">Creators</p>
          </div>
          <div className="bg-white shadow-xl rounded-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <p className="text-5xl font-bold text-gray-900">₦1.2B</p>
            <p className="mt-2 text-gray-600">Processed Payments</p>
          </div>
          <div className="bg-white shadow-xl rounded-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <p className="text-5xl font-bold text-gray-900">35,000+</p>
            <p className="mt-2 text-gray-600">Invoices Sent</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
