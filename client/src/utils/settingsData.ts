import { SettingSection } from "../types/settings";

// Define default settings
export const initialSettings: SettingSection[] = [
  {
    title: "Profile Settings",
    icon: null, // Will be provided in the component
    settings: [
      {
        name: "Profile Picture",
        description: "Upload your profile picture",
        type: "upload",
        value: "",
      },
      {
        name: "Name",
        description: "",
        type: "input",
        value: "John Doe",
      },
      {
        name: "Email",
        description: "",
        type: "input",
        value: "johndoe@example.com",
      },
    ],
  },
  {
    title: "Notifications",
    icon: null, // Will be provided in the component
    settings: [
      {
        name: "Meal Reminders",
        description: "Get notified when it's time for your meals",
        type: "toggle",
        value: true,
      },
      {
        name: "Exercise Reminders",
        description: "Get notified about your scheduled workouts",
        type: "toggle",
        value: true,
      },
      {
        name: "Water Intake Reminder",
        description: "Stay hydrated with water intake reminders",
        type: "toggle",
        value: true,
      },
    ],
  },
];