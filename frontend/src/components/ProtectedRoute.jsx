import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = (() => {
    const token = localStorage.getItem("token");
    return !!token;
  })();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
