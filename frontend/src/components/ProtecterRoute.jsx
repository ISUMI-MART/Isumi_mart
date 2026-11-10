
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {

  // Get the saved login token
  const token = localStorage.getItem("token");

  // Remember the page the user wanted to visit
  const location = useLocation();

  // If there is no token, redirect to Login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // If logged in, show the requested page
  return children;
}

export default ProtectedRoute;
