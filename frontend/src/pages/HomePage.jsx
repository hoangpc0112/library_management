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
            width="80px"
            height="80px"
          />
          <h1 className="display-5 fw-bold text-white">PTIT Library</h1>
          <p className="col-lg-6 col-md-5 mx-auto fs-5 p-2 text-white">
            Hệ thống thư viện trực tuyến của Học viện Công nghệ Bưu chính Viễn
            thông
          </p>
        </div>
      </div>

      <SearchInput />

      <section className="container my-5">
        <Carousel
          title="Được yêu thích hàng đầu"
          endpoint={`${API_URL}/book/?page=1&size=10&sort=average_rating&order=desc`}
        />
      </section>

      <hr className="container border-2 my-5" />

      <section className="container my-5">
        <Carousel
          title="Đang thịnh hành"
          endpoint={`${API_URL}/recommendation/trending`}
        />
      </section>

      <hr className="container border-2 my-5" />

      <section className="container my-5">
        <h2 className="mb-4 text-center text-md-start">Gợi ý cho bạn</h2>
        {token ? (
          <BookList apiEndpoint="recommendation/user" />
        ) : (
          <BookList apiEndpoint="book" />
        )}
      </section>
    </div>
  );
};

export default HomePage;
