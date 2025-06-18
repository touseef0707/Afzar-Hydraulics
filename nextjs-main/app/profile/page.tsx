'use client';
import { auth } from '@/firebase/clientApp';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User
} from 'firebase/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileInfo from '@/components/profile/ProfileInfo';
import ProjectsList from '@/components/profile/ProjectsList';
import SettingsPanel from '@/components/profile/SettingsPanel';
import { HydraulicProject } from '@/components/profile/types';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<HydraulicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'settings'>('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        await fetchUserProjects(currentUser.uid);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserProjects = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const demoProjects: HydraulicProject[] = [
        {
          id: '1',
          name: 'Industrial Press System',
          description: '500-ton hydraulic press installation for metal forming',
          status: 'Completed',
          startDate: '2023-01-15',
          endDate: '2023-05-20',
          client: 'ABC Manufacturing',
          systemType: 'Hydraulic Press'
        },
        {
          id: '2',
          name: 'Mobile Hydraulic Crane',
          description: 'Maintenance and overhaul of crane hydraulic systems',
          status: 'In Progress',
          startDate: '2023-06-10',
          client: 'XYZ Construction',
          systemType: 'Mobile Hydraulics'
        }
      ];
      setProjects(demoProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
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
      setPasswordError("User not authenticated");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      // Create credentials for reauthentication
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Reauthenticate user
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      // Clear form and show success
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // or redirect to login
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
                  <h1 className="text-2xl font-bold">{user.email}</h1>
                  <p className="text-blue-100 mt-2">
                    Member since: {new Date(user.metadata.creationTime!).toLocaleDateString()}
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
                  onClick={() => setActiveTab('projects')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'projects'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Projects ({projects.length})
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
              {activeTab === 'projects' && <ProjectsList projects={projects} />}
              {activeTab === 'settings' && (    
                <SettingsPanel
                  user={user}
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
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}