import { useState } from "react";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

import Logo from "../assets/logo.png";
import loginImg from "../assets/Login.png";

const Login = () => {
  const { login } = useAuth();
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
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${loggedUser.name}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect based on user role
      if (loggedUser.role === "admin") {
        navigate("/admin-dashboard");
      } else if (loggedUser.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/user");
      }
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
    <div className="min-h-screen bg-[#edf4fb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-[30px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="bg-[#eef5fc] px-10 py-12 flex flex-col justify-between">
          <div>
            {/* LOGO */}
            <div className="flex items-center gap-3 mb-10">
              <img src={Logo} alt="logo" className="w-14 h-14" />
              <div>
                <h1 className="text-2xl font-bold text-[#0C8CE9]">
                  Smart Medical
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Service Platform
                </p>
              </div>
            </div>

            {/* TEXT */}
            <h1 className="text-5xl font-extrabold leading-tight text-black">
              Your <span className="text-[#0C8CE9]">Health</span>,
              <br />
              Our Priority
            </h1>

            <div className="w-24 h-1 bg-[#0C8CE9] mt-5 mb-6 rounded-full"></div>

            <p className="text-gray-600 text-lg leading-8 max-w-md">
              Book appointments, consult doctors, order medicine and more —
              all in one secure healthcare platform.
            </p>
          </div>

          {/* IMAGE */}
          <div className="mt-10 flex justify-center">
            <img
              src={loginImg}
              alt="doctor"
              className="w-full max-w-sm"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white px-8 md:px-16 py-16 flex items-center justify-center">
          <div className="w-full max-w-md">

            {/* TITLE */}
            <h2 className="text-5xl font-bold text-center text-black">
              Welcome Back!
            </h2>

            <p className="text-center text-gray-500 mt-4">
              Please login to your account
            </p>

            {/* TABS */}
            <div className="flex justify-center gap-16 mt-10 border-b border-gray-300">
              <button
                className="pb-3 font-semibold border-b-2 text-[#0C8CE9] border-[#0C8CE9]"
                disabled
              >
                Login
              </button>
              <Link
                to="/register"
                className="pb-3 font-semibold border-b-2 border-transparent text-gray-500 hover:text-[#0C8CE9] transition-all duration-300"
              >
                Register
              </Link>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">

              {/* EMAIL */}
              <div>
                <label className="text-sm font-semibold text-gray-700 bg-white">
                  Email Address
                </label>
                <div className="mt-2 flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <FaEnvelope className="text-gray-400 mr-3" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full outline-none text-sm bg-white text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="mt-2 flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <FaLock className="text-gray-400 mr-3" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full outline-none text-sm bg-white text-gray-800"
                    required
                  />
                </div>
                <div className="text-right mt-2">
                  <button
                    type="button"
                    className="text-[#0C8CE9] text-sm font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0C8CE9] hover:bg-[#0976c6] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <FaArrowRight />
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* FOOTER */}
            <p className="text-center text-gray-500 text-sm mt-8">
              Don’t have an account?
              <Link
                to="/register"
                className="text-[#0C8CE9] font-semibold ml-2"
              >
                Register
              </Link>
            </p>

            {/* PORTAL LINKS */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between text-xs font-semibold text-gray-400">
              <Link to="/doctor-login" className="hover:text-[#0C8CE9] transition duration-200">
                🩺 Doctor Login
              </Link>
              <Link to="/admin-login" className="hover:text-slate-800 transition duration-200">
                🛡️ Admin Login
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;