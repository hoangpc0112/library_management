import { useEffect } from "react";
import Carousel from "../components/Carousel";
import "../css/HomePage.css";
import SearchInput from "../components/SearchInput";
import BookList from "../components/BookList";

const HomePage = () => {
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Trang chủ - Thư viện PTIT";
  }, []);

  return (
    <div>
      <div className="py-5 text-center bg-body-secondary bg-custom">
        <div className="content">
          <img
            className="d-block mx-auto mb-4"
            src="https://cdn-icons-png.flaticon.com/512/5402/5402751.png"
            alt="Book icon"
            width="72"
            height="57"
          />
          <h1 className="display-5 fw-bold">Chào mừng đến với Thư viện PTIT</h1>
          <div className="col-lg-6 mx-auto">
            <p className="lead">
              Thư viện của Học viện Công nghệ Bưu chính Viễn thông (PTIT) là một
              trung tâm thông tin và tài liệu quan trọng, phục vụ nhu cầu học
              tập, nghiên cứu và giảng dạy của sinh viên, giảng viên và cán bộ
              của Học viện. Thư viện cung cấp một kho tài liệu phong phú, bao
              gồm sách, tạp chí, luận văn, và các tài liệu điện tử. Ngoài ra,
              thư viện còn có các dịch vụ hỗ trợ như tra cứu tài liệu trực
              tuyến, mượn tài liệu, và không gian học tập hiện đại.
            </p>
          </div>
        </div>
      </div>
      <SearchInput />
      <Carousel
        title="Được yêu thích hàng đầu"
        endpoint={`${API_URL}/book/?page=1&size=10&sort=average_rating&order=desc`}
      />
      <hr className="container border-2" />
      <Carousel
        title="Đang thịnh hành"
        endpoint={`${API_URL}/recommendation/trending`}
      />
      <hr className="container border-2" />
      <h2 className="container mb-4">Gợi ý cho bạn</h2>
      {token ? (
        <BookList apiEndpoint="recommendation/user" />
      ) : (
        <BookList apiEndpoint="book" />
      )}
    </div>
  );
};

export default HomePage;
