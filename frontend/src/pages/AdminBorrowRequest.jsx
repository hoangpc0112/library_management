import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminBorrowRequest = () => {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBorrowRequests();
  }, []);

  const fetchBorrowRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/borrow/requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const requestsWithDetails = await Promise.all(
        response.data.map(async (request) => {
          const bookResponse = await axios.get(
            `http://localhost:8000/book/${request.book_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const userResponse = await axios.get(
            `http://localhost:8000/profile/${request.user_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return {
            ...request,
            book: bookResponse.data,
            user: userResponse.data,
          };
        })
      );
      setBorrowRequests(requestsWithDetails);
      setError(null);
    } catch (err) {
      setError(
        "Không thể tải danh sách yêu cầu mượn sách. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.put(
        `http://localhost:8000/borrow/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(
        action === "approve"
          ? "Yêu cầu mượn sách đã được chấp thuận."
          : "Yêu cầu mượn sách đã bị từ chối."
      );
      fetchBorrowRequests();
    } catch (err) {
      setError("Không thể xử lý yêu cầu. Vui lòng thử lại sau.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Quản lý yêu cầu mượn sách</h1>
      {message && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage(null)}
          ></button>
        </div>
      )}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : borrowRequests.length === 0 ? (
        <p className="text-center">Không có yêu cầu nào.</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Mã SV</th>
              <th>Tên người mượn</th>
              <th className="text-truncate" style={{ maxWidth: "200px" }}>
                Tên sách
              </th>
              <th>Ngày mượn</th>
              <th>Ngày trả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {borrowRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.user.msv || "N/A"}</td>
                <td>{request.user.full_name || "N/A"}</td>
                <td
                  className="text-truncate"
                  style={{ maxWidth: "200px" }}
                  title={request.book.title}
                >
                  {request.book.title || "N/A"}
                </td>
                <td>{formatDate(request.borrow_date)}</td>
                <td>{formatDate(request.return_date)}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleAction(request.id, "approve")}
                  >
                    Chấp thuận
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAction(request.id, "reject")}
                  >
                    Từ chối
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

export default AdminBorrowRequest;
