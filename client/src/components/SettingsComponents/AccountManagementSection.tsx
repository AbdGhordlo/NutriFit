import React from "react";
import { Shield, UserCog, Trash2, LogOut, Lock } from "lucide-react";

interface AccountManagementSectionProps {
  onOpenPasswordModal: () => void;
  onOpenDeleteModal: () => void;
  onSignOut: () => void;
  styles: any; // You might want to type this properly
  isGoogleUser: boolean;
}

const AccountManagementSection: React.FC<AccountManagementSectionProps> = ({
  onOpenPasswordModal,
  onOpenDeleteModal,
  onSignOut,
  styles,
  isGoogleUser,
}) => {
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <Shield style={styles.sectionIcon} />
        <h2 style={styles.sectionTitle}>Account Management</h2>
      </div>

      <div style={styles.accountManagementList}>
        {/* Change Password Option */}
        {!isGoogleUser && (
          <div
            onClick={onOpenPasswordModal}
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
        )}

        {/* Delete Account Option */}
        <div
          onClick={onOpenDeleteModal}
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
        <div onClick={onSignOut} style={styles.accountOption}>
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
  );
};

export default AccountManagementSection;