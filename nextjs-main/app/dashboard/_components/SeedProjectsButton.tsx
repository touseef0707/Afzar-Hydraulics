// components/SeedProjectsButton.tsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { seedProjects, checkProjectsExist } from '@/utils/seedProjects';

interface SeedProjectsButtonProps {
  className?: string;
}

const SeedProjectsButton: React.FC<SeedProjectsButtonProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { user } = useAuth();

  const handleSeedProjects = async () => {
    if (!user) {
      setMessage({ text: 'You must be logged in to seed projects', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Check if projects already exist
      const projectsExist = await checkProjectsExist();
      
      if (projectsExist) {
        setMessage({ 
          text: 'Projects already exist in the database. Seeding would overwrite them.', 
          type: 'info' 
        });
        setIsLoading(false);
        return;
      }

      // Seed projects
      const success = await seedProjects(user.uid);
      
      if (success) {
        setMessage({ text: 'Projects seeded successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to seed projects', type: 'error' });
      }
    } catch (error) {
      console.error('Error in seed process:', error);
      setMessage({ text: 'An error occurred while seeding projects', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Message styling based on type
  const getMessageStyle = () => {
    switch (message?.type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-700';
      default:
        return '';
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleSeedProjects}
        disabled={isLoading}
        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors duration-200 disabled:bg-purple-400"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Seeding...
          </>
        ) : (
          <>Seed Test Projects</>
        )}
      </button>

      {message && (
        <div className={`mt-3 p-2 border rounded-md text-sm ${getMessageStyle()}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default SeedProjectsButton;