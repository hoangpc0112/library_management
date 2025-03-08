import { useState } from "react";
import logo from "../assets/images/logo.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    axios
      .post("http://localhost:8000/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công",
          showConfirmButton: false,
          timer: 1500,
        });
        localStorage.setItem("token", res.data.access_token);
        navigate("/");
      })
      .catch((err) => {
        console.error("Login error:", err);
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <div className="mt-5 d-flex justify-content-center align-items-center">
      <title>Đăng nhập</title>
      <div className="p-4" style={{ width: "350px" }}>
        <img
          src={logo}
          alt="Logo"
          width={90}
          height={90}
          className="justify-content-center d-block mx-auto"
        />
        <h5 className="text-center fw-light mb-0">Đăng nhập</h5>
        <h3 className="text-center mb-4">PTIT Library</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tài khoản</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Ghi nhớ
              </label>
            </div>
            <a href="#" className="text-primary text-decoration-none">
              Quên mật khẩu ?
            </a>
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Đăng nhập
          </button>
          <div className="text-center">
            <span>Chưa có tài khoản? </span>
            <Link to="/register" className="text-primary text-decoration-none">
              Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
