// types.ts
import { User } from 'firebase/auth'; // Make sure this import is present

export interface HydraulicProject {
    id: string;
    name: string;
    description: string;
    status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
    startDate: string;
    endDate?: string;
    client: string;
    systemType: string;
}

export interface ProfileTabProps {
    user: User | null;
    projects?: HydraulicProject[];
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    passwordError?: string;
    passwordSuccess?: string;
    isUpdatingPassword?: boolean;
    onPasswordChange?: (e: React.FormEvent) => void;
    onCurrentPasswordChange?: (value: string) => void;
    onNewPasswordChange?: (value: string) => void;
    onConfirmPasswordChange?: (value: string) => void;
    onLogout?: () => void;
}

export interface SettingsPanelProps {
    user: User | null; // This is crucial for pre-populating the username input
    // Password related props
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    passwordError?: string;
    passwordSuccess?: string;
    isUpdatingPassword?: boolean;
    onPasswordChange?: (e: React.FormEvent) => void;
    onCurrentPasswordChange?: (value: string) => void;
    onNewPasswordChange?: (value: string) => void;
    onConfirmPasswordChange?: (value: string) => void;

    // NEW: Username related props
    username?: string; // The current value of the username input field
    usernameError?: string; // Error message for username update
    usernameSuccess?: string; // Success message for username update
    isUpdatingUsername?: boolean; // Loading state for username update button
    onUsernameChange?: (e: React.FormEvent) => void; // Form submit handler for username
    onUsernameInputChange?: (value: string) => void; // Input change handler for username

    // Logout related props
    onLogout?: () => void;
}

export interface ProjectsPanelProps {
    projects?: HydraulicProject[];
}
