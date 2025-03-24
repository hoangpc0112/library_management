import React, { useState, useEffect } from "react";
import axios from "axios";

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    document.title = "Quản lý mượn/trả";
    window.scrollTo(0, 0);
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/borrow/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const approvedLoans = response.data.filter(
        (loan) => loan.status === "approved" && !loan.actual_return_date
      );

      const enrichedLoans = await Promise.all(
        approvedLoans.map(async (loan) => {
          const [userResponse, bookResponse] = await Promise.all([
            axios.get(`${API_URL}/user/${loan.user_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/book/${loan.book_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          return {
            ...loan,
            user: userResponse.data,
            book: bookResponse.data,
          };
        })
      );

      setLoans(enrichedLoans);
      setError("");
    } catch (err) {
      setError(
        "Không thể tải danh sách sách đang mượn: " +
          (err.message || "Lỗi không xác định")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm("Bạn có chắc muốn xác nhận trả sách này?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${API_URL}/borrow/${id}/return`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.status === "returned") {
          fetchLoans();
          setError("");
        }
      } catch (err) {
        setError(
          "Không thể cập nhật trạng thái trả sách: " +
            (err.response?.data?.detail || err.message)
        );
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="container container-fluid py-4 px-3 px-md-4">
      <h2 className="mb-4 fw-bold text-center">Quản lý mượn/trả</h2>

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show mx-auto"
          style={{ maxWidth: "800px" }}
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
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
          <table className="table table-striped table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th scope="col" className="text-nowrap">
                  STT
                </th>
                <th scope="col" className="text-nowrap">
                  Người mượn
                </th>
                <th scope="col" className="text-nowrap">
                  Sách
                </th>
                <th scope="col" className="text-nowrap">
                  Ngày mượn
                </th>
                <th scope="col" className="text-nowrap">
                  Ngày trả dự kiến
                </th>
                <th scope="col" className="text-nowrap">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={loan.id}>
                  <td className="text-nowrap">{index + 1}</td>
                  <td
                    className="text-nowrap text-truncate"
                    style={{ maxWidth: "150px" }}
                  >
                    {loan.user?.full_name || "N/A"}
                  </td>
                  <td
                    className="text-nowrap text-truncate"
                    style={{ maxWidth: "200px" }}
                    title={loan.book?.title}
                  >
                    {loan.book?.title || "N/A"}
                  </td>
                  <td className="text-nowrap">
                    {formatDate(loan.borrow_date)}
                  </td>
                  <td className="text-nowrap">
                    {formatDate(loan.return_date)}
                  </td>
                  <td className="text-nowrap">
                    <button
                      className="btn btn-primary btn-sm w-100"
                      onClick={() => handleReturn(loan.id)}
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
