import React, { useState } from "react";
import { User, Bell, Lock, Globe } from "lucide-react";
import { styles } from "./styles/SettingsStyles";
import { commonStyles } from "./styles/commonStyles";

interface SettingSection {
  title: string;
  icon: any;
  settings: {
    name: string;
    description: string;
    type: "toggle" | "input" | "select";
    value?: any;
    options?: string[];
  }[];
}

const settingsSections: SettingSection[] = [
  {
    title: "Profile Settings",
    icon: User,
    settings: [
      {
        name: "Weight Goal",
        description: "Set your target weight",
        type: "input",
        value: "70 kg",
      },
      {
        name: "Daily Calorie Target",
        description: "Set your daily calorie goal",
        type: "input",
        value: "2200 kcal",
      },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
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
        name: "Progress Updates",
        description: "Weekly progress report notifications",
        type: "toggle",
        value: true,
      },
    ],
  },
  {
    title: "Privacy",
    icon: Lock,
    settings: [
      {
        name: "Profile Visibility",
        description: "Control who can see your profile",
        type: "select",
        value: "Private",
        options: ["Private", "Friends", "Public"],
      },
      {
        name: "Data Sharing",
        description: "Manage how your data is shared",
        type: "toggle",
        value: false,
      },
    ],
  },
  {
    title: "Preferences",
    icon: Globe,
    settings: [
      {
        name: "Language",
        description: "Choose your preferred language",
        type: "select",
        value: "English",
        options: ["English", "Spanish", "French", "German"],
      },
      {
        name: "Dark Mode",
        description: "Toggle dark mode theme",
        type: "toggle",
        value: false,
      },
      {
        name: "Sound Effects",
        description: "Enable sound effects",
        type: "toggle",
        value: true,
      },
    ],
  },
];

export default function Settings() {

  const [settingsList, setSettingsList] = useState(settingsSections);

//TODO: this is not very pretty. maybe the whole structure of the page should be changed
const handleToggle = (passedSetting: any) => {
  setSettingsList((prevSettingsList) =>
    prevSettingsList.map((section) => ({
      ...section,
      settings: section.settings.map((setting) =>
        setting.name === passedSetting.name
          ? { ...setting, value: !setting.value } // Toggle the value
          : setting
      ),
    }))
  );
};

  const renderSettingInput = (setting: any) => {
    switch (setting.type) {
      case "toggle":
        return (
          <div style={styles.toggle(setting.value)} onClick={() => handleToggle(setting)}>
            <div style={styles.toggleHandle(setting.value)} />
          </div>
        );
      case "input":
        return (
          <input
            type="text"
            value={setting.value}
            style={styles.input}
            onChange={() => {}}
          />
        );
      case "select":
        return (
          <select
            value={setting.value}
            style={styles.select}
            onChange={() => {}}
          >
            {setting.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div style={commonStyles.container}>
      <div style={styles.container}>
        <h1 style={styles.title}>Settings</h1>

        <div style={styles.settingsGrid}>
          {settingsList.map((section, index) => (
            <div key={index} style={styles.section}>
              <div style={styles.sectionHeader}>
                <section.icon style={styles.sectionIcon} />
                <h2 style={styles.sectionTitle}>{section.title}</h2>
              </div>

              <div style={styles.settingsList}>
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} style={styles.settingItem}>
                    <div style={styles.settingInfo}>
                      <h3 style={styles.settingName}>{setting.name}</h3>
                      <p style={styles.settingDescription}>
                        {setting.description}
                      </p>
                    </div>
                    {renderSettingInput(setting)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
