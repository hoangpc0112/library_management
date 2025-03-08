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
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./css/App.css";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="book" element={<BookPage />} />
        <Route path="book/:id" element={<SingleBook />} />
        <Route path="about-us" element={<AboutUsPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="borrowed" element={<BorrowedPage />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
