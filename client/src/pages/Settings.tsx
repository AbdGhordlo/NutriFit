import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Bell, 
  Lock, 
  UserCog, 
  Trash2, 
  LogOut,
  Save,
  Shield,
  X
} from "lucide-react";
import { ClipLoader } from "react-spinners";
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

// Define user profile interface
interface UserProfile {
  fullName: string;
  email: string;
  photoUrl?: string;
}

// Define password form interface
interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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
  const [loading, setLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "John Doe",
    email: "johndoe@example.com",
    photoUrl: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");
  
  const navigate = useNavigate();
  
  // Fetch settings data on component mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      const userId = 1; // Replace with the logged-in user's ID
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }
      
      try {
        // Simulate API call - would be replaced with actual fetch in production
        setTimeout(() => {
          // Set user profile data
          setProfile({
            fullName: "John Doe",
            email: "johndoe@example.com",
            photoUrl: ""
          });
          
          // Check if user has completed personalization
          setPersonalizationCompleted(true);
          
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Error fetching settings:", error);
        setLoading(false);
      }
    };
    
    fetchUserSettings();
  }, []);
  
  const userHasPersonalized = personalizationCompleted;

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
    const userId = 1; // Replace with actual user ID
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("No token found, redirecting to login...");
      window.location.href = "/login";
      return;
    }
    
    // Simulate API request timing
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
    setPasswordError('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    // TODO: Implement actual password change logic here
    console.log('Changing password...');
    setIsPasswordModalOpen(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
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

  // Password Change Modal
  const PasswordChangeModal = () => (
    <div style={isPasswordModalOpen ? styles.modalOverlay : styles.modalHidden}>
      <div style={styles.modalContainer}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Change Password</h2>
          <button
            onClick={() => setIsPasswordModalOpen(false)}
            style={styles.closeButton}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>
        <form onSubmit={handlePasswordSubmit} style={styles.modalForm}>
          <div>
            <label style={styles.inputLabel}>
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              style={styles.wideInput}
              required
            />
          </div>
          <div>
            <label style={styles.inputLabel}>
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              style={styles.wideInput}
              required
            />
          </div>
          <div>
            <label style={styles.inputLabel}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              style={styles.wideInput}
              required
            />
          </div>
          {passwordError && (
            <p style={styles.errorMessage}>{passwordError}</p>
          )}
          <div style={styles.modalFooter}>
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Show loading spinner
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <ClipLoader color="#7ec987" size={50} />
      </div>
    );
  }

  return (
    <div className="outer-container">
      <div style={styles.container}>
        <h1 style={styles.title}>Settings</h1>

        <div style={styles.settingsGrid}>
          {/* Profile Settings Container */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <User style={styles.sectionIcon} />
              <h2 style={styles.sectionTitle}>Profile Settings</h2>
            </div>

            <div style={styles.profileContainer}>
              {/* Profile Photo */}
              <div style={styles.profilePhotoSection}>
                <div style={styles.profilePicture}>
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt="Profile"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <User size={40} color="#6b7280" />
                  )}
                </div>
                <button style={styles.changePhotoButton}>
                  Change Photo
                </button>
              </div>

              {/* Profile Inputs */}
              <div style={styles.profileInputsGrid}>
                <div>
                  <label style={styles.inputLabel}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    style={styles.wideInput}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label style={styles.inputLabel}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    style={styles.wideInput}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings Container */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <Bell style={styles.sectionIcon} />
              <h2 style={styles.sectionTitle}>Notifications</h2>
            </div>

            <div style={styles.settingsList}>
              {settingsList[1].settings.map((setting, settingIndex) => (
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

          {/* Account Management Container */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <Shield style={styles.sectionIcon} />
              <h2 style={styles.sectionTitle}>Account Management</h2>
            </div>

            <div style={styles.accountManagementList}>
              {/* Change Password Option */}
              <div 
                onClick={() => setIsPasswordModalOpen(true)}
                style={styles.accountOption}
              >
                <div style={styles.optionIconContainer}>
                  <UserCog size={20} color="#6b7280" />
                  <div>
                    <p style={styles.optionText}>Change Password</p>
                    <p style={styles.optionDescription}>Update your account password</p>
                  </div>
                </div>
                <Lock size={20} color="#6b7280" />
              </div>

              {/* Delete Account Option */}
              <div style={styles.dangerOption}>
                <div style={styles.optionIconContainer}>
                  <Trash2 size={20} color="#ef4444" />
                  <div>
                    <p style={styles.dangerText}>Delete Account</p>
                    <p style={styles.dangerDescription}>Permanently delete your account</p>
                  </div>
                </div>
                <Trash2 size={20} color="#ef4444" />
              </div>

              {/* Sign Out Option */}
              <div style={styles.accountOption}>
                <div style={styles.optionIconContainer}>
                  <LogOut size={20} color="#6b7280" />
                  <div>
                    <p style={styles.optionText}>Sign Out</p>
                    <p style={styles.optionDescription}>Log out of your account</p>
                  </div>
                </div>
                <LogOut size={20} color="#6b7280" />
              </div>
            </div>
          </div>

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

      {/* Password Change Modal */}
      <PasswordChangeModal />
    </div>
  );
}
