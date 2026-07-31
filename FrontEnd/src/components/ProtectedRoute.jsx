import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // If no token exists, redirect to login page and save the current location 
  // so the user can be sent back here after authenticating successfully.
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}