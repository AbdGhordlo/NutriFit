import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure to import axios
import { Bell, User, Globe, Scale, Activity, Save } from 'lucide-react';
import { styles } from "./styles/SettingsStyles";
import "./styles/Settings.css";

interface UserProfile {
  fullName: string;
  email: string;
  photoUrl?: string;
}

interface Notifications {
  workoutReminders: boolean;
  mealTracking: boolean;
  progressUpdates: boolean;
}

function Settings() {
  const [profile, setProfile] = useState<UserProfile>({ fullName: '', email: '' });
  const [notifications, setNotifications] = useState<Notifications>({
    workoutReminders: true,
    mealTracking: true,
    progressUpdates: true,
  });

  const userId = "123"; // Replace this with the actual user ID (from context or authentication)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`/api/settings/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Assuming the backend returns settings in the format we expect
        setProfile({
          fullName: response.data.full_name,
          email: response.data.email,
        });
        setNotifications({
          workoutReminders: response.data.workout_reminders,
          mealTracking: response.data.meal_tracking,
          progressUpdates: response.data.progress_updates,
        });
      } catch (err) {
        setError('Failed to fetch settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  const handleSubmit = async () => {
    const updatedSettings = {
    full_name: profile.fullName, // Match backend
    email: profile.email,
    workout_reminders: notifications.workoutReminders,
    meal_tracking: notifications.mealTracking,
    progress_updates: notifications.progressUpdates,
  };

    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      const response = await axios.put(`/api/settings/${userId}`, updatedSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Settings updated:', response.data);
      // Optionally display a success message or handle the response
    } catch (err) {
      console.error('Error updating settings:', err);
      if (err.response) {
        console.error('API Error response:', err.response);
        setError(`Failed to update settings. Status: ${err.response.status}, Message: ${err.response.data.message || 'Unknown error'}`);
      } else {
        setError('Failed to update settings. No response from server.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="outer-container">
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Settings</h1>
        </div>

        <div style={styles.categoriesGrid}>
          {/* Profile Settings Section */}
          <div style={styles.categoryContainer}>
            <div style={styles.categoryHeader}>
              <User style={styles.categoryIcon} />
              <h2 style={styles.categoryTitle}>Profile Settings</h2>
            </div>
            <div className="table-container">
              <table style={styles.table}>
                <tbody>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>Profile Photo</td>
                    <td style={styles.tableCell}>
                      <div style={styles.photoContainer}>
                        <div style={styles.photoPlaceholder}>
                          <User size={40} style={styles.photoIcon} />
                        </div>
                        <button style={styles.photoButton}>Change Photo</button>
                      </div>
                    </td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>Full Name</td>
                    <td style={styles.tableCell}>
                      <input
                        type="text"
                        value={profile.fullName}
                        style={styles.input}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      />
                    </td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>Email</td>
                    <td style={styles.tableCell}>
                      <input
                        type="email"
                        value={profile.email}
                        style={styles.input}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Notifications Section */}
          <div style={styles.categoryContainer}>
            <div style={styles.categoryHeader}>
              <Bell style={styles.categoryIcon} />
              <h2 style={styles.categoryTitle}>Notifications</h2>
            </div>
            <div className="table-container">
              <table style={styles.table}>
                <tbody>
                  {Object.entries(notifications).map(([key, value]) => (
                    <tr key={key} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        {key.split(/(?=[A-Z])/).join(' ')}
                      </td>
                      <td style={styles.tableCell}>
                        <label style={styles.toggleContainer}>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              setNotifications((prev) => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))
                            }
                            style={styles.toggleInput}
                          />
                          <span style={styles.toggleSwitch(value)} />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <button onClick={handleSubmit} style={styles.saveButton}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Settings;
