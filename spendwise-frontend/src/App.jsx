import { Route, Routes } from "react-router-dom";
import DashBoard from "./pages/DashBoard/DashBoard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./component/ProtectedRoute";
import GuestRoute from "./component/GuestRoute";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Profile from "./pages/Profile/Profile";
import History from "./pages/History/History";
import NotFound from "./pages/NotFound/NotFound";
import NetworkStatus from "./component/NetworkStatus/NetworkStatus";
import BorrowLend from "./pages/BorrowLend/BorrowLend";
import Friends from "./pages/Friends/Friends";
import SharedExpenses from "./pages/SharedExpense/SharedExpense";
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrowlend"
          element={
            <ProtectedRoute>
              <BorrowLend />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shared"
          element={
            <ProtectedRoute>
              <SharedExpenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer autoClose={1500} />
      <NetworkStatus />
    </>
  );
};

export default App;
