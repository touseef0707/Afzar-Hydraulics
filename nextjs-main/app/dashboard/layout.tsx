import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {children}
    </section>
  );
}
