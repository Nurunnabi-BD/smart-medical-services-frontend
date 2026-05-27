import { useState } from "react";
import { FaUserShield, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const AdminLogin = () => {
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

      // Enforce Admin Role
      if (loggedUser.role !== "admin") {
        logout(); // Discard token
        return Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You are not authorized to access the Admin Panel. This portal is for administrators only.",
        });
      }

      Swal.fire({
        icon: "success",
        title: "Access Granted",
        text: "Welcome to the Administrative Control Center.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/admin-dashboard");
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12 font-main">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl p-8 border border-slate-200">
        
        {/* Shield Icon Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-800 mx-auto mb-4 border border-slate-200 shadow-inner">
            <FaUserShield size={36} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h2>
          <p className="text-sm text-gray-500 font-semibold mt-1">Authorized Personnel Only</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Administrator Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50/50">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="admin@smartmedical.com"
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
              Secure Security Key
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

          {/* Alert Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-[11px] font-semibold text-yellow-800 leading-relaxed">
            ⚠ Warning: All login attempts and operations within this administrative environment are monitored and logged.
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            <FaArrowRight />
            {loading ? "Authenticating..." : "Admin Secure Login"}
          </button>
        </form>

        {/* Back Link */}
        <p className="text-center text-sm text-gray-500 font-semibold mt-6">
          Not an admin?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Go to Patient Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
