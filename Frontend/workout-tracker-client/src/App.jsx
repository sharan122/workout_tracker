import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "./App.css";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import WorkoutLogs from './Pages/WorkoutLogs '
import ProfilePage from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";

function App() {
  // Access Redux state
  const accessToken = useSelector((state) => state.auth.accessToken);

  // Helper function to determine if a user is logged in
  const isAuthenticated = !!accessToken;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/workoutlogs"
          element={isAuthenticated ? <WorkoutLogs /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
