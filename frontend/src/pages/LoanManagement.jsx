import React, { useState, useEffect } from "react";
import axios from "axios";

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLoans();
    document.title = "Quản lý mượn/trả";
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/borrow/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const approvedLoans = response.data.filter(
        (loan) => loan.status === "approved" && !loan.actual_return_date
      );

      const enrichedLoans = await Promise.all(
        approvedLoans.map(async (loan) => {
          const [userResponse, bookResponse] = await Promise.all([
            axios.get(`http://localhost:8000/user/${loan.user_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`http://localhost:8000/book/${loan.book_id}`, {
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
      setLoading(false);
    } catch (err) {
      setError(
        "Không thể tải danh sách sách đang mượn: " +
          (err.message || "Lỗi không xác định")
      );
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/borrow/${id}/return`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "returned") {
        fetchLoans();
      }
    } catch (err) {
      setError(
        "Không thể cập nhật trạng thái trả sách: " +
          (err.response?.data?.detail || err.message)
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý mượn/trả</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div
          className="container text-center py-5"
          style={{ minHeight: "100vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>STT</th>
              <th>Người mượn</th>
              <th>Sách</th>
              <th>Ngày mượn</th>
              <th>Ngày trả dự kiến</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <tr key={loan.id}>
                <td>{index + 1}</td>
                <td>{loan.user.full_name}</td>
                <td>{loan.book.title}</td>
                <td>{new Date(loan.borrow_date).toLocaleDateString()}</td>
                <td>{new Date(loan.return_date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleReturn(loan.id)}
                  >
                    Xác nhận trả
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoanManagement;
