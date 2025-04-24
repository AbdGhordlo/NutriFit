import React from "react";

interface SaveSettingsButtonProps {
  isSaving: boolean;
  saveSuccess: boolean;
  onSave: () => void;
  styles: any; // You might want to type this properly
}

const SaveSettingsButton: React.FC<SaveSettingsButtonProps> = ({
  isSaving,
  saveSuccess,
  onSave,
  styles,
}) => {
  return (
    <div style={styles.saveButtonContainer}>
      {saveSuccess && (
        <div style={styles.successMessage}>
          Settings saved successfully!
        </div>
      )}
      <button
        style={styles.saveButton}
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default SaveSettingsButton;