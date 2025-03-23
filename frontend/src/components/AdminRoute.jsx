import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute = () => {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login", { replace: true });
      } else if (!isAdmin()) {
        navigate("/", { replace: true });
      }
    }
  }, [loading, isAuthenticated, isAdmin, navigate]);

  if (loading) {
    return (
      <div
        className="container text-center py-5"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated && isAdmin() ? <Outlet /> : null;
};

export default AdminRoute;
