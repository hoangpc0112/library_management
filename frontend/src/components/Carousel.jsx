import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Carousel = ({ title, endpoint }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(endpoint);
        setBooks(response.data.books);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching books from ${endpoint}:`, error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [endpoint]);

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

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
        <span className="rating-number">({rating})</span>
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

  return (
    <div className="container">
      <div className="mb-5">
        <h2 className="mt-4 mb-4">{title}</h2>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={6}
          loop={true}
          navigation
          pagination={false}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="mySwiper"
        >
          {books.map((book) => (
            <SwiperSlide key={book.id}>
              <div className="book-card">
                <Link to={`/book/${book.id}`} className="text-decoration-none">
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
                            {book.published_year}
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
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel;
