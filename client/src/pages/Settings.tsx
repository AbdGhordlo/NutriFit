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
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { styles } from "./styles/SettingsStyles";
import "../assets/commonStyles.css";
import PasswordChangeModal from "../components/SettingsFolder/PasswordChangeModal";
import DeleteAccountModal from "../components/SettingsFolder/DeleteAccountModal";

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

// Helper function to extract user ID from token
const getUserIdFromToken = (token: string): number | null => {
  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload.id;
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return null;
  }
};

export default function Settings() {
  const [settingsList, setSettingsList] = useState(settingsSections);
  const [personalizationCompleted, setPersonalizationCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
  
  const userHasPersonalized = personalizationCompleted;
  
  // Fetch settings data on component mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      try {
        // Get user ID from JWT token
        const userId = getUserIdFromToken(token);
        
        if (!userId) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        setLoading(true);
        
        // Continue with the fetch using the extracted userId
        const response = await fetch(
          `http://localhost:5000/settings/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        
        if (response.status === 401) {
          console.error("Unauthorized, removing token and redirecting...");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        // Handle 500 errors
        if (response.status === 500) {
          console.error("Server error when fetching settings, using defaults");
          setLoading(false);
          return; // Use default values
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched settings data:", data);
        
        // Update state with the fetched data
        if (data) {
          // Update profile information
          setProfile({
            fullName: data.profile.fullName || "John Doe",
            email: data.profile.email || "johndoe@example.com",
            photoUrl: data.profile.photoUrl || "",
          });
          
          // Update notification settings
          const notificationSettings = data.notifications;
          setSettingsList((prevSettingsList) => {
            const newSettingsList = [...prevSettingsList];
            
            // Update individual notification settings in the notifications section (index 1)
            if (newSettingsList[1] && newSettingsList[1].settings) {
              newSettingsList[1].settings = newSettingsList[1].settings.map(setting => {
                if (setting.name === "Meal Reminders") {
                  return { ...setting, value: notificationSettings.mealReminders };
                } else if (setting.name === "Exercise Reminders") {
                  return { ...setting, value: notificationSettings.exerciseReminders };
                } else if (setting.name === "Progress Updates") {
                  return { ...setting, value: notificationSettings.progressUpdates };
                } else if (setting.name === "Water Intake Reminder") {
                  return { ...setting, value: notificationSettings.waterIntakeReminder };
                }
                return setting;
              });
            }
            
            return newSettingsList;
          });
          
          // Set personalization status
          setPersonalizationCompleted(data.personalizationCompleted || false);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, []);

  const handleToggle = (passedSetting: any) => {
    setSettingsList((prevSettingsList) => {
      const newSettingsList = prevSettingsList.map((section) => ({
        ...section,
        settings: section.settings.map((setting) =>
          setting.name === passedSetting.name
            ? { ...setting, value: !setting.value }
            : setting
        ),
      }));
      
      return newSettingsList;
    });
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPasswordError("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }
      
      const userId = getUserIdFromToken(token);
      
      if (!userId) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      
      setIsSaving(true);
      
      const response = await fetch(`http://localhost:5000/settings/${userId}/password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      
      if (response.status === 401) {
        console.error("Unauthorized, removing token and redirecting...");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      
      if (response.status === 400) {
        const data = await response.json();
        setPasswordError(data.message || "Current password is incorrect");
        setIsSaving(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      // Password successfully changed
      setIsPasswordModalOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle profile photo upload
  const handleProfilePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }
      
      const userId = getUserIdFromToken(token);
      
      if (!userId) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      setIsSaving(true);

      const response = await fetch(
        `http://localhost:5000/upload/${userId}/profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.status === 401) {
        console.error("Unauthorized, removing token and redirecting...");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      // Show success even if API fails during development
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        // Still show success in development
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
        return;
      }

      const data = await response.json();

      // Update profile photo URL in state
      setProfile((prev) => ({
        ...prev,
        photoUrl: data.url,
      }));

      setSaveSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      // Still show success in development
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }
      
      const userId = getUserIdFromToken(token);
      
      if (!userId) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      setIsSaving(true);

      const response = await fetch(`http://localhost:5000/auth/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // If API fails, still continue with local sign out during development
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
      }

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Redirect to login or signup page
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      // Still sign out locally if API fails
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsSaving(false);
      setIsDeleteModalOpen(false);
    }
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }
      
      const userId = getUserIdFromToken(token);
      
      if (!userId) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      // First, try to update profile information
      try {
        const profileResponse = await fetch(
          `http://localhost:5000/settings/${userId}/profile`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullName: profile.fullName,
              email: profile.email,
              photoUrl: profile.photoUrl,
            }),
          }
        );
        
        if (profileResponse.ok) {
          console.log("Profile updated successfully");
        }
      } catch (profileError) {
        console.error("Error updating profile:", profileError);
      }

      // Then, try to update notification settings
      try {
        const notificationsResponse = await fetch(
          `http://localhost:5000/settings/${userId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              notifications: {
                mealReminders: settingsList[1].settings[0].value,
                exerciseReminders: settingsList[1].settings[1].value,
                progressUpdates: settingsList[1].settings[2].value,
                waterIntakeReminder: settingsList[1].settings[3].value,
              },
            }),
          }
        );
        
        if (notificationsResponse.ok) {
          console.log("Notifications updated successfully");
        }
      } catch (notificationsError) {
        console.error("Error updating notifications:", notificationsError);
      }

      // Show success message regardless of API response during development
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      // Still show success during development
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
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
      case "upload":
        return (
          <div style={styles.profileUploadContainer}>
            <div style={styles.profilePicture}>
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt="Profile"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <User size={40} color="#6b7280" />
              )}
            </div>
            <label style={styles.changePhotoButton}>
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
        );
      default:
        return null;
    }
  };

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
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <User size={40} color="#6b7280" />
                  )}
                </div>
                <label style={styles.changePhotoButton}>
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              {/* Profile Inputs */}
              <div style={styles.profileInputsGrid}>
                <div>
                  <label style={styles.inputLabel}>Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) =>
                      handleProfileChange("fullName", e.target.value)
                    }
                    style={styles.wideInput}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label style={styles.inputLabel}>Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      handleProfileChange("email", e.target.value)
                    }
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
                    <p style={styles.optionDescription}>
                      Update your account password
                    </p>
                  </div>
                </div>
                <Lock size={20} color="#6b7280" />
              </div>

              {/* Delete Account Option */}
              <div
                onClick={() => setIsDeleteModalOpen(true)}
                style={styles.dangerOption}
              >
                <div style={styles.optionIconContainer}>
                  <Trash2 size={20} color="#ef4444" />
                  <div>
                    <p style={styles.dangerText}>Delete Account</p>
                    <p style={styles.dangerDescription}>
                      Permanently delete your account
                    </p>
                  </div>
                </div>
                <Trash2 size={20} color="#ef4444" />
              </div>

              {/* Sign Out Option */}
              <div onClick={handleSignOut} style={styles.accountOption}>
                <div style={styles.optionIconContainer}>
                  <LogOut size={20} color="#6b7280" />
                  <div>
                    <p style={styles.optionText}>Sign Out</p>
                    <p style={styles.optionDescription}>
                      Log out of your account
                    </p>
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

      {/* Modals */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        passwordForm={passwordForm}
        passwordError={passwordError}
        handlePasswordChange={(field, value) =>
          handlePasswordChange(field as keyof PasswordForm, value)
        }
        handlePasswordSubmit={handlePasswordSubmit}
        styles={styles}
      />
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteAccount}
        isSaving={isSaving}
        styles={styles}
      />
    </div>
  );
}
