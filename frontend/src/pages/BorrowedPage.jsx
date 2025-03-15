import { useEffect } from "react";
import BookList from "../components/BookList";

const BorrowedPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sách đã mượn";
  }, []);

  return (
    <div>
      <BookList />
    </div>
  );
};

export default BorrowedPage;
