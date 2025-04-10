import { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Đăng ký";
  }, []);

  const [fullName, setFullName] = useState("");
  const [msv, setMsv] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const navigate = useNavigate();

  const validateForm = () => {
    if (!fullName || !msv || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
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
      full_name: fullName,
      msv,
      password,
    };

    axios
      .post(`${API_URL}/register`, userData)
      .then((res) => {
        alert("Đăng ký thành công");
        navigate("/login");
      })
      .catch((err) => {
        alert(
          err.response?.data?.detail || "Đăng ký thất bại, vui lòng thử lại."
        );
      });
  };

  return (
    <div className="mt-5 d-flex justify-content-center align-items-center">
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
            <label className="form-label">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mã sinh viên</label>
            <input
              type="text"
              className="form-control"
              value={msv}
              onChange={(e) => setMsv(e.target.value)}
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
