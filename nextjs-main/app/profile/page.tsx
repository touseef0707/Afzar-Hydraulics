'use client'; // Enables React Client Component behavior in Next.js

// Import necessary hooks and libraries
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
  AuthError
} from 'firebase/auth';

import { useAuth } from '@/context/AuthContext'; // Custom auth context
import { useProjects } from '@/context/ProjectContext'; // Custom projects context
import ProtectedRoute from '@/components/ProtectedRoute'; // Wrapper to protect route access
import ProfileInfo from '@/app/profile/_components/ProfileInfo'; // Component to show profile info
import SettingsPanel from '@/app/profile/_components/SettingsPanel'; // Component to manage settings
import ProjectsPanel from '@/app/profile/_components/ProjectsPanel'; // Component to show projects
import { useLogout } from '@/hooks/useLogout'; // Custom logout hook

export default function ProfilePage() {
  // Get user and loading state from auth context
  const { user, loading: authLoading } = useAuth();
  
  // Logout-related state and logic
  const { handleLogout, isLoading, error } = useLogout();
  
  // Get projects from context
  const { 
    projects: contextProjects, 
    loading: projectsLoading, 
    error: projectsError 
  } = useProjects();

  const router = useRouter();

  // Manage which tab is active: profile, settings, or projects
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'projects'>('profile');

  // States for password update fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // States for updating the username/display name
  const [username, setUsername] = useState(user?.displayName || '');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  // When user data updates, sync the username field
  useEffect(() => {
    if (user) {
      setUsername(user.displayName || '');
    }
  }, [user]);

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Handle input change for username
  const handleUsernameInputChange = (value: string) => {
    setUsername(value);
    setUsernameError('');
    setUsernameSuccess('');
  };

  // Submit updated username
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

    setIsUpdatingUsername(true);
    setUsernameError('');
    setUsernameSuccess('');

    try {
      await updateProfile(user, { displayName: username.trim() }); // Firebase update
      setUsernameSuccess("Username updated successfully!");
    } catch (err) {
      const error = err as AuthError;
      console.error("Error updating username:", error);
      setUsernameError(`Failed to update username: ${error.message || 'An unknown error occurred.'}`);
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  // Submit new password update
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validations
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

    if (!user || !user.email) {
      setPasswordError("User not authenticated or email missing.");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      let errorMessage = 'Failed to change password. Please try again.';

      // Handle known Firebase error codes
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
          errorMessage = error.message || errorMessage;
      }
      setPasswordError(errorMessage);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Format project data for ProjectsPanel component
  const formattedProjects = contextProjects.map(project => ({
    id: project.id,
    title: project.name,
    description: project.description,
    lastModified: project.lastModified,
    status: project.status,
    type: project.type,
    createdAt: new Date(project.lastModified).getTime()
  }));

  // Show loading spinner if auth or project data is loading
  if (authLoading || projectsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Return nothing if user is still undefined
  if (!user) {
    return null;
  }

  // Main component return (when user is authenticated)
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            
            {/* Profile header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-4xl font-bold mb-4 sm:mb-0 sm:mr-6">
                  {user.email?.charAt(0).toUpperCase()} {/* Avatar letter */}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.displayName || user.email}</h1>
                  {user.displayName && <p className="text-blue-100 text-sm">Email: {user.email}</p>}
                  <p className="text-blue-100 mt-2">
                    Member since: {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 text-center border-b-2 font-medium hover:cursor-pointer text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-6 text-center border-b-2 font-medium hover:cursor-pointer text-sm ${
                    activeTab === 'settings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Settings
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`py-4 px-6 text-center border-b-2 font-medium hover:cursor-pointer text-sm ${
                    activeTab === 'projects'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Projects
                </button>
              </nav>
            </div>

            {/* Render content based on active tab */}
            <div className="p-6">
              {activeTab === 'profile' && <ProfileInfo user={user} />}
              {activeTab === 'settings' && (
                <SettingsPanel
                  user={user}
                  username={username}
                  usernameError={usernameError}
                  usernameSuccess={usernameSuccess}
                  isUpdatingUsername={isUpdatingUsername}
                  onUsernameChange={handleUsernameChange}
                  onUsernameInputChange={handleUsernameInputChange}
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
                  onLogout={handleLogout}
                />
              )}
              {activeTab === 'projects' && (
                <ProjectsPanel 
                  projects={formattedProjects}
                  loading={projectsLoading}
                  error={projectsError || ''}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
