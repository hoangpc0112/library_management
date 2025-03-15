import { useEffect } from "react";
import BookList from "../components/BookList";

const BookPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Thư viện sách";
  }, []);

  return (
    <div>
      <BookList />
    </div>
  );
};

export default BookPage;
