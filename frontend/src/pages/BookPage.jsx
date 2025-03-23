import { useEffect } from "react";
import BookList from "../components/BookList";
import SearchInput from "../components/SearchInput";

const BookPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Thư viện sách";
  }, []);

  return (
    <div>
      <SearchInput />
      <BookList apiEndpoint="book" />
    </div>
  );
};

export default BookPage;
