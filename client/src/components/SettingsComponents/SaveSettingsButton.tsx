import React from "react";
import Button from "../Button";

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
        <div style={styles.successMessage}>Settings saved successfully!</div>
      )}
      <Button
        variant="primary"
        onClick={onSave}
        disabled={isSaving}
        style={{
          width: "200px",
        }}
      >
        {isSaving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
};

export default SaveSettingsButton;
