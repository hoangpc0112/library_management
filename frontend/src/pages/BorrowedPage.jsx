import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const BorrowedPage = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBorrowedBooks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Bạn cần đăng nhập để xem sách đang mượn");
      }

      const axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await axiosInstance.get(`${API_URL}/borrow/`);
      setBorrowedBooks(response.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin sách đang mượn:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Có lỗi xảy ra khi lấy thông tin sách đang mượn. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Sách đang mượn";
    fetchBorrowedBooks();
  }, [fetchBorrowedBooks]);

  const calculateRemainingDays = useCallback((returnDate) => {
    if (!returnDate) return "N/A";
    const today = new Date();
    const returnDay = new Date(returnDate);
    const timeDifference = returnDay - today;
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }, []);

  const getStatusBadge = useCallback((status, remainingDays) => {
    const statusMap = {
      pending: (
        <span className="badge bg-warning text-dark">Chờ phê duyệt</span>
      ),
      approved:
        remainingDays < 0 ? (
          <span className="badge bg-danger">Quá hạn</span>
        ) : remainingDays <= 3 ? (
          <span className="badge bg-warning text-dark">Sắp đến hạn</span>
        ) : (
          <span className="badge bg-success">Đang mượn</span>
        ),
      rejected: <span className="badge bg-danger">Đã từ chối</span>,
      returned: <span className="badge bg-secondary">Đã trả</span>,
    };
    return (
      statusMap[status] || (
        <span className="badge bg-light text-dark">Không xác định</span>
      )
    );
  }, []);

  const bookCardRenderer = useMemo(() => {
    return borrowedBooks.map((borrow) => {
      const book = borrow.book;
      if (!book) return null;

      const remainingDays = calculateRemainingDays(borrow.return_date);

      return (
        <div className="col" key={borrow.id}>
          <Link
            to={`/book/${book.id}`}
            className="card h-100 shadow-sm text-decoration-none"
            style={{ maxWidth: "200px" }}
          >
            <div className="position-relative">
              <img
                src={book.image_url}
                alt={book.title}
                className="card-img-top"
                style={{
                  minHeight: "200px",
                  height: "240px",
                  objectFit: "cover",
                }}
                loading="lazy"
              />
              <div className="position-absolute top-0 end-0 m-1">
                {getStatusBadge(borrow.status, remainingDays)}
              </div>
            </div>
            <div className="card-body p-2">
              <h6 className="card-title mb-1" title={book.title}>
                {book.title.length > 20
                  ? `${book.title.slice(0, 17)}...`
                  : book.title}
              </h6>
              <p className="card-text text-muted small mb-0">{book.author}</p>
              <hr className="my-2" />
              <div className="small mt-0">
                <div className="d-flex justify-content-between mb-1">
                  <span>Ngày mượn:</span>
                  <span>
                    {new Date(
                      borrow.borrow_date || borrow.created_at
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                {borrow.return_date && (
                  <div className="d-flex justify-content-between mb-1">
                    <span>Hạn trả:</span>
                    <span>
                      {new Date(borrow.return_date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
      );
    });
  }, [borrowedBooks, calculateRemainingDays, getStatusBadge]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3">
          {[...Array(6)].map((_, index) => (
            <div className="col" key={index}>
              <div
                className="card h-100 shadow-sm"
                style={{ maxWidth: "200px" }}
              >
                <div
                  className="card-img-top bg-light"
                  style={{ height: "280px" }}
                />
                <div className="card-body p-2">
                  <div className="placeholder-glow">
                    <h6 className="card-title mb-1 placeholder col-8" />
                    <p className="card-text text-muted small mb-1 placeholder col-6" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger p-4 shadow-sm">
          <h4 className="alert-heading">Lỗi</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {borrowedBooks.length === 0 ? (
        <div className="alert alert-info p-4 shadow-sm">
          <h4 className="alert-heading">Không có sách nào</h4>
          <p>
            Bạn chưa mượn sách nào. Hãy tìm và mượn sách từ thư viện của chúng
            tôi.
          </p>
          <Link to="/book" className="btn btn-primary mt-2">
            Duyệt sách
          </Link>
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3">
          {bookCardRenderer}
        </div>
      )}
    </div>
  );
};

export default React.memo(BorrowedPage);
