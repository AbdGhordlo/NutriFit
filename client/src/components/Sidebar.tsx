import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Dumbbell,
  Apple,
  LineChart,
  Settings,
  LogIn,
  UserPlus,
} from "lucide-react";
import "./styles/Sidebar.css";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Calendar, label: "Meal Planner", path: "/meal-planner" },
  { icon: Dumbbell, label: "Exercise Planner", path: "/exercise-planner" },
  { icon: Apple, label: "Ingredients", path: "/ingredients" },
  { icon: LineChart, label: "Progress", path: "/progress" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: LogIn, label: "Login", path: "/login" },
  { icon: UserPlus, label: "Register", path: "/register" },
];

export default function Sidebar({ isVisible, toggleSidebar, isLargeScreen }) {
  const location = useLocation();

  return (
    <>
      <nav
        className={`sidebar-nav ${isVisible ? "open" : "closed"} ${
          isLargeScreen ? "large-screen" : ""
        }`}
      >
        <div className="sidebar-menu-container">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`sidebar-menu-item ${isActive ? "active" : ""}`}
              >
                <item.icon className="sidebar-menu-icon" />
                <span className="sidebar-menu-text">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Overlay for the rest of the page when sidebar is open (only on small screens) */}
      {!isLargeScreen && isVisible && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
    </>
  );
}