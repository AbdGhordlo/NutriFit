import React from "react";
import { Bell } from "lucide-react";

interface SettingItem {
  name: string;
  description: string;
  type: "toggle" | "input" | "select" | "upload" | "password";
  value?: any;
  options?: string[];
}

interface NotificationSectionProps {
  settings: SettingItem[];
  handleToggle: (setting: SettingItem) => void;
  styles: any; // You might want to type this properly
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
  settings,
  handleToggle,
  styles,
}) => {
  const renderSettingInput = (setting: SettingItem) => {
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
      default:
        return null;
    }
  };

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <Bell style={styles.sectionIcon} />
        <h2 style={styles.sectionTitle}>Notifications</h2>
      </div>

      <div style={styles.settingsList}>
        {settings.map((setting, settingIndex) => (
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
  );
};

export default NotificationSection;