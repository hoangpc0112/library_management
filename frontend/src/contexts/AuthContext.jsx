import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response = await axiosInstance.get(
          "http://localhost:8000/user/me"
        );
        setCurrentUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Lỗi xác thực:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/login/",
        credentials
      );
      localStorage.setItem("token", response.data.token);
      setCurrentUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || "Đăng nhập thất bại",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => currentUser && currentUser.is_admin;

  const authContextValue = {
    currentUser,
    setCurrentUser,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
