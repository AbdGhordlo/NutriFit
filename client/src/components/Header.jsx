import React, { useState } from "react";
import {
  Bell,
  User,
  Settings,
  LogOut,
  Droplet,
  UtensilsCrossed,
  Dumbbell,
  Menu,
} from "lucide-react";
import logo from "../assets/imgs/logo-no-padding.png";
import "./styles/headerStyles.css";

export default function Header({ toggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="header">
      <div className="container">
        <div className="left-container">
          {window.location.pathname !== "/login" &&
            window.location.pathname !== "/register" && (
              <button className="sidebar-toggle" onClick={toggleSidebar}>
                <Menu className="menu-icon" />
              </button>
            )}
          <a
            href="/home"
            style={{ textDecoration: "none" }}
            className="logo-container-anchor"
          >
            <div className="logo-container">
              <img src={logo} className="logo" alt="Logo" />
              <span className="brand-name">NutriFit</span>
            </div>
          </a>
        </div>

        <div className="actions-container">
          {/* Notification Button */}
          <div style={{ position: "relative" }}>
            <button
              className="notification-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="notification-icon" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="dropdown">
                {notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <notification.icon className="notification-icon" />
                    <div className="notification-content">
                      <h4 className="notification-title">
                        {notification.title}
                      </h4>
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <small className="notification-time">
                        {notification.time}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Button */}
          <div style={{ position: "relative" }}>
            <button
              className="account-button"
              onClick={() => setShowAccount(!showAccount)}
            >
              <User className="account-icon" />
              <span className="account-text">Account</span>
            </button>

            {/* Account Dropdown */}
            {showAccount && (
              <div className="dropdown">
                <div className="account-dropdown-item">
                  <span>Username</span>
                </div>
                <div className="account-dropdown-item">
                  <Settings className="menu-icon" />
                  <span>Settings</span>
                </div>
                <div className="account-dropdown-item" onClick={handleLogout}>
                  <LogOut className="menu-icon" />
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
