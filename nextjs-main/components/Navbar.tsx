'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/useLogout';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const { handleLogout, isLoading, error } = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogoutClick = async () => {
    await handleLogout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
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
      <nav className="bg-gray-900 text-white sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-700">
        <div className="flex items-center text-xl font-bold">Afzar Hydraulics</div>
        <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse"></div>
      </nav>
    );
  }

  // Check if a link is active
  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`bg-gray-900 text-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-xl' : 'shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-xl font-bold hover:text-blue-400 transition-colors duration-200">
              <span className="text-white">Afzar</span>
              <span className="text-blue-400 ml-1">Hydraulics</span>
            </Link>
          </div>

          {/* Primary Nav - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`relative px-3 py-2 text-sm font-medium group ${isActive('/') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            >
              Home
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 animate-underline"></span>
              )}
              {!isActive('/') && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              )}
            </Link>
            
            <Link 
              href="/about" 
              className={`relative px-3 py-2 text-sm font-medium group ${isActive('/about') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            >
              About
              {isActive('/about') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 animate-underline-dashed"></span>
              )}
              {!isActive('/about') && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              )}
            </Link>
            
            {user && (
              <Link 
                href="/dashboard" 
                className={`relative px-3 py-2 text-sm font-medium group ${isActive('/dashboard') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
              >
                Dashboard
                {isActive('/dashboard') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 animate-underline-dashed"></span>
                )}
                {!isActive('/dashboard') && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                )}
              </Link>
            )}
            
            <Link 
              href="/contact" 
              className={`relative px-3 py-2 text-sm font-medium group ${isActive('/contact') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            >
              Contact
              {isActive('/contact') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 animate-underline-dashed"></span>
              )}
              {!isActive('/contact') && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              )}
            </Link>
          </div>

          {/* Secondary Nav - Desktop & Auth/Profile Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative ml-3">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-800 hover:cursor-pointer"
                  id="user-menu"
                  aria-haspopup="true"
                  aria-expanded={isProfileMenuOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                    {(user.displayName || user.email)?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-300 hidden sm:block">
                    {user.displayName || user.email}
                  </span>
                  <svg 
                    className={`ml-1 h-5 w-5 text-gray-400 transform transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : 'rotate-0'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-gray-700 ring-opacity-5 focus:outline-none z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 hover:cursor-pointer"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={onLogoutClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 hover:cursor-pointer"
                    >
                      {isLoading?'Logging out...':'Log Out'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200 border border-gray-700 hover:border-blue-400 hover:cursor-pointer"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 border border-blue-600 hover:border-blue-700 hover:cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors duration-200"
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
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            href="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-blue-400 bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
            {isActive('/') && <span className="block h-0.5 mt-1 bg-blue-400 w-full animate-underline"></span>}
          </Link>
          
          <Link 
            href="/about" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/about') ? 'text-blue-400 bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
            {isActive('/about') && <span className="block h-0.5 mt-1 bg-blue-400 w-full animate-underline-dashed"></span>}
          </Link>
          
          {user && (
            <Link 
              href="/dashboard" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard') ? 'text-blue-400 bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
              {isActive('/dashboard') && <span className="block h-0.5 mt-1 bg-blue-400 w-full animate-underline-dashed"></span>}
            </Link>
          )}
          
          <Link 
            href="/contact" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact') ? 'text-blue-400 bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
            {isActive('/contact') && <span className="block h-0.5 mt-1 bg-blue-400 w-full animate-underline-dashed"></span>}
          </Link>
          
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-base">
                  {(user.displayName || user.email)?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user.displayName || user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <button
                  onClick={onLogoutClick}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  {isLoading ? 'Logging out...' : 'Log Out'}
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="space-y-1">
                <Link
                  href="/login"
                  className="block w-full px-4 py-2 text-center rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block w-full px-4 py-2 text-center rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;