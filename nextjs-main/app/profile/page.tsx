'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  // NEW: Import updateProfile for username changes
  updateProfile,
  AuthError // Ensure AuthError is imported
} from 'firebase/auth';
import { auth } from '@/firebase/clientApp'; 
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute'; 
import ProfileInfo from '@/app/profile/_components/ProfileInfo';  
import SettingsPanel from '@/app/profile/_components/SettingsPanel'; 


export default function ProfilePage() {
  // Use the global authentication context instead of local state and listener
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  // Password-related states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Username-related states (initialized based on user from context)
  const [username, setUsername] = useState(user?.displayName || '');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  // Effect to update username state when the user object from context changes
  useEffect(() => {
    if (user) {
      setUsername(user.displayName || '');
    }
  }, [user]);

  // Redirect to login if not authenticated after loading is complete
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Handler for username input changes
  const handleUsernameInputChange = (value: string) => {
    setUsername(value);
    setUsernameError(''); // Clear error when input changes
    setUsernameSuccess(''); // Clear success when input changes
  };

  // Handler for username update submission
  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setUsernameError("You must be logged in to change your username.");
      return;
    }
    if (!username.trim()) {
      setUsernameError("Username cannot be empty.");
      return;
    }
    // Add more validation if needed (e.g., length, characters)

    setIsUpdatingUsername(true);
    setUsernameError('');
    setUsernameSuccess('');

    try {
      // Use Firebase's updateProfile to change displayName
      await updateProfile(user, { displayName: username.trim() });
      setUsernameSuccess("Username updated successfully!");
    } catch (err) {
      const error = err as AuthError;
      console.error("Error updating username:", error);
      // More specific error handling could be added here
      setUsernameError(`Failed to update username: ${error.message || 'An unknown error occurred.'}`);
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (!user || !user.email) { // Ensure user and email are present for reauthentication
      setPasswordError("User not authenticated or email missing.");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      let errorMessage = 'Failed to change password. Please try again.';
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Current password is incorrect';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'This operation requires recent authentication. Please log out and log in again.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        default:
          errorMessage = error.message || errorMessage; // Catch other Firebase errors
      }
      setPasswordError(errorMessage);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Display a loading indicator while auth context is determining user status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not loading and no user, ProtectedRoute will handle the redirect, or
  // the useEffect above will redirect. This ensures nothing renders if not authenticated.
  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-4xl font-bold mb-4 sm:mb-0 sm:mr-6">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  {/* Display user's displayName (username) if available, otherwise email */}
                  <h1 className="text-2xl font-bold">{user.displayName || user.email}</h1>
                  {user.displayName && <p className="text-blue-100 text-sm">Email: {user.email}</p>}
                  <p className="text-blue-100 mt-2">
                    Member since: {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'settings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'profile' && <ProfileInfo user={user} />}
              {activeTab === 'settings' && (
                <SettingsPanel
                  user={user}
                  // Username update props
                  username={username}
                  usernameError={usernameError}
                  usernameSuccess={usernameSuccess}
                  isUpdatingUsername={isUpdatingUsername}
                  onUsernameChange={handleUsernameChange}
                  onUsernameInputChange={handleUsernameInputChange}
                  // Password update props
                  currentPassword={currentPassword}
                  newPassword={newPassword}
                  confirmPassword={confirmPassword}
                  passwordError={passwordError}
                  passwordSuccess={passwordSuccess}
                  isUpdatingPassword={isUpdatingPassword}
                  onPasswordChange={handlePasswordChange}
                  onCurrentPasswordChange={setCurrentPassword}
                  onNewPasswordChange={setNewPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                  // Other actions
                  onLogout={handleLogout}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
