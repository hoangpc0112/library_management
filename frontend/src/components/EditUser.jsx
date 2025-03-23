import React, { useState, useEffect } from "react";
import axios from "axios";

const EditUserForm = ({ user, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    msv: "",
    faculty: "",
    major: "",
    birth_year: "",
    is_admin: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        msv: user.msv || "",
        faculty: user.faculty || "",
        major: user.major || "",
        birth_year: user.birth_year || "",
        is_admin: user.is_admin || false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

      // Convert number fields
      const dataToSubmit = {
        ...formData,
        birth_year: parseInt(formData.birth_year, 10),
      };

      await axiosInstance.put(
        `http://localhost:8000/user/${user.id}`,
        dataToSubmit
      );

      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.detail ||
          "Có lỗi xảy ra khi cập nhật thông tin người dùng. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="mb-4">Chỉnh sửa thông tin người dùng</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="full_name" className="form-label">
              Họ tên
            </label>
            <input
              type="text"
              className="form-control"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="msv" className="form-label">
              MSV
            </label>
            <input
              type="text"
              className="form-control"
              id="msv"
              name="msv"
              value={formData.msv}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="faculty" className="form-label">
              Khoa
            </label>
            <input
              type="text"
              className="form-control"
              id="faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="major" className="form-label">
              Ngành
            </label>
            <input
              type="text"
              className="form-control"
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="birth_year" className="form-label">
                Năm sinh
              </label>
              <input
                type="number"
                className="form-control"
                id="birth_year"
                name="birth_year"
                value={formData.birth_year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="is_admin" className="form-label">
                Admin
              </label>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="is_admin"
                  name="is_admin"
                  checked={formData.is_admin}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="is_admin">
                  Có quyền admin
                </label>
              </div>
            </div>
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

export default EditUserForm;
