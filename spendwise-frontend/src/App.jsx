import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./component/ProtectedRoute";
import GuestRoute from "./component/GuestRoute";
import NetworkStatus from "./component/NetworkStatus/NetworkStatus";
import LoadingScreen from "./component/LoadingScreen/LoadingScreen";
import AOS from 'aos';
import 'aos/dist/aos.css';

const DashBoard = lazy(() => import("./pages/DashBoard/DashBoard"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const ForgotPassword = lazy(() =>import("./pages/ForgotPassword/ForgotPassword"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const History = lazy(() => import("./pages/History/History"));
const BorrowLend = lazy(() => import("./pages/BorrowLend/BorrowLend"));
const Friends = lazy(() => import("./pages/Friends/Friends"));
const SharedExpenses = lazy(() =>import("./pages/SharedExpense/SharedExpense"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage/AnalyticsPage"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

const App = () => {

  AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
    });

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <DashBoard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Suspense fallback={<LoadingScreen />}>
                <Login />
              </Suspense>
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Suspense fallback={<LoadingScreen />}>
                <Register />
              </Suspense>
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <Suspense fallback={<LoadingScreen />}>
                <ForgotPassword />
              </Suspense>
            </GuestRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <Profile />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <History />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrowlend"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <BorrowLend />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <Friends />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shared"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <SharedExpenses />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <AnalyticsPage />
              </Suspense>
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
