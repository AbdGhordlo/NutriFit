import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { styles } from "./styles/SettingsStyles";
import "../assets/commonStyles.css";

// Components
import ProfileSection from "../components/SettingsComponents/ProfileSection";
import NotificationSection from "../components/SettingsComponents/NotificationSection";
import AccountManagementSection from "../components/SettingsComponents/AccountManagementSection";
import PasswordChangeModal from "../components/SettingsComponents/PasswordChangeModal";
import DeleteAccountModal from "../components/SettingsComponents/DeleteAccountModal";
import PersonalizationSection from "../components/SettingsComponents/PersonalizationSection";
import SaveSettingsButton from "../components/SettingsComponents/SaveSettingsButton";

// Services & Hooks
import { useAuth } from "../utils/useAuth";
import * as settingsService from "../services/settingsService";
import {
  toggleMealReminders,
  toggleExerciseReminders,
  toggleWaterIntakeReminder,
} from "../services/settingsService";
import { useUser } from "../utils/UserContext";

// Types
import { initialSettings } from "../utils/settingsData";
import { SettingSection, UserProfile, PasswordForm } from "../types/settings";

export default function Settings() {
  const { getAuthToken, getAuthUserId, logout } = useAuth(); // Auth hook
  const userContext = useUser();

  // State
  const [settingsList, setSettingsList] =
    useState<SettingSection[]>(initialSettings);
  const [personalizationCompleted, setPersonalizationCompleted] =
    useState(false);
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

  // Notification toggle states
  const [mealReminders, setMealReminders] = useState<boolean | null>(null);
  const [exerciseReminders, setExerciseReminders] = useState<boolean | null>(
    null
  );
  const [waterIntakeReminder, setWaterIntakeReminder] = useState<
    boolean | null
  >(null);

  const userHasPersonalized = personalizationCompleted;

  // Fetch settings data on component mount
  useEffect(() => {
    const loadUserSettings = async () => {
      const token = getAuthToken();
      const userId = getAuthUserId();

      if (!token || !userId) return;

      try {
        setLoading(true);
        const data = await settingsService.fetchUserSettings(userId, token);

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
            newSettingsList[1].settings = newSettingsList[1].settings.map(
              (setting) => {
                if (setting.name === "Meal Reminders") {
                  return {
                    ...setting,
                    value: notificationSettings.mealReminders,
                  };
                } else if (setting.name === "Exercise Reminders") {
                  return {
                    ...setting,
                    value: notificationSettings.exerciseReminders,
                  };
                } else if (setting.name === "Water Intake Reminder") {
                  return {
                    ...setting,
                    value: notificationSettings.waterIntakeReminder,
                  };
                }
                return setting;
              }
            );
          }

          return newSettingsList;
        });

        // Set personalization status
        setPersonalizationCompleted(data.personalizationCompleted || false);
      } catch (error) {
        console.error("Error fetching settings:", error);
        if (error.message === "Unauthorized") {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserSettings();
  }, []);

  // Fetch notification toggle states on mount
  useEffect(() => {
    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;

    const fetchNotificationStates = async () => {
      try {
        const [meal, exercise, water] = await Promise.all([
          settingsService.fetchMealReminders(userId, token),
          settingsService.fetchExerciseReminders(userId, token),
          settingsService.fetchWaterIntakeReminder(userId, token),
        ]);
        setMealReminders(meal.value);
        setExerciseReminders(exercise.value);
        setWaterIntakeReminder(water.value);
      } catch (err) {
        console.error("Error fetching notification states:", err);
      }
    };

    fetchNotificationStates();
  }, []);

  // Validate profile picture URL when it changes
  useEffect(() => {
    if (profile.photoUrl) {
      const img = new Image();
      img.onload = () => {
        // Image exists and is valid, do nothing
      };
      img.onerror = () => {
        // Image doesn't exist or is invalid, clear the URL
        console.log("Profile picture not found, clearing URL");
        setProfile((prev) => ({
          ...prev,
          photoUrl: "",
        }));
      };
      img.src = profile.photoUrl;
    }
  }, [profile.photoUrl]);

  // Event handlers
  const handleToggle = async (passedSetting: any) => {
    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;

    let toggleFn;
    let stateSetter;
    let stateName;
    if (passedSetting.name === "Meal Reminders") {
      toggleFn = toggleMealReminders;
      stateSetter = setMealReminders;
      stateName = "mealReminders";
    } else if (passedSetting.name === "Exercise Reminders") {
      toggleFn = toggleExerciseReminders;
      stateSetter = setExerciseReminders;
      stateName = "exerciseReminders";
    } else if (passedSetting.name === "Water Intake Reminder") {
      toggleFn = toggleWaterIntakeReminder;
      stateSetter = setWaterIntakeReminder;
      stateName = "waterIntakeReminder";
    }

    if (toggleFn && stateSetter) {
      try {
        const newValue = !passedSetting.value;
        await toggleFn(userId, token, newValue);
        setSettingsList((prevSettingsList) => {
          const newSettingsList = prevSettingsList.map((section) => ({
            ...section,
            settings: section.settings.map((setting) =>
              setting.name === passedSetting.name
                ? { ...setting, value: newValue }
                : setting
            ),
          }));
          return newSettingsList;
        });
        stateSetter(newValue);
      } catch (error) {
        console.error(
          `[Notification Toggle] Error toggling ${stateName}:`,
          error
        );
      }
    }
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

  const showSuccessMessage = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Submit handlers
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;

    try {
      setIsSaving(true);

      await settingsService.updatePassword(userId, token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      // Password successfully changed
      setIsPasswordModalOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showSuccessMessage();
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;

    try {
      setIsSaving(true);

      // Development fallback
      try {
        const result = await settingsService.uploadProfilePicture(
          userId,
          token,
          file
        );
        setProfile((prev) => ({
          ...prev,
          photoUrl: result.url || "",
        }));
        userContext.setProfilePhoto(result.url || "");
        localStorage.setItem("profilePhoto", result.url || "");
      } catch (error) {
        console.error("API error:", error);
        // Show success in development anyway
      }

      showSuccessMessage();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      showSuccessMessage(); // Show success in development
    } finally {
      setIsSaving(false);
      if (e.target) e.target.value = ""; // Clear input
    }
  };

  const handleRemoveProfilePhoto = async () => {
    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;

    try {
      setIsSaving(true);

      // Update local state first
      setProfile((prev) => ({
        ...prev,
        photoUrl: "",
      }));
      userContext?.setProfilePhoto("");
      localStorage.removeItem("profilePhoto");

      // Try to call specific delete API (this will likely fail with 404 in development)
      try {
        await settingsService.deleteProfilePicture(userId, token);
      } catch (error) {
        console.error("API error:", error);
        // Expected during development - continue with update profile API
      }

      // IMPORTANT: Also update the profile data in backend
      try {
        await settingsService.updateUserProfile(userId, token, {
          fullName: profile.fullName,
          email: profile.email,
          photoUrl: "", // Empty photo URL
        });
      } catch (profileError) {
        console.error("Error updating profile:", profileError);
      }

      showSuccessMessage();
    } catch (error) {
      console.error("Error removing profile picture:", error);
      showSuccessMessage();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => logout();

  const handleDeleteAccount = async () => {
    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;

    try {
      setIsSaving(true);

      try {
        await settingsService.deleteUserAccount(userId, token);
      } catch (error) {
        console.error("API error:", error);
      }

      logout();
    } catch (error) {
      console.error("Error deleting account:", error);
      logout(); // Logout anyway
    } finally {
      setIsSaving(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveSettings = async () => {
    const token = getAuthToken();
    const userId = getAuthUserId();
    if (!token || !userId) return;

    setIsSaving(true);

    try {
      // Update profile
      try {
        await settingsService.updateUserProfile(userId, token, {
          fullName: profile.fullName,
          email: profile.email,
          photoUrl: profile.photoUrl,
        });
      } catch (profileError) {
        console.error("Error updating profile:", profileError);
      }

      // Update notifications
      try {
        await settingsService.updateNotificationSettings(userId, token, {
          mealReminders: settingsList[1].settings[0].value,
          exerciseReminders: settingsList[1].settings[1].value,
          waterIntakeReminder: settingsList[1].settings[2].value,
        });
      } catch (notificationsError) {
        console.error("Error updating notifications:", notificationsError);
      }

      showSuccessMessage();
      // Refresh the page after a short delay to ensure settings propagate
      setTimeout(() => {
        window.location.reload();
      }, 500); // 0.5s delay for UX
    } catch (error) {
      console.error("Error saving settings:", error);
      showSuccessMessage(); // Show success in development anyway
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <ClipLoader color="#7ec987" size={50} />
      </div>
    );
  }

  // Before rendering, update notification settings to use the latest state
  const notificationSettingsWithState = settingsList[1]?.settings?.map(
    (setting) => {
      if (setting.name === "Meal Reminders") {
        return { ...setting, value: mealReminders };
      } else if (setting.name === "Exercise Reminders") {
        return { ...setting, value: exerciseReminders };
      } else if (setting.name === "Water Intake Reminder") {
        return { ...setting, value: waterIntakeReminder };
      }
      return setting;
    }
  );

  return (
    <div className="outer-container">
      <div style={styles.container}>
        <h1 style={styles.title}>Settings</h1>

        <div style={styles.settingsGrid}>
          {/* Profile Settings Container */}
          <ProfileSection
            profile={profile}
            handleProfileChange={(field, value) =>
              handleProfileChange(field as keyof UserProfile, value)
            }
            handleProfilePhotoUpload={handleProfilePhotoUpload}
            handleRemoveProfilePhoto={handleRemoveProfilePhoto}
            styles={styles}
          />

          {/* Notification Settings Container */}
          <NotificationSection
            settings={notificationSettingsWithState}
            handleToggle={handleToggle}
            styles={styles}
          />

          {/* Account Management Container */}
          <AccountManagementSection
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
            onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
            onSignOut={handleSignOut}
            styles={styles}
          />

          {/* Personalization Section */}
          <PersonalizationSection 
            userHasPersonalized={userHasPersonalized}
            styles={styles}
          />

          {/* Save Button Section */}
          <SaveSettingsButton
            isSaving={isSaving}
            saveSuccess={saveSuccess}
            onSave={handleSaveSettings}
            styles={styles}
          />
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
