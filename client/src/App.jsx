import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import MealPlanner from "./pages/MealPlanner/MealPlanner";
import Home from "./pages/Home";
import ExercisePlanner from "./pages/ExercisePlanner/ExercisePlanner";
import Ingredients from "./pages/Ingredients";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword   from "./pages/ResetPassword";
import Personalization from "./pages/Personalization";
import ProtectedRoute from "./components/ProtectedRoute";
import NutriFitMainPage from "./pages/NutriFitMainPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";

import "./AppStyles.css";

function AppContent() {
  const location = useLocation(); // Get the current route location
  const fromPersonalization = location.pathname === "/ingredients" && location.state && location.state.fromPersonalization;
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    window.innerWidth >= 1000
  );
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1000);

  // Define routes where the sidebar, header, and footer should not be displayed
  const noSidebarRoutes = [
    "/login", "/register", "/", "/about", "/contact", "/privacy", "/forgot-password", "/reset-password", "/personalization"
  ];
  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname) && !fromPersonalization;
  const shouldShowFooter = !noSidebarRoutes.includes(location.pathname) && !fromPersonalization;

  // Effect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1000;
      setIsLargeScreen(isLarge);
      setIsSidebarVisible(isLarge); // Always show sidebar on large screens
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`app-container ${!shouldShowSidebar ? "no-sidebar" : ""}`}>
      <Header toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      {shouldShowSidebar && (
        <Sidebar
          isVisible={isSidebarVisible}
          toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
          isLargeScreen={isLargeScreen}
        />
      )}

      <main
        className={`main-content ${!isSidebarVisible ? "sidebar-hidden" : ""}`}
      >
        <div className="contentWrapper">
          <Routes>
            <Route path="/" element={<NutriFitMainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/exercise-planner" element={<ExercisePlanner />} />
              <Route path="/ingredients" element={<Ingredients />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/personalization" element={<Personalization />} />
            </Route>
          </Routes>
        </div>
      </main>

      {shouldShowFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
