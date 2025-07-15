'use client'; // Ensures this is a client-side component in Next.js

// Import necessary hooks and Firebase modules
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createUserWithEmailAndPassword, // Firebase function to create a user
  signInWithPopup,                // Firebase function to handle Google sign-in
  updateProfile,                  // Updates user's display name
  AuthError,                      // Type for handling Firebase auth errors
  UserCredential                  // Type returned by createUserWithEmailAndPassword
} from 'firebase/auth';

import { ref, set } from 'firebase/database'; // Firebase Realtime Database functions
import { auth, googleProvider, database } from '@/firebase/clientApp'; // Firebase config
import Link from 'next/link'; // Next.js routing component

const SignUpPage = () => {
  // Define state for form fields and UI status
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  // Handle form submission for email/password registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate password match
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    // Ensure username is entered
    if (!username.trim()) {
      return setError('Username is required');
    }

    try {
      setError('');
      setLoading(true);

      // 1. Create user using Firebase Authentication
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update Firebase Auth profile with username
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: username
        });
        console.log(`[Auth] Profile updated for ${userCredential.user.email} with username: ${username}`);
        
        // 3. Save user details in Firebase Realtime Database
        const userRef = ref(database, `users/${userCredential.user.uid}`);
        await set(userRef, {
          username: username,
          email: userCredential.user.email,
          createdAt: new Date().toISOString(),
          projects: {} // Empty projects initially
        });
        console.log(`[Database] User data stored for ${userCredential.user.uid}`);
      }

      // 4. Redirect to homepage after successful registration
      router.push('/');
    } catch (err) {
      const error = err as AuthError;
      console.error("[Auth] Error during manual sign-up:", error);
      setError(getAuthErrorMessage(error.code)); // Show readable error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle sign-up using Google OAuth
  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setGoogleLoading(true);

      // Sign in using Google popup
      const result = await signInWithPopup(auth, googleProvider);
      console.log(`[Auth] Google sign-in successful for:`, result.user.displayName);

      // Save user details in Firebase Realtime Database
      const userRef = ref(database, `users/${result.user.uid}`);
      await set(userRef, {
        username: result.user.displayName || 'Google User',
        email: result.user.email,
        createdAt: new Date().toISOString(),
        projects: {}
      });
      console.log(`[Database] User data stored for ${result.user.uid}`);

      // Redirect to homepage
      router.push('/');
    } catch (err) {
      const error = err as AuthError;
      console.error('[Auth] Google sign-in error:', error);
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setGoogleLoading(false); // Reset loading state
    }
  };

  // Convert Firebase auth error codes into human-readable messages
  const getAuthErrorMessage = (code: string): string => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  // JSX return for UI rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
              <p className="mt-2 text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Display error message if present */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {/* You can insert a Google icon SVG here */}
              <span>Continue with Google</span>
            </button>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-gray-500">or</span>
              </div>
            </div>

            {/* Registration Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="e.g., john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>

          {/* You can optionally add a footer with terms and privacy links here */}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; // Export the component as default
