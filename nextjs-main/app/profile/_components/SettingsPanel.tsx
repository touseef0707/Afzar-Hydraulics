'use client';
import { SettingsPanelProps } from './types'; // Ensure this path is correct

export default function SettingsPanel({
  user, // Added user prop for initial username display
  currentPassword = '',
  newPassword = '',
  confirmPassword = '',
  passwordError = '',
  passwordSuccess = '',
  isUpdatingPassword = false,
  onPasswordChange,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,

  // NEW: Destructure username props
  username = '', // Default value for username
  usernameError = '',
  usernameSuccess = '',
  isUpdatingUsername = false,
  onUsernameChange,
  onUsernameInputChange,

  onLogout
}: SettingsPanelProps) {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>

      {/* NEW: Change Username Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Username</h3>
        <form onSubmit={onUsernameChange} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => onUsernameInputChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isUpdatingUsername}
              placeholder="Your new username"
            />
          </div>

          {usernameError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
              {usernameError}
            </div>
          )}

          {usernameSuccess && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
              {usernameSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={isUpdatingUsername}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isUpdatingUsername ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isUpdatingUsername ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Username'
            )}
          </button>
        </form>
      </div>


      {/* Change Password Section (existing) */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200"> {/* Added consistent styling */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
        <form onSubmit={onPasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => onCurrentPasswordChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isUpdatingPassword}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => onNewPasswordChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
              disabled={isUpdatingPassword}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
              disabled={isUpdatingPassword}
            />
          </div>

          {passwordError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
              {passwordSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isUpdatingPassword ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isUpdatingPassword ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-8"> {/* Added mt-8 for spacing */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
        <button
          onClick={onLogout}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
