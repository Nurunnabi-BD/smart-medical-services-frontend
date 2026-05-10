import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#D3ECFF] px-6 md:px-12 lg:px-20 pt-10 pb-3">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 container">

        {/* Logo */}
        <div>
          <img src={Logo} alt="logo" className="w-36 mb-4" />

          <p className="text-gray-600 text-sm leading-7 max-w-xs font-p font-semibold">
            We are committed to providing the best healthcare services with
            compassion and excellence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-3xl font-bold mb-5 text-black font-main">
            Quick Links
          </h2>

          <ul className="space-y-2 text-gray-600 text-sm font-p font-semibold">

            <li>
              <Link
                to="/"
                className="hover:text-[#0C8CE9] duration-300"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/doctors"
                className="hover:text-[#0C8CE9] duration-300"
              >
                Find Doctors
              </Link>
            </li>

            <li>
              <Link
                to="/appointments"
                className="hover:text-[#0C8CE9] duration-300"
              >
                Appointments
              </Link>
            </li>

            <li>
              <Link
                to="/services"
                className="hover:text-[#0C8CE9] duration-300"
              >
                Services
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="hover:text-[#0C8CE9] duration-300"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="hover:text-[#0C8CE9] duration-300"
              >
                Contact
              </Link>
            </li>

            <li>
              <Link
                to="/admin-login"
                className="hover:text-[#0C8CE9] duration-300"
              >
                Admin Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-3xl font-bold mb-5 text-black font-main">
            Services
          </h2>

          <ul className="space-y-2 text-gray-600 text-sm font-p font-semibold">

            <li>
              <Link
                to="/consultation"
                className="hover:text-[#0C8CE9] duration-300"
              >
                Online Consultation
              </Link>
            </li>

            <li>
              <Link
                to="/booking"
                className="hover:text-[#0C8CE9] duration-300"
              >
                Appointment Booking
              </Link>
            </li>

            <li>
              <Link
                to="/reports"
                className="hover:text-[#0C8CE9] duration-300"
              >
                Prescription & Reports
              </Link>
            </li>

            <li>
              <Link
                to="/packages"
                className="hover:text-[#0C8CE9] duration-300"
              >
                Health Packages
              </Link>
            </li>

            <li>
              <Link
                to="/pharmacy"
                className="hover:text-[#0C8CE9] duration-300"
              >
                Pharmacy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-3xl font-bold mb-5 text-black font-main">
            Contact Us
          </h2>

          <div className="space-y-4 text-gray-600 text-sm font-semibold">

            <div className="flex items-start gap-3">
              <FaPhoneAlt className="text-[#0C8CE9] mt-1" />
              <p>+8801234-567890</p>
            </div>

            <div className="flex items-start gap-3">
              <FaEnvelope className="text-[#0C8CE9] mt-1" />
              <p>info@smartmed.com</p>
            </div>

            <div className="flex items-start gap-3 font-p">
              <FaMapMarkerAlt className="text-[#0C8CE9] mt-1" />

              <p>
                123 Health St. Dhaka
                <br />
                Bangladesh
              </p>
            </div>
          </div>
        </div>

        {/* Follow Us */}
        <div>
          <h2 className="text-3xl font-bold mb-5 text-black font-main">
            Follow Us
          </h2>

          <div className="flex items-center gap-4">

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center text-xl hover:scale-110 duration-300"
            >
              <FaInstagram />
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl hover:scale-110 duration-300"
            >
              <FaFacebookF />
            </a>

            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center text-xl hover:scale-110 duration-300"
            >
              <FaTwitter />
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl hover:scale-110 duration-300"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-gray-500 text-sm font-semibold mt-8 border-t border-gray-300 pt-3 font-p">
        © 2026 Smart Medical Service Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;