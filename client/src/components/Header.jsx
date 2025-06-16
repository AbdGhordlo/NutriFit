import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/imgs/logo-no-padding.png";
import "./styles/headerStyles.css";
import { useAuth } from "../utils/useAuth";
import { fetchUserNotifications, deleteNotification } from "../services/notificationService";
import { notificationTypeMeta } from "../types/notification"; // Import notificationTypeMeta
import moment from "moment";
import dingSound from "../assets/audio/ding.wav";
import dropletSound from "../assets/audio/droplet.wav";
import transitionSound from "../assets/audio/transition.wav";
//npm install prop-types
export default function Header({ toggleSidebar }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Move notifications to state so we can update them
  const [notifications, setNotifications] = useState([]);
  // Add state to track dismissing notification
  const [dismissingId, setDismissingId] = useState(null);

  const notificationRef = useRef(null);
  const accountRef = useRef(null);
  const { getAuthUserId } = useAuth();


  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");

    if (token) {
      setIsLoggedIn(true);

      if (storedEmail) {
        setUserEmail(storedEmail);
      } else {
        try {
          const base64Payload = token.split(".")[1];
          const decodedPayload = atob(base64Payload);
          const payload = JSON.parse(decodedPayload);

          setUserEmail(payload.email || "user@example.com");
        } catch {
          setUserEmail("user@example.com");
        }
      }
    } else {
      setIsLoggedIn(false);
      setUserEmail("");
    }
  }, []);

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
    setIsAccountOpen(false);
  };

  const toggleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
    setIsNotificationsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail"); // Remove stored email
    setIsLoggedIn(false);
    setUserEmail("");
    window.location.href = "/";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleSignup = () => {
    window.location.href = "/register";
  };

  // Enhance notifications with UI fields from notificationTypeMeta
  useEffect(() => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => {
        const meta = notificationTypeMeta[n.notification_type];
        let time = n.notification_time || n.created_at;
        return meta
          ? {
              ...n,
              title: meta.title,
              message: meta.message,
              icon: meta.icon,
              time,
              unread: n.unread !== undefined ? n.unread : true,
            }
          : n;
      })
    );
  }, [notifications.length]);

  // Count unread notifications (after UI fields are set)
  const unreadCount = notifications.filter((notification) => notification.unread).length;
  
  const currentPath = window.location.pathname;
  const isAuthPage = currentPath === "/login" || currentPath === "/register";
  const isAboutPage = currentPath === "/about";
  const isContactPage = currentPath === "/contact";
  const isPrivacyPage = currentPath === "/privacy";
  const showTopNav = isAboutPage || isContactPage || isPrivacyPage;
  //ispublicpage can be assessed by checking if the path is not an auth page
  // Determine what to show based on authentication and page type
  const shouldShowNotifications = isLoggedIn;
  const shouldShowUserMenu = isLoggedIn || (!isLoggedIn && !isAuthPage);

  // Handler to remove notification and delete from DB
  const handleNotificationDone = async (id) => {
    setDismissingId(id);
    new Audio(transitionSound).play();
    const token = localStorage.getItem("token");
    try {
      await deleteNotification(id, token);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setDismissingId(null);
      }, 500); // 500ms matches the CSS transition
    } catch (error) {
      setDismissingId(null);
      console.error("Failed to delete notification:", error);
    }
  };

  // Fetch notifications on mount and every 1 minute
  useEffect(() => {
    let intervalId;
    if (!isAuthPage && isLoggedIn) {
      const userId = getAuthUserId();
      if (userId) {
        const fetchNotifications = () => {
          fetchUserNotifications(userId)
            .then((fetchedNotifications) => {
              setNotifications(fetchedNotifications);
            })
            .catch((error) => {
              console.error("Failed to fetch notifications:", error);
            });
        };
        fetchNotifications(); // Initial fetch
        intervalId = setInterval(fetchNotifications, 60000); // Every 1 min for testing

      }
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthPage, isLoggedIn]);

  // Play notification sound on new notification
  const prevNotificationsLength = useRef(null);
  const isFirstLoad = useRef(true);
  useEffect(() => {
    const isHomePage = window.location.pathname === "/home";
    if (isFirstLoad.current) {
      prevNotificationsLength.current = notifications.length;
      isFirstLoad.current = false;
      return;
    }
    if (
      isHomePage &&
      prevNotificationsLength.current !== null &&
      notifications.length > prevNotificationsLength.current
    ) {
      // Find the new notification(s)
      const newNotifications = notifications.slice(prevNotificationsLength.current);
      newNotifications.forEach((n) => {
        if (n.notification_type === "water") {
          new Audio(dropletSound).play();
        } else if (n.notification_type === "meal" || n.notification_type === "exercise") {
          new Audio(dingSound).play();
        }
      });
    }
    prevNotificationsLength.current = notifications.length;
  }, [notifications]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="left-container">
          {!isAuthPage && (
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
          {showTopNav && (
            <div className="md:flex items-center space-x-8 ml-8">
              <Link to="/home" className="text-gray-600 hover:text-green-600 transition-colors">Home</Link>
              {isAboutPage ? (
                <span className="text-green-600 font-medium">About</span>
              ) : (
                <Link to="/about" className="text-gray-600 hover:text-green-600 transition-colors">About</Link>
              )}
              {isContactPage ? (
                <span className="text-green-600 font-medium">Contact</span>
              ) : (
                <Link to="/contact" className="text-gray-600 hover:text-green-600 transition-colors">Contact</Link>
              )}
              {isPrivacyPage ? (
                <span className="text-green-600 font-medium">Privacy</span>
              ) : (
                <Link to="/privacy" className="text-gray-600 hover:text-green-600 transition-colors">Privacy</Link>
              )}
            </div>
          )}
        </div>

        <div className="actions-container">
          {/* Notification Button and Dropdown - Only show when logged in */}
          {shouldShowNotifications && (
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
                    {notifications.length === 0 ? (
                      <div className="no-notifications">No notifications</div>
                    ) : (
                      notifications.map((notification) => {
                        const isDismissing = dismissingId === notification.id;
                        return (
                          <div
                            key={notification.id}
                            className={`notification-item${notification.unread ? ' unread' : ''}${isDismissing ? ' dismissing' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.5s, opacity 0.5s', transform: isDismissing ? 'translateX(100%)' : 'none', opacity: isDismissing ? 0 : 1 }}
                          >
                            <input
                              type="checkbox"
                              className="notification-done-checkbox cursor-pointer"
                              title="Mark as done"
                              checked={isDismissing}
                              onChange={() => handleNotificationDone(notification.id)}
                              style={{ marginRight: 8 }}
                            />
                            {notification.icon && (
                              <notification.icon className="notification-item-icon" />
                            )}
                            <div className="notification-content">
                              <h4 className="notification-title">
                                {notification.title}
                              </h4>
                              <p className="notification-message">
                                {notification.message}
                              </p>
                              <span className="notification-time">
                                {notification.notification_type === "water"
                                  ? (notification.created_at ? moment(notification.created_at).fromNow() : "")
                                  : (notification.notification_time && notification.created_at
                                      ? moment(
                                          moment(notification.created_at).format("YYYY-MM-DD") +
                                            "T" +
                                            notification.notification_time
                                        ).fromNow()
                                      : "")}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Account Button and Dropdown - Conditional based on auth status and page type */}
          {shouldShowUserMenu && (
            <div ref={accountRef} className="account-wrapper">
              <button
                className="account-button"
                onClick={toggleAccount}
              >
                <div className="account-avatar">
                  <User className="account-icon" />
                </div>
                <span className="account-text">
                  {isLoggedIn ? "Account" : "Sign In"}
                </span>
                <ChevronDown className="dropdown-arrow" />
              </button>

              {/* Account Dropdown */}
              {isAccountOpen && (
                <div className="dropdown account-dropdown">
                  {isLoggedIn ? (
                    // Logged in user menu
                    <>
                      <div className="dropdown-header">
                        <p className="signed-in-text">Signed in as</p>
                        <p className="user-email">{userEmail}</p>
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
                    </>
                  ) : (
                    // Logged out user menu (for public pages)
                    <>
                      <div className="dropdown-header">
                        <p className="signed-in-text">Welcome to NutriFit</p>
                        <p className="user-email">Join us to track your nutrition</p>
                      </div>
                      <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={handleLogin}>
                          <LogIn className="dropdown-item-icon" />
                          <span>Log In</span>
                        </button>
                        <button className="dropdown-item signup-item" onClick={handleSignup}>
                          <UserPlus className="dropdown-item-icon" />
                          <span>Sign Up</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// PropTypes validation
Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};