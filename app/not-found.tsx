import Link from 'next/link';
import { CircleIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-50">
      <div className="max-w-md space-y-8 p-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-green-600" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-base text-gray-600">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="
            mx-auto inline-flex max-w-fit items-center justify-center
            rounded-full border border-green-600/20
            bg-green-600 px-6 py-2.5
            text-sm font-semibold text-white
            shadow-sm transition
            hover:bg-green-700
            focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2
          "
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
