import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import EditBook from "../components/EditBook";
import BorrowRequest from "../components/BorrowRequest";
import Carousel from "../components/Carousel";

const SingleBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isAdmin, currentUser } = useAuth();
  const [borrowStatus, setBorrowStatus] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/book/${id}`);
      setBook(response.data);
      setError(false);
    } catch (err) {
      setError(true);
      console.error("Lỗi khi lấy thông tin sách:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkBorrowStatus = async () => {
    if (!currentUser) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await axiosInstance.get(`http://localhost:8000/borrow/`);
      const userRequests = response.data.filter(
        (request) => request.book_id === parseInt(id)
      );

      const pendingRequest = userRequests.find(
        (request) => request.status === "pending"
      );
      const approvedRequest = userRequests.find(
        (request) => request.status === "approved"
      );

      if (pendingRequest) {
        setBorrowStatus("pending");
      } else if (approvedRequest) {
        setBorrowStatus("approved");
      } else {
        setBorrowStatus(null);
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra trạng thái mượn sách:", err);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      checkBorrowStatus();
    }
  }, [currentUser, id]);

  useEffect(() => {
    if (book?.title) {
      document.title = book.title;
    } else {
      document.title = "Loading...";
    }
  }, [book?.title]);

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sách này không?")) {
      try {
        setDeleteLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Không tìm thấy token xác thực");
        }

        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await axiosInstance.delete(`http://localhost:8000/book/${id}`);
        navigate(-1);
      } catch (err) {
        console.error("Lỗi khi xóa sách:", err);
        alert(
          err.response?.data?.detail ||
            "Có lỗi xảy ra khi xóa sách. Vui lòng thử lại sau."
        );
        setDeleteLoading(false);
      }
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    fetchBook();
  };

  const handleBorrow = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/book/${id}` } });
      return;
    }
    setIsBorrowing(true);
  };

  const handleBorrowSuccess = () => {
    setIsBorrowing(false);
    setBorrowStatus("pending");
    alert("Yêu cầu mượn sách đã được gửi thành công! Chờ quản lý phê duyệt.");
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container my-5">
        <div className="alert alert-danger p-4 shadow-sm">
          <h4 className="alert-heading">Lỗi khi tải sách</h4>
          <p>
            Chúng tôi không thể lấy thông tin sách vào lúc này. Vui lòng thử lại
            sau.
          </p>
        </div>
      </div>
    );

  if (isEditing) {
    return (
      <div className="container my-4">
        <EditBook
          book={book}
          onCancel={() => setIsEditing(false)}
          onSuccess={handleEditSuccess}
        />
      </div>
    );
  }

  if (isBorrowing) {
    return (
      <div className="container my-4">
        <BorrowRequest
          bookId={id}
          onCancel={() => setIsBorrowing(false)}
          onSuccess={handleBorrowSuccess}
        />
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-lg-4 col-md-5">
              <div className="position-relative">
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="img-fluid rounded shadow"
                  style={{
                    maxHeight: "600px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>

            <div className="col-lg-8 col-md-7">
              <h1 className="h2 fw-bold mb-1">{book.title}</h1>
              <p className="text-primary mb-2 h5"> {book.author}</p>
              <hr />
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Nhà xuất bản:</strong> {book.publisher}
                  </p>
                  <p>
                    <strong>Số trang:</strong> {book.num_pages}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Năm xuất bản:</strong> {book.published_year}
                  </p>
                  <p>
                    <strong>Đánh giá:</strong> {book.average_rating}/5 (
                    {book.ratings_count} đánh giá)
                  </p>
                </div>
              </div>
              <hr className="mt-0" />
              <p className="mb-2">
                <strong>{book.title}</strong> là một cuốn sách dài{" "}
                {book.num_pages} trang được xuất bản bởi {book.publisher} vào
                năm {book.published_year}. Nó được viết bởi {book.author} và đã
                nhận được đánh giá trung bình là {book.average_rating}/5 từ{" "}
                {book.ratings_count} độc giả.
              </p>
              <p>
                Cuốn sách này hoàn hảo cho những độc giả yêu thích các tác phẩm
                của {book.author} và đang tìm kiếm một cuốn sách chất lượng được
                đánh giá cao bởi độc giả.
              </p>
              <div className="d-flex justify-content-between gap-3">
                {borrowStatus === "pending" ? (
                  <button className="btn btn-secondary flex-grow-1" disabled>
                    Yêu cầu mượn đang chờ phê duyệt
                  </button>
                ) : borrowStatus === "approved" ? (
                  <button className="btn btn-success flex-grow-1" disabled>
                    Bạn đang mượn cuốn sách này
                  </button>
                ) : (
                  <button
                    onClick={handleBorrow}
                    className="btn btn-primary flex-grow-1"
                  >
                    Mượn sách
                  </button>
                )}
                {book.gg_drive_link ? (
                  <button
                    className="btn btn-secondary flex-grow-1"
                    onClick={() => window.open(book.gg_drive_link, "_blank")}
                  >
                    Xem trước
                  </button>
                ) : null}
                {isAdmin() ? (
                  <>
                    <button
                      className="btn btn-warning flex-grow-1"
                      onClick={() => setIsEditing(true)}
                    >
                      Sửa thông tin
                    </button>
                    <button
                      className="btn btn-danger flex-grow-1"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Đang xóa..." : "Xóa sách"}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
            <hr className="container border-2 mt-5" />
            <Carousel
              title="Những cuốn sách khác bạn có thể thích"
              endpoint={`http://localhost:8000/recommendation/${id}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
