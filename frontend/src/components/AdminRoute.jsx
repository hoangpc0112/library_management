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
    return <div>Đang tải...</div>;
  }

  return isAuthenticated && isAdmin() ? <Outlet /> : null;
};

export default AdminRoute;
