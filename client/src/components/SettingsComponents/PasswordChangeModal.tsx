import React from "react";
import { X } from "lucide-react";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  passwordError: string;
  handlePasswordChange: (field: string, value: string) => void;
  handlePasswordSubmit: (e: React.FormEvent) => void;
  styles: any; // You could define a more specific type for styles
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  passwordForm,
  passwordError,
  handlePasswordChange,
  handlePasswordSubmit,
  styles,
}) => {
  return (
    <div style={isOpen ? styles.modalOverlay : styles.modalHidden}>
      <div style={styles.modalContainer}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Change Password</h2>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={24} color="#6b7280" />
          </button>
        </div>
        <form onSubmit={handlePasswordSubmit} style={styles.modalForm}>
          <div>
            <label style={styles.inputLabel}>Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                handlePasswordChange("currentPassword", e.target.value)
              }
              style={styles.wideInput}
              required
            />
          </div>
          <div>
            <label style={styles.inputLabel}>New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
              style={styles.wideInput}
              required
            />
          </div>
          <div>
            <label style={styles.inputLabel}>Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                handlePasswordChange("confirmPassword", e.target.value)
              }
              style={styles.wideInput}
              required
            />
          </div>
          {passwordError && <p style={styles.errorMessage}>{passwordError}</p>}
          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
