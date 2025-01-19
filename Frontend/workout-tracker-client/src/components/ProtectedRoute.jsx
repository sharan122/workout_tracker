import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { getToken } from "../redux/store"; // Adjust the path to your store setup

const ProtectedRoute = () => {
  const token = useSelector(getToken);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
