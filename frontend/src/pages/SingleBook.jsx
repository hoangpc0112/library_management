import React, { useState, useEffect, use } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SingleBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/book/${id}`);
        setBook(response.data);
        setError(false);
      } catch (err) {
        setError(true);
        console.error("Lỗi khi lấy thông tin sách:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    if (book?.title) {
      document.title = book.title;
    } else {
      document.title = "Loading...";
    }
  }, [book?.title]);

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
                    maxHeight: "500px",
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
              <button className="btn btn-primary">Mượn sách</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
