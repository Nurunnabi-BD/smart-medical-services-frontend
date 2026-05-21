import React from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaLock,
  FaUsers,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import register from "../assets/register.png";

const Register = () => {
  return (
    <div className="min-h-screen bg-[#edf4fa] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-[30px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-lg">
        {/* Left Side */}
        <div className="bg-[#f4f8fb] px-10 py-12 flex flex-col justify-between">
          <div>
            <img src={logo} alt="logo" className="w-28 mb-10 mx-auto" />

            <h1 className="text-5xl font-bold leading-tight text-black">
              Better <span className="text-[#0C8CE9]">Health</span>,
              <br />
              Better Life
            </h1>

            <div className="w-28 h-1 bg-[#0C8CE9] mt-4 mb-6 rounded-full"></div>

            <p className="text-gray-600 text-lg leading-8 max-w-md">
              Join smart medical platform and get access to doctors,
              appointments, medicines and health services - all in one place.
            </p>
          </div>

          <div className="mt-10">
            <img
              src={register}
              alt="doctor"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="px-10 py-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-5xl font-bold text-center text-black">
              Create Your Account
            </h2>

            <p className="text-center text-gray-500 mt-3 mb-8">
              Fill in the details below to register
            </p>

            {/* Tabs */}
            <div className="flex justify-between border-b mb-8 text-sm font-semibold">
              <Link
                to="/login"
                className="w-1/2 pb-3 text-center text-gray-500 hover:text-[#0C8CE9] transition"
              >
                Login
              </Link>

              <button className="w-1/2 pb-3 border-b-2 border-[#0C8CE9] text-[#0C8CE9]">
                Register
              </button>
            </div>

            {/* Form */}
            <form className="space-y-5">
              {/* Name + User Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg flex items-center px-3 h-12">
                  <FaUser className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full outline-none text-sm bg-white text-gray-400"
                  />
                </div>

                <div className="border rounded-lg flex items-center px-3 h-12">
                  <FaUsers className="text-gray-400 mr-3" />
                  <select className="w-full outline-none text-sm text-gray-400 bg-transparent">
                    <option>Select user type</option>
                    <option>Patient</option>
                    <option>Doctor</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="border rounded-lg flex items-center px-3 h-12">
                <FaEnvelope className="text-gray-400 mr-3" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full outline-none text-sm bg-white text-gray-400"
                />
              </div>

              {/* Phone + DOB */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg flex items-center px-3 h-12">
                  <FaPhone className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Enter your phone"
                    className="w-full outline-none text-sm bg-white text-gray-400"
                  />
                </div>

                <div className="border rounded-lg flex items-center px-3 h-12">
                  <FaCalendarAlt className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    className="w-full outline-none text-sm bg-white text-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg flex items-center px-3 h-12">
                  <FaLock className="text-gray-400 mr-3" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full outline-none text-sm bg-white text-gray-400"
                  />
                </div>

                <div className="border rounded-lg flex items-center px-3 h-12">
                  <FaLock className="text-gray-400 mr-3" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full outline-none text-sm bg-white text-gray-400"
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" className="mt-1" />
                <p>
                  I agree to the{" "}
                  <span className="text-[#0C8CE9] cursor-pointer">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-[#0C8CE9] cursor-pointer">
                    Privacy Policy
                  </span>
                </p>
              </div>

              {/* Button */}
              <button className="w-full h-12 rounded-lg bg-[#0C8CE9] text-white font-semibold text-lg hover:opacity-90 transition">
                Create Account
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-[#0C8CE9] font-medium">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
