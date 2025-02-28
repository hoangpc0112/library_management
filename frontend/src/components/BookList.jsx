import { Link } from "react-router-dom";
import "../css/BookCard.css";

const books = [
  {
    id: 1,
    title: "Classical Mythology",
    date: "11 Nov 2024",
    img: "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
  },
  {
    id: 2,
    title: "Modern History",
    date: "15 Dec 2024",
    img: "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
  },
  {
    id: 3,
    title: "Science & Nature",
    date: "22 Jan 2025",
    img: "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
  },
  {
    id: 4,
    title: "Ancient Civilizations",
    date: "5 Mar 2025",
    img: "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
  },
  {
    id: 5,
    title: "Philosophy & Thought",
    date: "18 Apr 2025",
    img: "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
  },
  {
    id: 6,
    title: "Fantasy World",
    date: "30 May 2025",
    img: "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
  },
  {
    id: 7,
    title: "Science Fiction",
    date: "12 Jul 2025",
    img: "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
  },
  {
    id: 8,
    title: "Mystery & Thriller",
    date: "25 Aug 2025",
    img: "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
  },
  {
    id: 9,
    title: "Romance & Drama",
    date: "7 Oct 2025",
    img: "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
  },
];

function BookList() {
  return (
    <div className="container">
      <div className="row">
        <h2 className="mb-3 mt-3 display-5 text-center">Thư viện sách</h2>
        {books.map((book) => (
          <div key={book.id} className="book-card col-6 col-md-4 col-lg-2 p-2">
            <Link to="#" className="text-decoration-none">
              <div className="card rounded-3 overflow-hidden shadow-sm">
                <img
                  className="card-img-top img-fluid"
                  loading="lazy"
                  src={book.img}
                  alt="Cover"
                />
                <div className="card-body text-center bg-white">
                  <h2 className="card-title h6 text-dark mb-1">{book.title}</h2>
                  <p className="text-dark small mb-0">{book.date}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookList;
