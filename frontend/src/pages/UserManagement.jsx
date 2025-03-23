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
    fetchUsers();
    document.title = "Quản lý người dùng";
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải danh sách người dùng");
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
      } catch (err) {
        setError(
          "Không thể xóa người dùng: " +
            (err.response?.data?.detail || err.message)
        );
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý người dùng</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {selectedUser ? (
        <EditUserForm
          user={selectedUser}
          onCancel={() => setSelectedUser(null)}
          onSuccess={() => {
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      ) : loading ? (
        <div
          className="container text-center py-5"
          style={{ minHeight: "100vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>MSV</th>
              <th>Khoa</th>
              <th>Ngành</th>
              <th>Năm sinh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.msv}</td>
                <td>{user.faculty}</td>
                <td>{user.major}</td>
                <td>{user.birth_year}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
