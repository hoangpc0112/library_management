import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaBook, FaUsers, FaExclamationTriangle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Statistics = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    overdueBooks: 0,
    mostBorrowedBooks: [],
    topBorrowers: [],
    activeBorrowedBooks: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/borrow/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setStats({
        totalBooks: data.total_books || 0,
        totalUsers: data.total_users || 0,
        overdueBooks: data.overdue_books || 0,
        mostBorrowedBooks: Array.isArray(data.most_borrowed_books)
          ? data.most_borrowed_books
          : [],
        topBorrowers: Array.isArray(data.top_borrowers)
          ? data.top_borrowers
          : [],
        activeBorrowedBooks: data.active_borrowed_books || 0,
      });
      setError(null);
    } catch (err) {
      setError(
        "Không thể tải dữ liệu thống kê: " +
          (err.response?.data?.detail || err.message || "Lỗi không xác định")
      );
      setStats({
        totalBooks: 0,
        totalUsers: 0,
        overdueBooks: 0,
        mostBorrowedBooks: [],
        topBorrowers: [],
        activeBorrowedBooks: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    document.title = "Thống kê thư viện";
    window.scrollTo(0, 0);
    fetchStats();
  }, [fetchStats]);

  const StatCard = ({ title, value, Icon, bgColor }) => (
    <div className="col-md-6 col-lg-3">
      <div
        className={`card ${bgColor} shadow-lg rounded-3 mb-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
        style={{ border: "none" }}
      >
        <div className="card-body d-flex align-items-center p-3">
          <Icon size={48} className="me-3" />
          <div>
            <h6
              className="card-title mb-1 fw-semibold"
              style={{ fontSize: "1rem" }}
            >
              {title}
            </h6>
            <h3 className="mb-0 fw-bold" style={{ fontSize: "2rem" }}>
              {value}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );

  const StatTable = ({ title, data = [], headers, keyMap }) => (
    <div className="col-md-6">
      <div className="card shadow-lg rounded-3 mb-4 transition-all duration-300 hover:shadow-xl">
        <div className="card-header border-0 py-3">
          <h5 className="fw-bold text-center m-0">{title}</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover mb-0 align-middle text-center">
              <thead className="bg-primary">
                <tr className="align-middle">
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="py-3"
                      style={{
                        fontWeight: "600",
                        fontSize: "0.95rem",
                        borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr
                      key={index}
                      className="transition-all duration-200 hover:bg-gray-100"
                    >
                      <td className="py-3 fw-medium" style={{ width: "10%" }}>
                        {index + 1}
                      </td>
                      <td
                        className="py-3"
                        style={{ width: "70%", fontSize: "0.9rem" }}
                      >
                        {item[keyMap[1]] || "N/A"}
                      </td>
                      <td className="py-3 fw-medium" style={{ width: "20%" }}>
                        {item[keyMap[2]] || "0"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-4">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center fw-bold">Thống kê thư viện</h2>

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show mx-auto rounded-3 shadow-sm"
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
        <div>
          <div className="row g-4 mb-5">
            <StatCard
              title="Tổng số sách"
              value={stats.totalBooks}
              Icon={FaBook}
              bgColor="bg-primary"
            />
            <StatCard
              title="Tổng người dùng"
              value={stats.totalUsers}
              Icon={FaUsers}
              bgColor="bg-success"
            />
            <StatCard
              title="Sách quá hạn"
              value={stats.overdueBooks}
              Icon={FaExclamationTriangle}
              bgColor="bg-danger"
            />
            <StatCard
              title="Sách đang được mượn"
              value={stats.activeBorrowedBooks}
              Icon={FaBook}
              bgColor="bg-secondary"
            />
          </div>
          <div className="row g-4">
            <StatTable
              title="Top 5 sách được mượn nhiều nhất tháng"
              data={stats.mostBorrowedBooks}
              headers={["STT", "Tiêu đề sách", "Số lần mượn"]}
              keyMap={["", "title", "count"]}
            />
            <StatTable
              title="Top 5 người mượn sách nhiều nhất tháng"
              data={stats.topBorrowers}
              headers={["STT", "Tên người dùng", "Số lần mượn"]}
              keyMap={["", "name", "count"]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
