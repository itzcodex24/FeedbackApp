import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import { Navbar, MyFeedback } from "./components";
import FeedbackId from "./pages/FeedbackId";
import { AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Users from "./pages/Admin/Users";
import useAuth from "./hooks/useAuth";

interface ProtectedProps {
  children: React.ReactNode;
  fallbackPath?: string;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedProps> = ({
  children,
  redirectPath = "/login",
  fallbackPath,
}) => {
  const { status, session } = useAuth();

  return status == "loading" ? (
    <></>
  ) : status == "loaded" && session ? (
    <>{children}</>
  ) : (
    <Navigate
      to={`${redirectPath}${fallbackPath && `?fallbackUrl=${fallbackPath}`}`}
    />
  );
};

function App() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <AnimatePresence initial={false} mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/feedback/:id" element={<FeedbackId />} />
          <Route path="/feedbacks/" element={<MyFeedback />} />
          <Route
            path="/users/"
            element={
              <ProtectedRoute fallbackPath="/users">
                <Users />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
