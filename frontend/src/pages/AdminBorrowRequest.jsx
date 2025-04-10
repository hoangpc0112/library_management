import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AdminBorrowRequest = () => {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const token = localStorage.getItem("token");

  const fetchBorrowRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/borrow/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrowRequests(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Không thể tải danh sách yêu cầu mượn sách. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Quản lý yêu cầu mượn sách";
    fetchBorrowRequests();
  }, [fetchBorrowRequests]);

  const handleAction = useCallback(
    async (id, action) => {
      try {
        await axios.put(
          `${API_URL}/borrow/${id}/${action}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
    },
    [fetchBorrowRequests, token]
  );

  const formatDateTime = (dateTimeString) =>
    dateTimeString ? new Date(dateTimeString).toLocaleString("vi-VN") : "N/A";

  const RequestTable = ({ requests }) => (
    <div className="table-responsive">
      <table className="table table-striped table-bordered table-hover align-middle text-center">
        <thead>
          <tr>
            <th scope="col">Mã SV</th>
            <th scope="col">Tên người mượn</th>
            <th scope="col">Tên sách</th>
            <th scope="col">Ngày tạo</th>
            <th scope="col">Ngày mượn</th>
            <th scope="col">Ngày trả</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.user?.msv || "N/A"}</td>
              <td className="text-truncate" style={{ maxWidth: "150px" }}>
                {request.user?.full_name || "N/A"}
              </td>
              <td
                className="text-truncate"
                style={{ maxWidth: "200px" }}
                title={request.book?.title}
              >
                {request.book?.title || "N/A"}
              </td>
              <td>{formatDateTime(request.created_at)}</td>
              <td>{formatDateTime(request.borrow_date)}</td>
              <td>{formatDateTime(request.return_date)}</td>
              <td>
                <div className="d-flex gap-2 flex-column flex-sm-row">
                  <button
                    className="btn btn-success btn-sm w-100"
                    onClick={() => handleAction(request.id, "approve")}
                    disabled={loading}
                  >
                    Chấp thuận
                  </button>
                  <button
                    className="btn btn-danger btn-sm w-100"
                    onClick={() => handleAction(request.id, "reject")}
                    disabled={loading}
                  >
                    Từ chối
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container py-4 px-3 px-md-4">
      <h1 className="mb-4 text-center fw-bold">Quản lý yêu cầu mượn sách</h1>

      {message && (
        <div
          className="alert alert-success alert-dismissible fade show mx-auto"
          style={{ maxWidth: "800px" }}
        >
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage(null)}
          />
        </div>
      )}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show mx-auto"
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
      ) : borrowRequests.length === 0 ? (
        <p className="text-center text-muted py-5">Không có yêu cầu nào.</p>
      ) : (
        <RequestTable requests={borrowRequests} />
      )}
    </div>
  );
};

export default AdminBorrowRequest;
