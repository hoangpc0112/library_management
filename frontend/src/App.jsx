import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookPage from "./pages/BookPage";
import BorrowedPage from "./pages/BorrowedPage";
import RootLayout from "./layouts/RootLayout";
import AboutUsPage from "./pages/AboutUsPage";
import ProfilePage from "./pages/ProfilePage";
import SingleBook from "./pages/SingleBook";

import "./css/App.css";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="book" element={<BookPage />} />
        <Route path="book/:id" element={<SingleBook />} />
        <Route path="borrowed" element={<BorrowedPage />} />
        <Route path="about-us" element={<AboutUsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
