import React, { useState, useEffect } from "react";
import axios from "axios";

const EditBookForm = ({ book, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    image_url: "",
    publisher: "",
    published_year: "",
    num_pages: "",
    gg_drive_link: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        image_url: book.image_url || "",
        publisher: book.publisher || "",
        published_year: book.published_year || "",
        num_pages: book.num_pages || "",
        gg_drive_link: book.gg_drive_link || "",
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataToSubmit = {
        ...formData,
        published_year: formData.published_year
          ? parseInt(formData.published_year, 10)
          : null,
        num_pages: formData.num_pages ? parseInt(formData.num_pages, 10) : null,
      };

      await axiosInstance.put(`${API_URL}/book/${book.id}`, dataToSubmit);

      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.detail ||
          "Có lỗi xảy ra khi cập nhật thông tin sách. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="mb-4">Chỉnh sửa thông tin sách</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Tiêu đề
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="author" className="form-label">
              Tác giả
            </label>
            <input
              type="text"
              className="form-control"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="image_url" className="form-label">
              URL Hình ảnh
            </label>
            <input
              type="text"
              className="form-control"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="publisher" className="form-label">
              Nhà xuất bản
            </label>
            <input
              type="text"
              className="form-control"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="published_year" className="form-label">
                Năm xuất bản
              </label>
              <input
                type="number"
                className="form-control"
                id="published_year"
                name="published_year"
                value={formData.published_year}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="num_pages" className="form-label">
                Số trang
              </label>
              <input
                type="number"
                className="form-control"
                id="num_pages"
                name="num_pages"
                value={formData.num_pages}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="gg_drive_link" className="form-label">
              Google Drive Link
            </label>
            <input
              type="text"
              className="form-control"
              id="gg_drive_link"
              name="gg_drive_link"
              value={formData.gg_drive_link}
              onChange={handleChange}
              placeholder="Nhập link Google Drive"
            />
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookForm;
