import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  User,
  Settings,
  LogOut,
  Droplet,
  UtensilsCrossed,
  Dumbbell,
  Menu,
  ChevronDown,
} from "lucide-react";
import logo from "../assets/imgs/logo-no-padding.png";
import "./styles/headerStyles.css";

export default function Header({ toggleSidebar }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const notificationRef = useRef(null);
  const accountRef = useRef(null);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      icon: Droplet,
      title: "Time to hydrate!",
      message: "Don't forget to drink water",
      time: "5 minutes ago",
      unread: true,
    },
    {
      id: 2,
      icon: UtensilsCrossed,
      title: "Lunch time",
      message: "Your next meal is scheduled for 1:00 PM",
      time: "10 minutes ago",
      unread: false,
    },
    {
      id: 3,
      icon: Dumbbell,
      title: "Workout reminder",
      message: "Upper body training in 30 minutes",
      time: "15 minutes ago",
      unread: false,
    },
  ];

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    // Close the account dropdown
    setIsAccountOpen(false);
  };

  const toggleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
    // Close the notifications dropdown
    setIsNotificationsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notification => notification.unread).length;

  return (
    <header className="header">
      <div className="header-container">
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
          {/* Notification Button and Dropdown */}
          <div ref={notificationRef} className="notification-wrapper">
            <button
              className="notification-button"
              onClick={toggleNotifications}
            >
              <Bell className="notification-icon" />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="dropdown notifications-dropdown">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">Notifications</h3>
                </div>
                <div className="notifications-container">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                    >
                      <notification.icon className="notification-item-icon" />
                      <div className="notification-content">
                        <h4 className="notification-title">
                          {notification.title}
                        </h4>
                        <p className="notification-message">
                          {notification.message}
                        </p>
                        <span className="notification-time">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button className="view-all-button">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account Button and Dropdown */}
          <div ref={accountRef} className="account-wrapper">
            <button
              className="account-button"
              onClick={toggleAccount}
            >
              <div className="account-avatar">
                <User className="account-icon" />
              </div>
              <span className="account-text">Account</span>
              <ChevronDown className="dropdown-arrow" />
            </button>

            {/* Account Dropdown */}
            {isAccountOpen && (
              <div className="dropdown account-dropdown">
                <div className="dropdown-header">
                  <p className="signed-in-text">Signed in as</p>
                  <p className="user-email">username@example.com</p>
                </div>
                <div className="dropdown-menu">
                  <a href="/settings" className="dropdown-item">
                    <Settings className="dropdown-item-icon" />
                    <span>Settings</span>
                  </a>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut className="dropdown-item-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
