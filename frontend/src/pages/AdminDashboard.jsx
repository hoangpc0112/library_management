import React, { useState, useEffect, useCallback } from "react";
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
    gg_drive_link: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/borrow/stats/counts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Quản lý thư viện";
    fetchStats();
  }, [fetchStats]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBook = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const dataToSubmit = {
          ...formData,
          published_year: formData.published_year
            ? parseInt(formData.published_year, 10)
            : null,
          num_pages: formData.num_pages
            ? parseInt(formData.num_pages, 10)
            : null,
          average_rating: 0,
          ratings_count: 0,
          gg_drive_link: formData.gg_drive_link || null,
        };

        await axios.post(`${API_URL}/book/`, dataToSubmit, {
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
          gg_drive_link: "",
        });
        setError(null);
        fetchStats();
      } catch (err) {
        setError(
          "Không thể thêm sách mới: " +
            (err.response?.data?.detail || err.message)
        );
      } finally {
        setLoading(false);
      }
    },
    [formData, token, fetchStats]
  );

  const StatCard = ({ title, value, Icon, bgColor }) => (
    <div className="col-md-3 col-sm-6">
      <div className={`card ${bgColor} text-white shadow-sm mb-4 rounded-3`}>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6 className="card-title mb-1">{title}</h6>
            <h2 className="mb-0">{value}</h2>
          </div>
          <Icon size={40} opacity={0.7} />
        </div>
      </div>
    </div>
  );

  const ActionCard = ({ title, description, Icon, link, btnClass }) => (
    <div className="col-md-4 col-lg-3 col-sm-6">
      <div className="card shadow-sm h-100 rounded-3">
        <div className="card-body text-center">
          <Icon className={`mb-3 text-${btnClass.split("-")[1]}`} size={36} />
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{description}</p>
          <Link to={link} className={`btn ${btnClass} w-100`}>
            {title}
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="mb-4">
        <div className="alert alert-info d-flex justify-content-between align-items-center rounded-3">
          <span>
            <strong>Xin chào, Admin!</strong> Có {stats.pending_requests} yêu
            cầu mượn sách đang cần xử lý.
          </span>
          <button
            className="btn btn-success px-3"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            <FaPlus className="me-2" />
            Thêm sách mới
          </button>
        </div>
      </div>

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show mx-auto rounded-3"
          style={{ maxWidth: "800px" }}
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          />
        </div>
      )}

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row mb-5">
            <StatCard
              title="Tổng số sách"
              value={stats.total_books}
              Icon={FaBook}
              bgColor="bg-primary"
            />
            <StatCard
              title="Người dùng"
              value={stats.total_users}
              Icon={FaUsers}
              bgColor="bg-success"
            />
            <StatCard
              title="Đang mượn"
              value={stats.active_loans}
              Icon={FaExchangeAlt}
              bgColor="bg-warning"
            />
            <StatCard
              title="Yêu cầu mới"
              value={stats.pending_requests}
              Icon={FaClipboardList}
              bgColor="bg-danger"
            />
          </div>

          <div className="row g-4">
            <ActionCard
              title="Yêu cầu mượn sách"
              description="Quản lý các yêu cầu mượn sách từ người dùng."
              Icon={FaClipboardList}
              link="/admin/borrow-requests"
              btnClass="btn-primary"
            />
            <ActionCard
              title="Quản lý người dùng"
              description="Quản lý thông tin người dùng trong hệ thống."
              Icon={FaUsers}
              link="/admin/user"
              btnClass="btn-warning"
            />
            <ActionCard
              title="Thống kê"
              description="Xem báo cáo thống kê về hoạt động thư viện."
              Icon={FaChartBar}
              link="/admin/stat"
              btnClass="btn-info"
            />
            <ActionCard
              title="Quản lý mượn/trả"
              description="Theo dõi và quản lý sách đang được mượn."
              Icon={FaExchangeAlt}
              link="/admin/loan"
              btnClass="btn-secondary"
            />
          </div>
        </>
      )}

      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{
          backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent",
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-3">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Thêm sách mới</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                disabled={loading}
              />
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show rounded-3">
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError(null)}
                  />
                </div>
              )}
              <form onSubmit={handleAddBook}>
                {[
                  { label: "Tiêu đề", name: "title", required: true },
                  { label: "Tác giả", name: "author", required: true },
                  { label: "Nhà xuất bản", name: "publisher", required: true },
                  { label: "URL ảnh", name: "image_url" },
                  {
                    label: "Năm xuất bản",
                    name: "published_year",
                    type: "number",
                  },
                  { label: "Số trang", name: "num_pages", type: "number" },
                  { label: "Google Drive Link", name: "gg_drive_link" },
                ].map(({ label, name, type = "text", required = false }) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label fw-medium">{label}</label>
                    <input
                      type={type}
                      className="form-control rounded-pill"
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      required={required}
                      placeholder={`Nhập ${label.toLowerCase()}`}
                      disabled={loading}
                    />
                  </div>
                ))}
              </form>
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-secondary rounded-pill px-3"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-primary rounded-pill px-3"
                onClick={handleAddBook}
                disabled={loading}
              >
                {loading ? "Đang thêm..." : "Thêm sách"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
