import React from "react";
import { X } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isSaving: boolean;
  styles: any; // You could define a more specific type for styles
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  isSaving,
  styles,
}) => {
  return (
    <div style={isOpen ? styles.modalOverlay : styles.modalHidden}>
      <div style={styles.modalContainer}>
        <div style={styles.modalHeader}>
          <h2 style={{ ...styles.modalTitle, color: "#ef4444" }}>
            Delete Account
          </h2>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={24} color="#6b7280" />
          </button>
        </div>
        <div style={styles.modalForm}>
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "16px", marginBottom: "12px" }}>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              When you delete your account:
            </p>
            <ul
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginLeft: "20px",
                marginTop: "8px",
              }}
            >
              <li>All your personal data will be permanently removed</li>
              <li>Your meal and exercise plans will be deleted</li>
              <li>You will lose access to all your progress and history</li>
            </ul>
          </div>
          <div style={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              style={{
                ...styles.submitButton,
                backgroundColor: "#ef4444",
                borderColor: "#ef4444",
              }}
              disabled={isSaving}
            >
              {isSaving ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
