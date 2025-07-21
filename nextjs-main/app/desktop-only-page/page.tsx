// app/mobile-not-supported/page.tsx

import { Monitor } from 'lucide-react';   // ✅ lucide icon
import Link from 'next/link';

export default function MobileNotSupported() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white text-gray-700 px-6">
      <Monitor className="h-20 w-20 text-indigo-400 mb-6" />

      <h1 className="text-2xl font-semibold mb-2 text-center">
        Desktop-only feature
      </h1>
      <p className="max-w-md text-center text-sm leading-relaxed">
        This part of the site is currently available only on a desktop browser.
        Please switch to a larger screen to continue.
      </p>

      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-indigo-500 px-6 py-3 text-white font-medium hover:bg-indigo-600 transition"
      >
        Back to home
      </Link>
    </main>
  );
}
