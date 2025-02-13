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

function App() {
  return (
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
    </Router>
  );
}

export default App;
