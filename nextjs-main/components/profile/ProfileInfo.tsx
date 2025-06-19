'use client';

import { ProfileTabProps } from './types'; 

export default function ProfileInfo({ user }: ProfileTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
        <div className="space-y-4">
          {/* NEW: Display Username */}
          {user?.displayName && ( // Only show if displayName exists
            <div>
              <label className="block text-sm font-medium text-gray-500">Username</label>
              <p className="mt-1 text-sm text-gray-900">{user.displayName}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Account Created</label>
            <p className="mt-1 text-sm text-gray-900">
              {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Last Login</label>
            <p className="mt-1 text-sm text-gray-900">
              {user?.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
