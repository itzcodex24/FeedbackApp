import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import { Navbar } from "./components";
import { AnimatePresence } from "framer-motion";
import useAuth from "./hooks/useAuth";

import {
  Register,
  Login,
  AdminUsers,
  Dashboard,
  Projects,
  FeedbackId,
  NotFound,
  Settings,
  CreateProject,
  ProjectId,
} from "./pages";

interface ProtectedProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, status } = useAuth();

  if (status == "loading") return <></>;

  if (status == "loaded" && session?.role == "ADMIN") {
    return <>{children}</>;
  }

  return <Navigate to="/" />;
};

const ProtectedRoute: React.FC<ProtectedProps> = ({
  children,
  redirectPath = "/login",
}) => {
  const { status, session } = useAuth();

  if (session) {
    return <>{children}</>;
  }

  if (status == "loading") return <></>;

  if (status == "loaded" && !session) {
    return <Navigate to={redirectPath} />;
  }

  return <>{children}</>;
};

function App() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/feedback/:id" element={<FeedbackId />} />
          <Route
            path="/projects/create"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route path="/project/:id" element={<ProjectId />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
