import React from "react";
import { UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";

interface PersonalizationSectionProps {
  userHasPersonalized: boolean;
  styles: any;
}

const PersonalizationSection: React.FC<PersonalizationSectionProps> = ({
  userHasPersonalized,
  styles,
}) => {
  const navigate = useNavigate();

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <UserCheck style={styles.sectionIcon} />
        <h2 style={styles.sectionTitle}>Personalization</h2>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ fontWeight: 500, fontSize: 16, margin: 0 }}>
          {userHasPersonalized
            ? "Change your personalization"
            : "Set up your personalization for personalized plans"}
        </p>
        <Button
          variant={userHasPersonalized ? "primary" : "danger"}
          onClick={() => navigate("/personalization")}
        >
          Personalize
        </Button>
      </div>
    </div>
  );
};

export default PersonalizationSection;
