import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaExchangeAlt,
  FaPlus,
  FaBook,
} from "react-icons/fa";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeLoans: 0,
    pendingRequests: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    image_url: "",
    published_year: "",
    num_pages: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Quản lý thư viện";
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const booksResponse = await axios.get("http://localhost:8000/book/");
      const totalBooks =
        booksResponse.data.total_books || booksResponse.data.books.length;

      const usersResponse = await axios.get("http://localhost:8000/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const totalUsers = usersResponse.data.length || 0;

      const borrowResponse = await axios.get(
        "http://localhost:8000/borrow/requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const pendingRequests = borrowResponse.data.length;

      const activeLoansResponse = await axios.get(
        "http://localhost:8000/borrow/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const activeLoans = activeLoansResponse.data.filter(
        (borrow) => borrow.status === "approved"
      ).length;

      setStats({
        totalBooks,
        totalUsers,
        activeLoans,
        pendingRequests,
      });
    } catch (error) {
      console.error("Không thể tải dữ liệu thống kê:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const dataToSubmit = {
        ...formData,
        published_year: parseInt(formData.published_year),
        num_pages: parseInt(formData.num_pages),
        average_rating: 0,
        ratings_count: 0,
      };

      await axios.post("http://localhost:8000/book/", dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowModal(false);
      setFormData({
        title: "",
        author: "",
        publisher: "",
        image_url: "",
        published_year: "",
        num_pages: "",
      });
      fetchStats();
    } catch (err) {
      setError(
        "Không thể thêm sách mới: " +
          (err.response?.data?.detail || err.message)
      );
    }
  };

  return (
    <div className="container">
      <div className="container-fluid mt-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-info d-flex justify-content-between align-items-center">
              <span>
                <strong>Xin chào, Admin!</strong> Có {stats.pendingRequests} yêu
                cầu mượn sách cần xử lý.
              </span>
              <button
                className="btn btn-success"
                onClick={() => setShowModal(true)}
              >
                <FaPlus className="me-2" />
                Thêm sách mới
              </button>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title">Tổng số sách</h6>
                    <h2>{stats.totalBooks}</h2>
                  </div>
                  <FaBook size={40} opacity={0.7} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title">Người dùng</h6>
                    <h2>{stats.totalUsers}</h2>
                  </div>
                  <FaUsers size={40} opacity={0.7} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title">Đang mượn</h6>
                    <h2>{stats.activeLoans}</h2>
                  </div>
                  <FaExchangeAlt size={40} opacity={0.7} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-danger text-white shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title">Yêu cầu mới</h6>
                    <h2>{stats.pendingRequests}</h2>
                  </div>
                  <FaClipboardList size={40} opacity={0.7} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-4 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <FaClipboardList className="text-primary mb-3" size={36} />
                <h5 className="card-title">Yêu cầu mượn sách</h5>
                <p className="card-text">
                  Quản lý các yêu cầu mượn sách từ người dùng.
                </p>
                <Link
                  to="/admin/borrow-requests"
                  className="btn btn-primary w-100"
                >
                  Xem yêu cầu mượn sách
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <FaUsers className="text-warning mb-3" size={36} />
                <h5 className="card-title">Quản lý người dùng</h5>
                <p className="card-text">
                  Quản lý thông tin người dùng trong hệ thống.
                </p>
                <Link to="/admin/user" className="btn btn-warning w-100">
                  Quản lý người dùng
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <FaChartBar className="text-info mb-3" size={36} />
                <h5 className="card-title">Thống kê</h5>
                <p className="card-text">
                  Xem báo cáo thống kê về hoạt động thư viện.
                </p>
                <Link to="/admin/stat" className="btn btn-info w-100">
                  Xem thống kê
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <FaExchangeAlt className="text-secondary mb-3" size={36} />
                <h5 className="card-title">Quản lý mượn/trả</h5>
                <p className="card-text">
                  Theo dõi và quản lý sách đang được mượn.
                </p>
                <Link to="/admin/loan" className="btn btn-secondary w-100">
                  Quản lý mượn/trả
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{
          backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent",
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm sách mới</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleAddBook}>
                <div className="mb-3">
                  <label className="form-label">Tiêu đề</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tác giả</label>
                  <input
                    type="text"
                    className="form-control"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nhà xuất bản</label>
                  <input
                    type="text"
                    className="form-control"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">URL ảnh</label>
                  <input
                    type="text"
                    className="form-control"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Năm xuất bản</label>
                  <input
                    type="number"
                    className="form-control"
                    name="published_year"
                    value={formData.published_year}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số trang</label>
                  <input
                    type="number"
                    className="form-control"
                    name="num_pages"
                    value={formData.num_pages}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddBook}
              >
                Thêm sách
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
