import React, { useState, useRef } from "react";
import { User, Camera, Upload, Trash2 } from "lucide-react";
import Button from "../Button";

interface ProfileSectionProps {
  profile: {
    fullName: string;
    email: string;
    photoUrl?: string;
  };
  handleProfileChange: (field: string, value: string) => void;
  handleProfilePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveProfilePhoto?: () => void;
  styles: any;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  handleProfileChange,
  handleProfilePhotoUpload,
  handleRemoveProfilePhoto,
  styles,
}) => {
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to check if photoUrl is valid or empty
  const hasValidPhoto = () => {
    return !!profile.photoUrl && profile.photoUrl.trim() !== "";
  };

  const handlePhotoClick = () => {
    setIsPhotoMenuOpen(!isPhotoMenuOpen);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setIsPhotoMenuOpen(false);
  };

  const handleRemoveClick = () => {
    if (handleRemoveProfilePhoto) {
      handleRemoveProfilePhoto();
    }
    setIsPhotoMenuOpen(false);
  };

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <User style={styles.sectionIcon} />
        <h2 style={styles.sectionTitle}>Profile Settings</h2>
      </div>

      <div style={styles.profileContainer}>
        {/* Profile Photo */}
        <div style={styles.profilePhotoSection}>
          <div style={{ position: "relative" }}>
            {/* Photo Container */}
            <div
              onClick={handlePhotoClick}
              style={Object.assign({}, styles.profilePicture, {
                cursor: "pointer",
                position: "relative",
              })}
            >
              {hasValidPhoto() ? (
                <>
                  <img
                    src={profile.photoUrl}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    onError={(e) => {
                      // If image fails to load, show default user icon
                      e.currentTarget.style.display = "none";
                      if (handleRemoveProfilePhoto) {
                        // Optionally clear the invalid URL
                        handleRemoveProfilePhoto();
                      }
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.3s",
                    }}
                    className="hover-overlay"
                  >
                    <Camera size={24} color="white" />
                  </div>
                </>
              ) : (
                <User size={40} color="#6b7280" />
              )}
            </div>

            {/* Photo Menu */}
            {isPhotoMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  marginTop: "8px",
                  width: "180px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow:
                    "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                  padding: "4px",
                  zIndex: 10,
                }}
              >
                <button
                  onClick={handleUploadClick}
                  style={{
                    width: "100%",
                    padding: "8px 16px",
                    textAlign: "left",
                    color: "#4B5563",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                  className="menu-item"
                >
                  <Upload size={16} />
                  <span>Upload Photo</span>
                </button>
                {hasValidPhoto() && (
                  <button
                    onClick={handleRemoveClick}
                    style={{
                      width: "100%",
                      padding: "8px 16px",
                      textAlign: "left",
                      color: "#DC2626",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                    className="menu-item-danger"
                  >
                    <Trash2 size={16} />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleProfilePhotoUpload(e);
                // Reset value to allow selecting the same file again
                if (e.target) {
                  e.target.value = "";
                }
              }}
              style={{ display: "none" }}
            />
          </div>

          <div>
            <label>
              <Button
                variant="primary"
              >
                Upload Photo
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* Profile Inputs */}
        <div style={styles.profileInputsGrid}>
          <div>
            <label style={styles.inputLabel}>Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => handleProfileChange("fullName", e.target.value)}
              style={styles.wideInput}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label style={styles.inputLabel}>Email</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              style={{
                ...styles.wideInput,
                backgroundColor: "#f3f4f6", // light gray
                color: "#6b7280", // gray text
                cursor: "not-allowed",
                opacity: 1,
              }}
              placeholder="john@example.com"
            />
          </div>
        </div>
      </div>

      {/* Add a small bit of CSS for hover effects */}
      <style>
        {`
          .hover-overlay:hover {
            opacity: 1 !important;
          }
          .menu-item:hover {
            background-color: #F3F4F6;
          }
          .menu-item-danger:hover {
            background-color: #FEF2F2;
          }
        `}
      </style>
    </div>
  );
};

export default ProfileSection;
