import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const BorrowRequest = ({ bookId, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [borrowDate, setBorrowDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const borrowDateObj = new Date(borrowDate);
    const returnDateObj = new Date(returnDate);
    const maxBorrowTime = 30 * 24 * 60 * 60 * 1000;

    if (returnDateObj - borrowDateObj > maxBorrowTime) {
      setLoading(false);
      setError(
        "Thời gian mượn sách tối đa là 30 ngày. Vui lòng chọn ngày trả hợp lệ."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Bạn cần đăng nhập để mượn sách");
      }

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedBorrowDate = borrowDateObj.toISOString();
      const formattedReturnDate = returnDateObj.toISOString();

      await axiosInstance.post(`http://localhost:8000/borrow/${bookId}`, {
        borrow_date: formattedBorrowDate,
        return_date: formattedReturnDate,
      });

      setLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/borrowed");
      }
    } catch (err) {
      setLoading(false);
      console.error("Lỗi khi yêu cầu mượn sách:", err);
      setError(
        err.response?.data?.detail ||
          "Có lỗi xảy ra khi gửi yêu cầu mượn sách. Vui lòng thử lại sau."
      );
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setError("Bạn cần đăng nhập để mượn sách");
    }
  }, [currentUser]);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h3 className="card-title mb-4">Yêu cầu mượn sách</h3>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="borrowDate" className="form-label">
              Ngày mượn
            </label>
            <input
              type="date"
              className="form-control"
              id="borrowDate"
              value={borrowDate}
              onChange={(e) => setBorrowDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="returnDate" className="form-label">
              Ngày trả (dự kiến)
            </label>
            <input
              type="date"
              className="form-control"
              id="returnDate"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={borrowDate}
              required
            />
            <div className="form-text">Thời gian mượn tối đa là 30 ngày.</div>
          </div>
          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="agreeTerms"
                required
              />
              <label className="form-check-label" htmlFor="agreeTerms">
                Tôi đồng ý với các điều khoản mượn sách và cam kết hoàn trả đúng
                hạn
              </label>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !currentUser}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Đang xử lý...
                </>
              ) : (
                "Gửi yêu cầu"
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowRequest;
