import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await axiosInstance.get("http://localhost:8000/profile/");

        setIsAuthenticated(true);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
        } else {
          console.error("Lỗi xác thực:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
