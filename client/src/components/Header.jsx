import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import logo from "../assets/imgs/logo-no-padding.png";
import { styles } from "./styles/HeaderStyles";

export default function Header() {
  const [isNotificationHovered, setNotificationHovered] = useState(false);
  const [isAccountHovered, setAccountHovered] = useState(false);

  const getHoverStyle = (isHovered, baseStyle, hoverStyle) => ({
    ...baseStyle,
    ...(isHovered ? hoverStyle : {}),
  });

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={styles.logoContainer}>
            <img src={logo} style={styles.logo} alt="Logo" />
            <span style={styles.brandName}>NutriFit</span>
          </div>
        </a>

        <div style={styles.actionsContainer}>
          {/* Notification Button */}
          <button
            style={getHoverStyle(
              isNotificationHovered,
              styles.notificationButton,
              { backgroundColor: "#f3f4f6" } // Dim background on hover
            )}
            onMouseEnter={() => setNotificationHovered(true)}
            onMouseLeave={() => setNotificationHovered(false)}
          >
            <Bell style={styles.notificationIcon} />
            {/* The dot should be added when there is a notification. Maybe passing Notifications info as a prop makes sense? */}
            {/* <span style={styles.notificationDot}></span> */}
          </button>

          {/* Account Button */}
          <button
            style={getHoverStyle(
              isAccountHovered,
              styles.accountButton,
              { backgroundColor: "#f3f4f6" } // Dim background on hover
            )}
            onMouseEnter={() => setAccountHovered(true)}
            onMouseLeave={() => setAccountHovered(false)}
          >
            <User style={styles.accountIcon} />
            <span style={styles.accountText}>Account</span>
          </button>
        </div>
      </div>
    </header>
  );
}
