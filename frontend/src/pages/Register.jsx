import { useState } from "react";
import logo from "../assets/images/logo.png";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      return false;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    const userData = {
      email,
      password,
    };

    axios
      .post("http://localhost:8000/register", userData)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Đăng ký thành công",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      })
      .catch((err) => {
        console.error("Register error:", err);
        if (err.response?.status === 409) {
          setError("Email đã được sử dụng, vui lòng chọn email khác.");
        } else {
          setError(
            err.response?.data?.detail || "Đăng ký thất bại, vui lòng thử lại."
          );
        }
      });
  };

  return (
    <div className="mt-5 d-flex justify-content-center align-items-center">
      <title>Đăng ký</title>
      <div className="p-4" style={{ width: "450px" }}>
        <img
          src={logo}
          alt="Logo"
          width={90}
          height={90}
          className="justify-content-center d-block mx-auto"
        />
        <h5 className="text-center fw-light mb-0">Đăng ký</h5>
        <h3 className="text-center mb-4">PTIT Library</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Đăng ký
          </button>
          <div className="text-center">
            <span>Đã có tài khoản? </span>
            <Link to="/login" className="text-primary text-decoration-none">
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
