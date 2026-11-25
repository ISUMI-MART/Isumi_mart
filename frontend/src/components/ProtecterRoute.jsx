import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  // Get the saved login token
  const token = localStorage.getItem("token");

  // Remember the page the user wanted to visit
  const location = useLocation();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // If there is no token, redirect to Login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check user role
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the requested page
  return children;
}

export default ProtectedRoute;
