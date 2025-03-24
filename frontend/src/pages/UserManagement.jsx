import React, { useState, useEffect } from "react";
import axios from "axios";
import EditUserForm from "../components/EditUser";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    document.title = "Quản lý người dùng";
    window.scrollTo(0, 0);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
        setError("");
      } catch (err) {
        setError(
          "Không thể xóa người dùng: " +
            (err.response?.data?.detail || err.message)
        );
      }
    }
  };

  return (
    <div className="container container-fluid py-4 px-3 px-md-4">
      <h2 className="mb-4 fw-bold text-center">Quản lý người dùng</h2>

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show mx-auto"
          style={{ maxWidth: "800px" }}
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {selectedUser ? (
        <div className="card mx-auto" style={{ maxWidth: "600px" }}>
          <div className="card-body">
            <EditUserForm
              user={selectedUser}
              onCancel={() => setSelectedUser(null)}
              onSuccess={() => {
                setSelectedUser(null);
                fetchUsers();
              }}
            />
          </div>
        </div>
      ) : loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-muted py-5">Không có người dùng nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col" className="text-nowrap">
                  STT
                </th>
                <th scope="col" className="text-nowrap">
                  Họ tên
                </th>
                <th scope="col" className="text-nowrap">
                  Email
                </th>
                <th scope="col" className="text-nowrap">
                  MSV
                </th>
                <th scope="col" className="text-nowrap">
                  Khoa
                </th>
                <th scope="col" className="text-nowrap">
                  Ngành
                </th>
                <th scope="col" className="text-nowrap">
                  Năm sinh
                </th>
                <th scope="col" className="text-nowrap">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td className="text-nowrap">{index + 1}</td>
                  <td
                    className="text-nowrap text-truncate"
                    style={{ maxWidth: "150px" }}
                  >
                    {user.full_name || "N/A"}
                  </td>
                  <td
                    className="text-nowrap text-truncate"
                    style={{ maxWidth: "200px" }}
                    title={user.email}
                  >
                    {user.email || "N/A"}
                  </td>
                  <td className="text-nowrap">{user.msv || "N/A"}</td>
                  <td
                    className="text-nowrap text-truncate"
                    style={{ maxWidth: "150px" }}
                  >
                    {user.faculty || "N/A"}
                  </td>
                  <td
                    className="text-nowrap text-truncate"
                    style={{ maxWidth: "150px" }}
                  >
                    {user.major || "N/A"}
                  </td>
                  <td className="text-nowrap">{user.birth_year || "N/A"}</td>
                  <td className="text-nowrap">
                    <div className="d-flex gap-2 flex-column flex-sm-row">
                      <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => handleEdit(user)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm w-100"
                        onClick={() => handleDelete(user.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
