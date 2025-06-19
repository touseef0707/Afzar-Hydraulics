// components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Corrected path if needed: '@/contexts/AuthContext'
import { auth } from '@/firebase/clientApp';



const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-xl font-bold text-blue-600">Afzar Hydraulics</div>
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-xl font-bold text-blue-600 transition-colors duration-200 hover:text-blue-700">
              <span>Afzar Hydraulics</span>
            </Link>
          </div>

          {/* Primary Nav - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Nav Link with Underline Hover Effect */}
            <Link href="/" className="nav-link group relative">
              Home
              <span className="underline-span"></span>
            </Link>
            <Link href="/about" className="nav-link group relative">
              About
              <span className="underline-span"></span>
            </Link>
            {user && (
              <Link href="/dashboard" className="nav-link group relative">
                Dashboard
                <span className="underline-span"></span>
              </Link>
            )}
            <Link href="/contact" className="nav-link group relative">
              Contact
              <span className="underline-span"></span>
            </Link>
          </div>

          {/* Secondary Nav - Desktop & Auth/Profile Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              // User is logged in: show profile dropdown
              <div className="relative ml-3">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-100 hover:shadow-md"
                  id="user-menu"
                  aria-haspopup="true"
                  aria-expanded={isProfileMenuOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                    {(user.displayName || user.email)?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                    {user.displayName || user.email}
                  </span>
                  <svg className={`ml-1 h-5 w-5 text-gray-500 transform transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="nav-link-button-secondary">
                  Login
                </Link>
                <Link href="/signup" className="nav-link-button-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Open main menu"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Mobile Nav Link with Underline Hover Effect */}
          <Link href="/" className="mobile-nav-link group relative" onClick={() => setIsMobileMenuOpen(false)}>
            Home
            <span className="underline-span"></span>
          </Link>
          <Link href="/about" className="mobile-nav-link group relative" onClick={() => setIsMobileMenuOpen(false)}>
            About
            <span className="underline-span"></span>
          </Link>
          {user && (
            <Link href="/dashboard" className="mobile-nav-link group relative" onClick={() => setIsMobileMenuOpen(false)}>
              Dashboard
              <span className="underline-span"></span>
            </Link>
          )}
          <Link href="/contact" className="mobile-nav-link group relative" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
            <span className="underline-span"></span>
          </Link>
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200 mt-2">
              <div className="flex items-center px-5 mb-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-base">
                  {(user.displayName || user.email)?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.displayName || user.email}</div>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  href="/profile"
                  className="mobile-nav-link group relative"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your Profile
                  <span className="underline-span"></span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-150"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 space-y-1 border-t border-gray-200 mt-2">
              <Link
                href="/login"
                className="mobile-nav-link-button-secondary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="mobile-nav-link-button-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
