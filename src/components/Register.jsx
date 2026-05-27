import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaLock,
  FaUsers,
  FaBriefcaseMedical,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.png";
import registerImg from "../assets/register.png";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState("");
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Doctor Specific States
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill in all required fields (Name, Email, Password, Confirm Password).",
      });
    }

    if (password !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Passwords do not match.",
      });
    }

    if (role === "doctor" && (!specialization || !experience || !fees)) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Doctors must provide specialization, experience, and consultation fees.",
      });
    }

    setLoading(true);

    const registrationData = {
      name,
      email,
      password,
      role,
      phone,
      dob,
      specialization,
      experience: Number(experience),
      fees: Number(fees),
    };

    try {
      const registeredUser = await register(registrationData);
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: `Welcome to Smart Medical, ${registeredUser.name}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect based on role
      if (registeredUser.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/user");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err,
      });
    } finally {
      setLoading(false);
    }
  };

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
              src={registerImg}
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
              <button className="w-1/2 pb-3 border-b-2 border-[#0C8CE9] text-[#0C8CE9]" disabled>
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + User Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg flex items-center px-3 h-12 bg-white">
                  <FaUser className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full outline-none text-sm bg-white text-gray-800"
                    required
                  />
                </div>

                <div className="border rounded-lg flex items-center px-3 h-12 bg-white">
                  <FaUsers className="text-gray-400 mr-3" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full outline-none text-sm text-gray-800 bg-transparent"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="border rounded-lg flex items-center px-3 h-12 bg-white">
                <FaEnvelope className="text-gray-400 mr-3" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full outline-none text-sm bg-white text-gray-800"
                  required
                />
              </div>

              {/* Phone + DOB */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg flex items-center px-3 h-12 bg-white">
                  <FaPhone className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full outline-none text-sm bg-white text-gray-800"
                  />
                </div>

                <div className="border rounded-lg flex items-center px-3 h-12 bg-white">
                  <FaCalendarAlt className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full outline-none text-sm bg-white text-gray-800"
                  />
                </div>
              </div>

              {/* Doctor specific fields */}
              {role === "doctor" && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-700">Doctor Profile Details</h3>
                  
                  {/* Specialization */}
                  <div className="border rounded-lg flex items-center px-3 h-12 bg-white">
                    <FaBriefcaseMedical className="text-gray-400 mr-3" />
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full outline-none text-sm text-gray-800 bg-transparent"
                      required
                    >
                      <option value="">Select Specialization</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Orthopedic">Orthopedic</option>
                      <option value="Gynecologist">Gynecologist</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Experience */}
                    <div className="border rounded-lg flex items-center px-3 h-12 bg-white">
                      <FaClock className="text-gray-400 mr-3" />
                      <input
                        type="number"
                        placeholder="Years Exp"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full outline-none text-sm bg-white text-gray-800"
                        required
                      />
                    </div>
                    {/* Fees */}
                    <div className="border rounded-lg flex items-center px-3 h-12 bg-white">
                      <FaMoneyBillWave className="text-gray-400 mr-3" />
                      <input
                        type="number"
                        placeholder="Fees (BDT)"
                        value={fees}
                        onChange={(e) => setFees(e.target.value)}
                        className="w-full outline-none text-sm bg-white text-gray-800"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg flex items-center px-3 h-12 bg-white">
                  <FaLock className="text-gray-400 mr-3" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full outline-none text-sm bg-white text-gray-800"
                    required
                  />
                </div>

                <div className="border rounded-lg flex items-center px-3 h-12 bg-white">
                  <FaLock className="text-gray-400 mr-3" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full outline-none text-sm bg-white text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" className="mt-1" required />
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
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg bg-[#0C8CE9] hover:bg-[#0976c6] text-white font-semibold text-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Create Account"}
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
