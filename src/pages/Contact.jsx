import { useState } from "react";
import Swal from "sweetalert2";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";

import heroBg from "../assets/contact-bg.png";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div className="bg-gradient-to-b from-[#f4f9ff] to-[#edf4fb] min-h-screen">
      {/* Hero Section */}
      <div
        className="relative w-full h-[340px] bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px]"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#0b1220]">
            Contact <span className="text-[#0C8CE9]">Us</span>
          </h1>

          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-16 h-[3px] rounded-full bg-[#0C8CE9]"></div>
            <div className="text-[#0C8CE9] text-3xl font-bold">+</div>
            <div className="w-16 h-[3px] rounded-full bg-[#0C8CE9]"></div>
          </div>

          <p className="text-gray-600 mt-6 max-w-2xl mx-auto leading-8 text-lg">
            We are here to help you. Reach out to us for any inquiries,
            appointments, or support services.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-14">
        {/* Left Side */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0b1220]">
            Get <span className="text-[#0C8CE9]">In Touch</span>
          </h2>

          <div className="w-20 h-1 bg-[#0C8CE9] rounded-full mt-4 mb-7"></div>

          <p className="text-gray-600 mb-10 leading-8 text-lg">
            Have questions or need assistance? Fill out the form and our team
            will contact you shortly.
          </p>

          {/* Contact Cards */}
          <div className="space-y-6">
            {/* Phone */}
            <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex items-center gap-5 border border-[#eaf2fb]">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-[#0C8CE9] text-2xl">
                <FaPhoneAlt />
              </div>

              <div>
                <h4 className="font-bold text-xl text-[#0b1220] mb-1">
                  Phone
                </h4>
                <p className="text-gray-500">+8801568430775</p>
                <p className="text-gray-500">+8801605991825</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex items-center gap-5 border border-[#eaf2fb]">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-500 text-2xl">
                <FaEnvelope />
              </div>

              <div>
                <h4 className="font-bold text-xl text-[#0b1220] mb-1">
                  Email
                </h4>
                <p className="text-gray-500">info@smartmedical.com</p>
                <p className="text-gray-500">support@smartmedical.com</p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex items-center gap-5 border border-[#eaf2fb]">
              <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-500 text-2xl">
                <FaMapMarkerAlt />
              </div>

              <div>
                <h4 className="font-bold text-xl text-[#0b1220] mb-1">
                  Address
                </h4>
                <p className="text-gray-500">
                  123 Medical Street, Health City
                </p>
                <p className="text-gray-500">Chattogram, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-[#0b1220] mb-5">
              Follow Us
            </h3>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white flex items-center justify-center cursor-pointer hover:scale-110 transition duration-300 shadow-md">
                <FaInstagram />
              </div>

              <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center cursor-pointer hover:scale-110 transition duration-300 shadow-md">
                <FaFacebookF />
              </div>

              <div className="w-12 h-12 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center cursor-pointer hover:scale-110 transition duration-300 shadow-md">
                <FaTwitter />
              </div>

              <div className="w-12 h-12 rounded-full bg-[#0A66C2] text-white flex items-center justify-center cursor-pointer hover:scale-110 transition duration-300 shadow-md">
                <FaLinkedinIn />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="bg-white rounded-[32px] shadow-xl p-8 md:p-10 border border-[#e8eef7]">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0b1220]">
            Send Us <span className="text-[#0C8CE9]">A Message</span>
          </h2>

          <div className="w-20 h-1 bg-[#0C8CE9] rounded-full mt-4 mb-10"></div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name || !email || !subject || !message) {
                return Swal.fire("Required", "Please fill in all fields before sending.", "warning");
              }
              Swal.fire({
                icon: "success",
                title: "Message Sent!",
                text: "Thank you for contacting us. Our support team will get back to you shortly.",
                confirmButtonColor: "#0C8CE9",
              });
              setName("");
              setEmail("");
              setSubject("");
              setMessage("");
            }}
            className="space-y-7"
          >
            {/* Name + Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#0C8CE9] focus:ring-4 focus:ring-blue-100 transition bg-[#fdfdfd] text-gray-800"
                  required
                />
                <FaUser className="absolute right-5 top-5 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#0C8CE9] focus:ring-4 focus:ring-blue-100 transition bg-[#fdfdfd] text-gray-800"
                  required
                />
                <FaEnvelope className="absolute right-5 top-5 text-gray-400" />
              </div>
            </div>

            {/* Subject */}
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#0C8CE9] focus:ring-4 focus:ring-blue-100 transition bg-[#fdfdfd] text-gray-800"
              required
            />

            {/* Message */}
            <textarea
              rows="7"
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#0C8CE9] focus:ring-4 focus:ring-blue-100 transition resize-none bg-[#fdfdfd] text-gray-800"
              required
            ></textarea>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0C8CE9] to-[#1877F2] hover:scale-[1.01] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition duration-300 shadow-lg"
            >
              <FaPaperPlane />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;