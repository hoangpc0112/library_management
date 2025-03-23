import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBook, FaUsers, FaExclamationTriangle } from "react-icons/fa";

const Statistics = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    overdueBooks: 0,
    mostBorrowedBooks: [],
    topBorrowers: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
    document.title = "Thống kê thư viện";
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Fetch all required data concurrently
      const [booksResponse, usersResponse, borrowResponse] = await Promise.all([
        axios.get("http://localhost:8000/book/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8000/user/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8000/borrow/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Create maps for quick lookup
      const bookMap = new Map(
        booksResponse.data.books.map((book) => [book.id, book.title])
      );
      const userMap = new Map(
        usersResponse.data.map((user) => [user.id, user.full_name])
      );

      const totalBooks =
        booksResponse.data.total_books || booksResponse.data.books.length;
      const totalUsers = usersResponse.data.length;
      const activeLoans = borrowResponse.data.filter(
        (loan) => loan.status === "approved" && !loan.actual_return_date
      );
      const overdueBooks = activeLoans.filter(
        (loan) => new Date(loan.return_date) < new Date()
      ).length;

      // Calculate most borrowed books
      const bookBorrowCount = {};
      borrowResponse.data.forEach((loan) => {
        const bookTitle = bookMap.get(loan.book_id) || "Sách không xác định";
        bookBorrowCount[bookTitle] = (bookBorrowCount[bookTitle] || 0) + 1;
      });
      const mostBorrowedBooks = Object.entries(bookBorrowCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([title, count]) => ({ title, count }));

      // Calculate top borrowers
      const userBorrowCount = {};
      borrowResponse.data.forEach((loan) => {
        const userName =
          userMap.get(loan.user_id) || "Người dùng không xác định";
        userBorrowCount[userName] = (userBorrowCount[userName] || 0) + 1;
      });
      const topBorrowers = Object.entries(userBorrowCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      setStats({
        totalBooks,
        totalUsers,
        overdueBooks,
        mostBorrowedBooks,
        topBorrowers,
      });
      setLoading(false);
    } catch (err) {
      setError(
        "Không thể tải dữ liệu thống kê: " +
          (err.message || "Lỗi không xác định")
      );
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Thống kê thư viện</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center">Đang tải dữ liệu...</div>
      ) : (
        <div className="row g-4">
          {/* Summary Cards */}
          <div className="col-md-6 col-lg-4">
            <div className="card bg-primary text-white shadow">
              <div className="card-body d-flex align-items-center">
                <FaBook size={40} className="me-3" />
                <div>
                  <h5 className="card-title">Tổng số sách</h5>
                  <h3>{stats.totalBooks}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card bg-success text-white shadow">
              <div className="card-body d-flex align-items-center">
                <FaUsers size={40} className="me-3" />
                <div>
                  <h5 className="card-title">Tổng người dùng</h5>
                  <h3>{stats.totalUsers}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card bg-danger text-white shadow">
              <div className="card-body d-flex align-items-center">
                <FaExclamationTriangle size={40} className="me-3" />
                <div>
                  <h5 className="card-title">Sách quá hạn</h5>
                  <h3>{stats.overdueBooks}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header">
                <h5 className="mb-2 mt-2">Top 5 sách được mượn nhiều nhất</h5>
              </div>
              <div className="card-body">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tiêu đề sách</th>
                      <th>Số lần mượn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.mostBorrowedBooks.map((book, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{book.title}</td>
                        <td>{book.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header">
                <h5 className="mb-2 mt-2">Top 5 người mượn sách nhiều nhất</h5>
              </div>
              <div className="card-body">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên người dùng</th>
                      <th>Số lần mượn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topBorrowers.map((user, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
