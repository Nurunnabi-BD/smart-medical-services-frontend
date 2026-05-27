import { useState } from "react";
import { FaUserMd, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const DoctorLogin = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both email and password.",
      });
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);

      // Enforce Doctor Role
      if (loggedUser.role !== "doctor") {
        logout(); // Discard token
        return Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You are not authorized to access the Doctor Panel. This portal is for registered medical practitioners only.",
        });
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${loggedUser.name}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/doctor-dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4 py-12 font-main">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl p-8 border border-sky-100">
        
        {/* Doctor Icon Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center text-[#0C8CE9] mx-auto mb-4 border border-sky-200 shadow-inner">
            <FaUserMd size={36} />
          </div>
          <h2 className="text-3xl font-black text-[#0C8CE9] tracking-tight">Doctor Portal</h2>
          <p className="text-sm text-gray-500 font-semibold mt-1">Medical Staff Authentication</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Registered Doctor Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50/50">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="doctor@smartmedical.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none text-sm bg-transparent text-gray-800 font-semibold"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50/50">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-sm bg-transparent text-gray-800 font-semibold"
                required
              />
            </div>
          </div>

          {/* Guidelines info */}
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-[11px] font-semibold text-sky-800 leading-relaxed">
            🩺 Tip: If you are testing, you can use any of the seeded doctor accounts (e.g. <span className="font-bold">rabat.hasan@smartmedical.com</span> with password <span className="font-bold">password123</span>).
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0C8CE9] hover:bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            <FaArrowRight />
            {loading ? "Authenticating..." : "Medical Secure Login"}
          </button>
        </form>

        {/* Back Link */}
        <p className="text-center text-sm text-gray-500 font-semibold mt-6">
          Not a doctor?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Go to Patient Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorLogin;
