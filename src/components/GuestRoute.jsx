import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BeatLoader } from "react-spinners";

const GuestRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb]">
        <div className="text-center">
          <BeatLoader color="#0C8CE9" size={15} margin={2} />
          <p className="text-gray-500 mt-4 font-semibold">Checking session...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Prevent logging in again from another account and redirect to active panel
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user.role === "doctor") {
      return <Navigate to="/doctor-dashboard" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  return children;
};

export default GuestRoute;
