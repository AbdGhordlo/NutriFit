import React from "react";
import { X } from "lucide-react";

interface ErrorPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  type?: "error" | "warning" | "info";
}

const ErrorPopupModal: React.FC<ErrorPopupModalProps> = ({
  isOpen,
  onClose,
  message,
  title = "Error",
  type = "error",
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return {
          titleColor: "#f59e0b",
          buttonColor: "#f59e0b",
          buttonHoverColor: "#d97706",
        };
      case "info":
        return {
          titleColor: "#3b82f6",
          buttonColor: "#3b82f6",
          buttonHoverColor: "#2563eb",
        };
      case "error":
      default:
        return {
          titleColor: "#ef4444",
          buttonColor: "#ef4444",
          buttonHoverColor: "#dc2626",
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          padding: "24px",
          maxWidth: "400px",
          width: "90%",
          margin: "20px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: typeStyles.titleColor,
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            {message}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: typeStyles.buttonColor,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                typeStyles.buttonHoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = typeStyles.buttonColor;
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopupModal;
