// components/BoostSalesSection.tsx
import { useEffect, useRef } from "react";

export default function BoostSalesSection() {
  const chartRef = useRef<SVGSVGElement>(null);

  // Optional: animate chart path on mount (simple SVG line chart)
  useEffect(() => {
    const path = chartRef.current?.querySelector("path");
    if (path) {
      path.style.strokeDasharray = path.getTotalLength().toString();
      path.style.strokeDashoffset = path.getTotalLength().toString();
      setTimeout(() => {
        path.style.transition = "stroke-dashoffset 1.5s ease";
        path.style.strokeDashoffset = "0";
      }, 100);
    }
  }, []);

  return (
    <section
      aria-labelledby="creator-invoice-impact-title"
      className="bg-white px-6 py-20 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center lg:items-start gap-12">
        {/* Left: Improvement Chart */}
        <div className="w-full max-w-sm lg:max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Revenue Growth After Adoption
          </h3>

          {/* Simple SVG Line Chart */}
          <svg
            ref={chartRef}
            viewBox="0 0 200 120"
            aria-label="Chart showing revenue growth over time"
            role="img"
            className="w-full max-w-xs h-auto"
          >
            {/* Axes */}
            <line
              x1="20"
              y1="100"
              x2="180"
              y2="100"
              stroke="#D1D5DB"
              strokeWidth="2"
              aria-hidden="true"
            />
            <line
              x1="20"
              y1="100"
              x2="20"
              y2="20"
              stroke="#D1D5DB"
              strokeWidth="2"
              aria-hidden="true"
            />

            {/* Growth line path */}
            <path
              d="M20 90 L60 80 L100 55 L140 45 L180 30"
              fill="none"
              stroke="#16A34A" // Tailwind green-600
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            />

            {/* Data points */}
            {[{ x: 20, y: 90 }, { x: 60, y: 80 }, { x: 100, y: 55 }, { x: 140, y: 45 }, { x: 180, y: 30 }].map(
              ({ x, y }, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#16A34A"
                  stroke="white"
                  strokeWidth="2"
                />
              )
            )}

            {/* Labels */}
            <text
              x="20"
              y="115"
              fill="#6B7280"
              fontSize="10"
              aria-hidden="true"
              textAnchor="middle"
            >
              Start
            </text>
            <text
              x="180"
              y="115"
              fill="#6B7280"
              fontSize="10"
              aria-hidden="true"
              textAnchor="middle"
            >
              Now
            </text>

            <text
              x="10"
              y="100"
              fill="#6B7280"
              fontSize="10"
              aria-hidden="true"
              textAnchor="end"
            >
              $0
            </text>
            <text
              x="10"
              y="25"
              fill="#6B7280"
              fontSize="10"
              aria-hidden="true"
              textAnchor="end"
            >
              $15K+
            </text>
          </svg>

          <p className="mt-6 text-center text-gray-700 max-w-xs">
            Visualize your revenue growth after adopting Creator Invoice Hub — real results, real impact.
          </p>
        </div>

        {/* Right content */}
        <div className="max-w-xl text-gray-900">
          <h2
            id="creator-invoice-impact-title"
            className="text-2xl font-semibold leading-tight mb-4 text-center lg:text-left"
          >
            From One-Time Invoice to Lifelong Client
          </h2>
          <p className="mb-8 text-gray-600 text-center lg:text-left">
            Automate every part of your invoice workflow—from sending branded invoices to
            managing reminders and receiving instant payments—building lasting relationships with your clients.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                {/* Icon: Instant Payment Confirmation */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Instant Payment Confirmation</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Get paid immediately once your client completes payment, improving your cash flow.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                {/* Icon: Automated Payment Reminders */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-6a2 2 0 012-2h6m-2 12v-4m-4 0v4m4 0h-6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Automated Payment Reminders</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Reduce late payments with pre-built automated reminders sent to your clients.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                {/* Icon: Real-Time Sales Tracking */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17h2m-1-6v6m6-8h-3.5a1.5 1.5 0 000 3h3.5M5 11h.01"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Real-Time Sales Tracking</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Monitor all invoice payments and statuses with detailed, easy-to-read reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
