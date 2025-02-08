import React, { useState } from "react";
import { Bell, User, Settings, LogOut, Droplet, UtensilsCrossed, Dumbbell } from "lucide-react";
import logo from "../assets/imgs/logo-no-padding.png";
import { styles } from "./styles/HeaderStyles";
import './styles/headerStyles.css'

export default function Header() {
  const [isNotificationHovered, setNotificationHovered] = useState(false);
  const [isAccountHovered, setAccountHovered] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // State for notifications dropdown
  const [showAccount, setShowAccount] = useState(false); // State for account dropdown

  const notifications = [
    {
      id: 1,
      icon: Droplet,
      title: "Time to hydrate!",
      message: "Don't forget to drink water",
      time: "5 minutes ago",
    },
    {
      id: 2,
      icon: UtensilsCrossed,
      title: "Lunch time",
      message: "Your next meal is scheduled for 1:00 PM",
      time: "10 minutes ago",
    },
    {
      id: 3,
      icon: Dumbbell,
      title: "Workout reminder",
      message: "Upper body training in 30 minutes",
      time: "15 minutes ago",
    },
  ];

  const getHoverStyle = (isHovered, baseStyle, hoverStyle) => ({
    ...baseStyle,
    ...(isHovered ? hoverStyle : {}),
  });

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    window.location.href = "/login"; // Redirect to login
  };

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
          <div style={{ position: "relative" }}>
            <button
              style={getHoverStyle(
                isNotificationHovered,
                styles.notificationButton,
                { backgroundColor: "#f3f4f6" } // Dim background on hover
              )}
              onMouseEnter={() => setNotificationHovered(true)}
              onMouseLeave={() => setNotificationHovered(false)}
              onClick={() => setShowNotifications(!showNotifications)} // Toggle notifications dropdown
            >
              <Bell style={styles.notificationIcon} />
              {/* The dot should be added when there is a notification. Maybe passing Notifications info as a prop makes sense? */}
            {/* <span style={styles.notificationDot}></span> */}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div style={styles.dropdown}>
                {notifications.map((notification) => (
                  <div key={notification.id} style={styles.notificationItem}>
                    <notification.icon style={styles.notificationIcon} />
                    <div style={styles.notificationContent}>
                      <h4 style={styles.notificationTitle}>{notification.title}</h4>
                      <p style={styles.notificationMessage}>{notification.message}</p>
                      <small style={styles.notificationTime}>{notification.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Button */}
          <div style={{ position: "relative" }}>
            <button
              style={getHoverStyle(
                isAccountHovered,
                styles.accountButton,
                { backgroundColor: "#f3f4f6" } // Dim background on hover
              )}
              onMouseEnter={() => setAccountHovered(true)}
              onMouseLeave={() => setAccountHovered(false)}
              onClick={() => setShowAccount(!showAccount)} // Toggle account dropdown
            >
              <User style={styles.accountIcon} />
              <span style={styles.accountText}>Account</span>
            </button>

            {/* Account Dropdown */}
            {showAccount && (
              <div style={styles.dropdown}>
                <div style={styles.accountDropdownItem}>
                  <span>Username</span> {/* Replace with dynamic username */}
                </div>
                <div style={styles.accountDropdownItem}>
                  <Settings style={styles.menuIcon} />
                  <span>Settings</span>
                </div>
                <div style={styles.accountDropdownItem} onClick={handleLogout}>
                  <LogOut style={styles.menuIcon} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </header>
  );
}
