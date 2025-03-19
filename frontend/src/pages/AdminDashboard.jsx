import React from "react";
import { useEffect } from "react";

const AdminDashboard = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Quản lý thư viện";
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
};

export default AdminDashboard;
