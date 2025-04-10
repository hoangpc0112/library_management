import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/borrow/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Không thể tải danh sách sách đang mượn: " +
          (err.response?.data?.detail || err.message || "Lỗi không xác định")
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    document.title = "Quản lý mượn/trả";
    window.scrollTo(0, 0);
    fetchLoans();
  }, [fetchLoans]);

  const handleReturn = useCallback(
    async (id) => {
      if (window.confirm("Bạn có chắc muốn xác nhận trả sách này?")) {
        setLoading(true);
        try {
          const response = await axios.put(
            `${API_URL}/borrow/${id}/return`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.status === "returned") {
            fetchLoans();
            setError(null);
          }
        } catch (err) {
          setError(
            "Không thể cập nhật trạng thái trả sách: " +
              (err.response?.data?.detail ||
                err.message ||
                "Lỗi không xác định")
          );
        } finally {
          setLoading(false);
        }
      }
    },
    [fetchLoans, token]
  );

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("vi-VN")
      : "N/A";
  };

  const calculateRemainingTime = (returnDate) => {
    if (!returnDate) return "N/A";
    const today = new Date();
    const dueDate = new Date(returnDate);
    const timeDiff = dueDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      return (
        <span className="text-danger fw-bold">
          Quá hạn {Math.abs(daysDiff)} ngày
        </span>
      );
    }
    return `${daysDiff} ngày`;
  };

  return (
    <div className="container py-5 px-3 px-md-4">
      <h2 className="mb-5 text-center fw-bold">Quản lý mượn/trả</h2>

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
      ) : loans.length === 0 ? (
        <p className="text-center text-muted py-5">
          Không có sách nào đang mượn.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover align-middle text-center">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Người mượn</th>
                <th scope="col">Sách</th>
                <th scope="col">Ngày mượn</th>
                <th scope="col">Ngày trả dự kiến</th>
                <th scope="col">Còn lại</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={loan.id}>
                  <td>{index + 1}</td>
                  <td className="text-truncate" style={{ maxWidth: "150px" }}>
                    {loan.user?.full_name || "N/A"}
                  </td>
                  <td
                    className="text-truncate"
                    style={{ maxWidth: "200px" }}
                    title={loan.book?.title}
                  >
                    {loan.book?.title || "N/A"}
                  </td>
                  <td>{formatDate(loan.borrow_date)}</td>
                  <td>{formatDate(loan.return_date)}</td>
                  <td>{calculateRemainingTime(loan.return_date)}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm w-100"
                      onClick={() => handleReturn(loan.id)}
                      disabled={loading}
                    >
                      Xác nhận trả
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;
