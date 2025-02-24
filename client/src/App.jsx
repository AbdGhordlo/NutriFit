import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import MealPlanner from './pages/MealPlanner';
import Home from './pages/Home';
import ExercisePlanner from './pages/ExercisePlanner';
import Ingredients from './pages/Ingredients';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

import "./AppStyles.css";
import ProtectedRoute from './components/ProtectedRoute';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import MealPlanner from "./pages/MealPlanner";
import Home from "./pages/Home";
import ExercisePlanner from "./pages/ExercisePlanner";
import Ingredients from "./pages/Ingredients";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import AppStyles from "./AppStyles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Personalization from "./pages/Personalization";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation(); // Get the current route location
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 1000);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1000);

  // Define routes where the sidebar, header, and footer should not be displayed
  const noSidebarRoutes = ["/login", "/register"];
  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);

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
    <div className={`app-container ${!shouldShowSidebar ? 'no-sidebar' : ''}`}>
      <Header toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      {shouldShowSidebar && (
        <Sidebar
          isVisible={isSidebarVisible}
          toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
          isLargeScreen={isLargeScreen}
        />
      )}

      <main className={`main-content ${!isSidebarVisible ? 'sidebar-hidden' : ''}`}>
        <div className="content-wrapper">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/exercise-planner" element={<ExercisePlanner />} />
              <Route path="/ingredients" element={<Ingredients />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </main>
    <Router>
      <div style={AppStyles.appContainer}>
        <Header />
        <Sidebar />

        <main style={AppStyles.mainContent}>
          <div style={AppStyles.contentWrapper}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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

      <Footer />
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