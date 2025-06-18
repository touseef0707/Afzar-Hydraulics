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
    user: any;
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
    user: any;
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
  export interface ProjectsPanelProps {
    projects?: HydraulicProject[];
  }