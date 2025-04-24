export interface SettingSection {
  title: string;
  icon: any;
  settings: {
    name: string;
    description: string;
    type: "toggle" | "input" | "select" | "upload" | "password";
    value?: any;
    options?: string[];
  }[];
}

// Define user profile interface
export interface UserProfile {
  fullName: string;
  email: string;
  photoUrl?: string;
}

// Define password form interface
export interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Define notification settings interface
export interface NotificationSettings {
  mealReminders: boolean;
  exerciseReminders: boolean;
  progressUpdates: boolean;
  waterIntakeReminder: boolean;
}

// Define API response interface
export interface SettingsResponse {
  profile: {
    fullName: string;
    email: string;
    photoUrl?: string;
  };
  notifications: NotificationSettings;
  personalizationCompleted: boolean;
}