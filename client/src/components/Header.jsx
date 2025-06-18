import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
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
  LogIn,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/imgs/logo-no-padding.png";
import "./styles/headerStyles.css";
//npm install prop-types
export default function Header({ toggleSidebar }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const notificationRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    const storedUsername = localStorage.getItem("username");
    const storedPhoto = localStorage.getItem("profilePhoto");
    let userId = null;

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
          userId = payload.id;
        } catch {
          setUserEmail("user@example.com");
        }
      }

      // Try to get userId from token if not already set
      if (!userId) {
        try {
          const base64Payload = token.split(".")[1];
          const decodedPayload = atob(base64Payload);
          const payload = JSON.parse(decodedPayload);
          userId = payload.id;
        } catch {}
      }

      if (storedUsername) {
        setUsername(storedUsername);
      }
      if (storedPhoto) {
        setProfilePhoto(storedPhoto);
      }
      if ((!storedUsername || !storedPhoto) && userId) {
        // Fetch username and photo from API if not in localStorage
        fetch(`http://localhost:5000/settings/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.profile) {
              if (data.profile.fullName) {
                setUsername(data.profile.fullName);
                localStorage.setItem("username", data.profile.fullName);
              }
              if (data.profile.photoUrl) {
                setProfilePhoto(data.profile.photoUrl);
                localStorage.setItem("profilePhoto", data.profile.photoUrl);
              }
            }
          });
      }
    } else {
      setIsLoggedIn(false);
      setUserEmail("");
      setUsername("");
      setProfilePhoto("");
    }
  }, []);

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
    setUsername("");
    setProfilePhoto("");
    window.location.href = "/";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleSignup = () => {
    window.location.href = "/register";
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notification => notification.unread).length;
  
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
          )}

          {/* Account Button and Dropdown - Conditional based on auth status and page type */}
          {shouldShowUserMenu && (
            <div ref={accountRef} className="account-wrapper">
              <button
                className="account-button"
                onClick={toggleAccount}
              >
                <div className="account-avatar">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="account-profile-img"
                      style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src = "";
                        setProfilePhoto("");
                        localStorage.removeItem("profilePhoto");
                      }}
                    />
                  ) : (
                    <User className="account-icon" />
                  )}
                </div>
                <span className="account-text">
                  {isLoggedIn ? (username || "Account") : "Sign In"}
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