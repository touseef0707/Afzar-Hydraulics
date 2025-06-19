// components/ProtectedRoute.tsx
'use client'; // This directive is necessary for client-side hooks

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import your custom authentication hook

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext
  const router = useRouter();

  useEffect(() => {
    // Only proceed with redirection logic if not currently loading auth state
    if (!loading) {
      if (!user) {
        // If no user is logged in, redirect to the login page
        // You might want to add a query parameter to redirect back after login
        router.push('/login?redirect=/dashboard');
      }
    }
  }, [user, loading, router]); // Re-run effect when user, loading, or router changes

  // While authentication state is loading, you can show a loading indicator
  // or return null to prevent content from flickering.
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If a user is logged in, render the children (the protected content)
  if (user) {
    return <>{children}</>;
  }

  // If loading is complete and no user is found, this component will not render its children
  // because the useEffect hook would have already triggered a redirect.
  // This return null is a fallback or for cases where the redirect takes a moment.
  return null;
}
