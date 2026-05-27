import { Link } from "react-router-dom";
import { FaHeartbeat, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col items-center justify-center px-4 font-main">
      <div className="text-center max-w-md">
        {/* Animated Medical Heartbeat Logo */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 shadow-inner animate-pulse">
          <FaHeartbeat size={48} />
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-extrabold text-gray-800 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mt-4">Page Not Found</h2>
        
        <p className="text-gray-500 mt-3 font-semibold leading-relaxed">
          The medical report or page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Return Button */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-[#0C8CE9] hover:bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <FaArrowLeft />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
