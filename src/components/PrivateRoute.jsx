import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BeatLoader } from "react-spinners";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb]">
        <div className="text-center">
          <BeatLoader color="#0C8CE9" size={15} margin={2} />
          <p className="text-gray-500 mt-4 font-semibold">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
