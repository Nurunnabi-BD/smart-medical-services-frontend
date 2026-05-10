import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF } from "react-icons/fa";
import loginImage from "../assets/Login.png";

const Login = () => {
  return (
    <section className="min-h-screen bg-[#f4f9ff] flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side */}
        <div className="hidden lg:flex items-center justify-center bg-[#DFF1FF] p-10">
          <img
            src={loginImage}
            alt="Login"
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* Right Side */}
        <div className="p-6 md:p-10 flex flex-col justify-center">
          
          {/* Logo / Title */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black font-main">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mt-3 text-sm md:text-base">
              Login to access your medical dashboard and appointments.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-5">
            
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="flex items-center border border-gray-200 rounded-xl px-4 mt-2 focus-within:border-[#0C8CE9]">
                <FaEnvelope className="text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-4 outline-none bg-transparent text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-[#0C8CE9] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="flex items-center border border-gray-200 rounded-xl px-4 mt-2 focus-within:border-[#0C8CE9]">
                <FaLock className="text-gray-400" />

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-4 outline-none bg-transparent text-sm"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-[#0C8CE9]" />
                Remember me
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#0C8CE9] hover:bg-[#0a7ad0] text-white py-4 rounded-xl font-semibold transition duration-300 shadow-md"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <p className="text-sm text-gray-400">OR</p>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition">
              <FaGoogle className="text-red-500" />
              <span className="text-sm font-medium">Google</span>
            </button>

            <button className="flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition">
              <FaFacebookF className="text-blue-600" />
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>

          {/* Register */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#0C8CE9] font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;