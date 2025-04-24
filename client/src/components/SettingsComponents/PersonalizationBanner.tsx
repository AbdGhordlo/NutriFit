import React from "react";
import { useNavigate } from "react-router-dom";

interface PersonalizationBannerProps {
  userHasPersonalized: boolean;
}

const PersonalizationBanner: React.FC<PersonalizationBannerProps> = ({
  userHasPersonalized,
}) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default PersonalizationBanner;