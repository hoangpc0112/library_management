import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BorrowedPage = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState({});

  useEffect(() => {
    document.title = "Sách đang mượn";
    fetchBorrowedBooks();
  }, []);

  const calculateRemainingDays = (returnDate) => {
    if (!returnDate) return "N/A";

    const today = new Date();
    const returnDay = new Date(returnDate);
    const timeDifference = returnDay.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return daysDifference;
  };

  const getStatusBadge = (status, remainingDays) => {
    if (status === "pending") {
      return <span className="badge bg-warning text-dark">Chờ phê duyệt</span>;
    } else if (status === "approved") {
      if (remainingDays < 0) {
        return (
          <span className="badge bg-danger">
            Quá hạn {Math.abs(remainingDays)} ngày
          </span>
        );
      } else if (remainingDays <= 3) {
        return <span className="badge bg-warning text-dark">Sắp đến hạn</span>;
      } else {
        return <span className="badge bg-success">Đang mượn</span>;
      }
    } else if (status === "rejected") {
      return <span className="badge bg-danger">Đã từ chối</span>;
    } else if (status === "returned") {
      return <span className="badge bg-secondary">Đã trả</span>;
    }
    return <span className="badge bg-light text-dark">Không xác định</span>;
  };

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Bạn cần đăng nhập để xem sách đang mượn");
      }

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const borrowsResponse = await axiosInstance.get(
        "http://localhost:8000/borrow/"
      );

      const bookPromises = borrowsResponse.data.map((borrow) =>
        axiosInstance.get(`http://localhost:8000/book/${borrow.book_id}`)
      );

      const bookResponses = await Promise.all(bookPromises);
      const bookData = {};

      bookResponses.forEach((response, index) => {
        bookData[borrowsResponse.data[index].book_id] = response.data;
      });

      setBooks(bookData);
      setBorrowedBooks(borrowsResponse.data);
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
  };

  const handleReturnBook = async (borrowId) => {
    if (window.confirm("Bạn có chắc chắn muốn trả sách này không?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Bạn cần đăng nhập để trả sách");
        }

        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await axiosInstance.put(
          `http://localhost:8000/borrow/${borrowId}/return`
        );
        alert("Sách đã được trả thành công!");
        fetchBorrowedBooks();
      } catch (err) {
        console.error("Lỗi khi trả sách:", err);
        alert(
          err.response?.data?.detail ||
            "Có lỗi xảy ra khi trả sách. Vui lòng thử lại sau."
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
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
          <Link to="/" className="btn btn-primary mt-2">
            Duyệt sách
          </Link>
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 row-cols-xl-5 g-3">
          {borrowedBooks.map((borrow) => {
            const book = books[borrow.book_id];
            if (!book) return null;

            const remainingDays = calculateRemainingDays(borrow.return_date);

            return (
              <div className="col" key={borrow.id}>
                <div className="card h-100 shadow-sm">
                  <div className="position-relative">
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="card-img-top"
                      style={{ height: "360px", objectFit: "cover" }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      {getStatusBadge(borrow.status, remainingDays)}
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title" title={book.title}>
                      {book.title.length > 40
                        ? book.title.slice(0, 36) + "..."
                        : book.title}
                    </h5>
                    <p className="card-text text-muted mb-1">{book.author}</p>

                    <div className="mt-3">
                      {borrow.status === "approved" && (
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Thời gian còn lại:</span>
                          <span
                            className={`fw-bold ${
                              remainingDays < 0
                                ? "text-danger"
                                : remainingDays <= 3
                                ? "text-warning"
                                : "text-success"
                            }`}
                          >
                            {remainingDays < 0
                              ? `Quá hạn ${Math.abs(remainingDays)} ngày`
                              : `${remainingDays} ngày`}
                          </span>
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Ngày mượn:</span>
                        <span>
                          {new Date(borrow.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>

                      {borrow.borrow_date && (
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Ngày nhận sách:</span>
                          <span>
                            {new Date(borrow.borrow_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      )}

                      {borrow.return_date && (
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Hạn trả:</span>
                          <span>
                            {new Date(borrow.return_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="card-footer border-top-0">
                    <div className="d-flex justify-content-between gap-2">
                      <Link
                        to={`/book/${book.id}`}
                        className="btn btn-outline-primary flex-grow-1"
                      >
                        Xem chi tiết
                      </Link>

                      {borrow.status === "approved" && (
                        <button
                          onClick={() => handleReturnBook(borrow.id)}
                          className="btn btn-success flex-grow-1"
                        >
                          Trả sách
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BorrowedPage;
