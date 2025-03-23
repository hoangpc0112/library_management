import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../css/Carousel.css";

const Carousel = ({ title, endpoint }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }, // Include token for protected endpoints
        });

        // Handle different response structures
        let fetchedBooks = [];
        if (Array.isArray(response.data)) {
          // For /recommendation endpoints (flat list)
          fetchedBooks = response.data;
        } else if (response.data.books && Array.isArray(response.data.books)) {
          // For /book endpoint (paginated response)
          fetchedBooks = response.data.books;
        }

        setBooks(fetchedBooks || []); // Default to empty array if no valid data
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching books from ${endpoint}:`, error);
        setError("Không thể tải sách. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, [endpoint]);

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    return (
      <div className="stars-container">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`star ${
              i < fullStars || (i === fullStars && hasHalfStar) ? "filled" : ""
            }`}
          >
            ★
          </span>
        ))}
        <span className="rating-number">({rating || "N/A"})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className="container text-center py-5"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="container text-center py-5"
        style={{ minHeight: "100vh" }}
      >
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-5 position-relative carousel-container">
        <div className="carousel-header d-flex align-items-center justify-content-between mb-3">
          <h2 className="carousel-title">{title}</h2>
          <div className="carousel-navigation-buttons d-flex">
            <button
              ref={prevRef}
              className="btn carousel-nav-btn"
              aria-label="Previous"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              ref={nextRef}
              className="btn carousel-nav-btn"
              aria-label="Next"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={6}
          loop={books.length > 1}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          pagination={false}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="mySwiper"
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            576: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            992: { slidesPerView: 4, spaceBetween: 20 },
            1200: { slidesPerView: 6, spaceBetween: 20 },
          }}
        >
          {books.length > 0 ? (
            books.map((book) => (
              <SwiperSlide key={book.id}>
                <div className="book-card">
                  <Link
                    to={`/book/${book.id}`}
                    className="text-decoration-none"
                  >
                    <div className="book-cover-container">
                      <div className="book-cover">
                        <img
                          src={book.image_url}
                          alt={`${book.title} cover`}
                          className="book-image"
                          loading="lazy"
                        />
                      </div>
                      <div className="book-overlay">
                        <div className="book-info">
                          <h3 className="book-title">{book.title}</h3>
                          <p className="book-author">by {book.author}</p>
                          <div className="book-details">
                            <div className="book-year">
                              <span className="detail-label">Published:</span>{" "}
                              {book.published_year || "N/A"}
                            </div>
                            <div className="book-rating">
                              <span className="detail-label">Rating:</span>{" "}
                              <StarRating rating={book.average_rating} />
                            </div>
                          </div>
                          <div className="view-details">View Details</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="text-center py-3">Không có sách để hiển thị.</div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel;
