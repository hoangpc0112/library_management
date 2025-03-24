import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminBorrowRequest = () => {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Quản lý yêu cầu mượn sách";
    fetchBorrowRequests();
  }, []);

  const fetchBorrowRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/borrow/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const requestsWithDetails = await Promise.all(
        response.data.map(async (request) => {
          const bookResponse = await axios.get(
            `${API_URL}/book/${request.book_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const userResponse = await axios.get(
            `${API_URL}/user/${request.user_id}`,
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
        `${API_URL}/borrow/${id}/${action}`,
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
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return (
      dateTime.toLocaleDateString("vi-VN") +
      " " +
      dateTime.toLocaleTimeString("vi-VN")
    );
  };

  return (
    <div className="container container-fluid py-4 px-3 px-md-4">
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
          ></button>
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
      ) : borrowRequests.length === 0 ? (
        <p className="text-center text-muted py-5">Không có yêu cầu nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th scope="col" className="text-nowrap">
                  Mã SV
                </th>
                <th scope="col" className="text-nowrap">
                  Tên người mượn
                </th>
                <th scope="col" className="text-nowrap">
                  Tên sách
                </th>
                <th scope="col" className="text-nowrap">
                  Ngày tạo
                </th>
                <th scope="col" className="text-nowrap">
                  Ngày mượn
                </th>
                <th scope="col" className="text-nowrap">
                  Ngày trả
                </th>
                <th scope="col" className="text-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {borrowRequests.map((request) => (
                <tr key={request.id}>
                  <td className="text-nowrap">{request.user.msv || "N/A"}</td>
                  <td
                    className="text-nowrap text-truncate"
                    style={{ maxWidth: "150px" }}
                  >
                    {request.user.full_name || "N/A"}
                  </td>
                  <td
                    className="text-nowrap text-truncate"
                    style={{ maxWidth: "200px" }}
                    title={request.book.title}
                  >
                    {request.book.title || "N/A"}
                  </td>
                  <td className="text-nowrap">
                    {formatDateTime(request.created_at)}
                  </td>
                  <td className="text-nowrap">
                    {formatDate(request.borrow_date)}
                  </td>
                  <td className="text-nowrap">
                    {formatDate(request.return_date)}
                  </td>
                  <td className="text-nowrap">
                    <div className="d-flex gap-2 flex-column flex-sm-row">
                      <button
                        className="btn btn-success btn-sm w-100"
                        onClick={() => handleAction(request.id, "approve")}
                      >
                        Chấp thuận
                      </button>
                      <button
                        className="btn btn-danger btn-sm w-100"
                        onClick={() => handleAction(request.id, "reject")}
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
      )}
    </div>
  );
};

export default AdminBorrowRequest;
