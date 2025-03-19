import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Quản lý thư viện";
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Trang Quản Trị Hệ Thống</h1>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Yêu cầu mượn sách</h5>
              <p className="card-text">
                Quản lý các yêu cầu mượn sách từ người dùng.
              </p>
              <Link to="/admin/borrow-requests" className="btn btn-primary">
                Xem yêu cầu mượn sách
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Quản lý sách</h5>
              <p className="card-text">
                Thêm, sửa, xóa thông tin sách trong thư viện.
              </p>
              <Link to="/admin/books" className="btn btn-success">
                Quản lý sách
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Quản lý người dùng</h5>
              <p className="card-text">
                Quản lý thông tin người dùng trong hệ thống.
              </p>
              <Link to="/admin/users" className="btn btn-warning">
                Quản lý người dùng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
