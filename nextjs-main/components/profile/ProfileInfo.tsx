'use client';
import { ProfileTabProps } from './types';

export default function ProfileInfo({ user }: ProfileTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Account Created</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(user?.metadata.creationTime).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Last Login</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(user?.metadata.lastSignInTime).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}