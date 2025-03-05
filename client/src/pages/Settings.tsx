import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, Lock, Globe } from "lucide-react";
import { styles } from "./styles/SettingsStyles";
import "../assets/commonStyles.css";

interface SettingSection {
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

const settingsSections: SettingSection[] = [
  {
    title: "Profile Settings",
    icon: User,
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
      {
        name: "Password",
        description: "",
        type: "password",
        value: "",
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
      {
        name: "Water Intake Reminder",
        description: "Stay hydrated with water intake reminders",
        type: "toggle",
        value: true,
      },
    ],
  },
];

export default function Settings() {
  const [settingsList, setSettingsList] = useState(settingsSections);
  const [personalizationCompleted, setPersonalizationCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();
  const userHasPersonalized = true; // Replace this with actual logic

  const handleToggle = (passedSetting: any) => {
    setSettingsList((prevSettingsList) =>
      prevSettingsList.map((section) => ({
        ...section,
        settings: section.settings.map((setting) =>
          setting.name === passedSetting.name
            ? { ...setting, value: !setting.value }
            : setting
        ),
      }))
    );
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  const renderSettingInput = (setting: any) => {
    switch (setting.type) {
      case "toggle":
        return (
          <div
            style={styles.toggle(setting.value)}
            onClick={() => handleToggle(setting)}
          >
            <div style={styles.toggleHandle(setting.value)} />
          </div>
        );
      case "input":
        return (
          <input
            type="text"
            value={setting.value}
            style={styles.wideInput}
            onChange={(e) => {
              const updatedValue = e.target.value;
              setSettingsList((prevSettingsList) =>
                prevSettingsList.map((section) => ({
                  ...section,
                  settings: section.settings.map((s) =>
                    s.name === setting.name ? { ...s, value: updatedValue } : s
                  ),
                }))
              );
            }}
          />
        );
      case "password":
        return (
          <input
            type="password"
            placeholder="******"
            style={styles.wideInput}
            onChange={() => {}}
          />
        );
      case "select":
        return (
          <select value={setting.value} style={styles.select} onChange={() => {}}>
            {setting.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "upload":
        return (
          <div style={styles.profileUploadContainer}>
            <div style={styles.profilePicture}>
              <User size={40} color="#6b7280" />
            </div>
            <button style={styles.changePhotoButton}>Change Photo</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="outer-container">
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

          {/* Personalization Section */}
          <div
            style={{
              backgroundColor: userHasPersonalized ? "#cce8cf" : "#ffcccc",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "black",
            }}
          >
            <p>
              {userHasPersonalized
                ? "Change your personalization"
                : "Set up your personalization for personalized plans"}
            </p>
            <button
              style={{
                backgroundColor: "black",
                color: userHasPersonalized ? "#e5f4e7" : "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/personalization")}
            >
              Personalize
            </button>
          </div>
          
          {/* Save Button Section */}
          <div style={styles.saveButtonContainer}>
            {saveSuccess && (
              <div style={styles.successMessage}>
                Settings saved successfully!
              </div>
            )}
            <button 
              style={styles.saveButton}
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
