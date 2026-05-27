import "../assets/style/home.css";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/home-bg.png";
import sideImage from "../assets/side.png";
import { FaRegSquareCheck } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { FaUserMd } from "react-icons/fa";
import { GiMedicinePills } from "react-icons/gi";
import { FaRegUser, FaTimes } from "react-icons/fa";
import { FaRegCalendarDays } from "react-icons/fa6";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    desc: "",
    details: "",
  });
  const openModal = (title, desc, details) => {
    setModalData({ title, desc, details });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <section className="bg-[#f4f7fb] flex items-center justify-center">
        <div
          className="
          w-full 
          min-h-[330px] 
          lg:min-h-[500px]
          overflow-hidden 
          relative 
          bg-cover 
          bg-center 
          flex flex-col lg:flex-row
          bg-none lg:bg-cover
        "
          style={{
            backgroundImage:
              window.innerWidth >= 1024 ? `url(${bgImage})` : "none",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#dfe5eb]/95 via-[#dfe5eb]/70 to-transparent z-10"></div>

          {/* Content */}
          <div className="relative z-20 w-full lg:w-1/2 px-8 lg:px-16 py-14 flex flex-col justify-center">
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-black font-main">
              Your <span className="text-[#0C8CE9]">Health</span>,
              <br />
              Our Priority
            </h1>

            <p className="mt-20 text-gray-700 text-base lg:text-lg leading-8 max-w-lg font-p font-semibold">
              smart medical services platform that connects <br /> you with best
              doctors and healthcare services.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => navigate("/find-doctors")}
                className="bg-[#0C8CE9] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2"
              >
                <FaRegSquareCheck size={22} />
                Book Appointment
              </button>

              <button
                onClick={() => navigate("/pharmacy")}
                className="border-2 border-[#0C8CE9] text-[#0C8CE9] hover:bg-[#0C8CE9] hover:text-white bg-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
              >
                <FaCartPlus size={22} />
                Order Medicine
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#edf2f7] py-10 px-5">
        <div className="max-w-7xl mx-auto text-center container">
          {/* Top Badge */}
          <div className="inline-block bg-blue-100 text-[#0C8CE9] text-xs font-bold px-5 py-2 rounded-full uppercase tracking-wide font-main">
            Services
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mt-5 font-main">
            Our Healthcare Services
          </h2>

          {/* Line */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-8 md:w-10 h-[3px] bg-[#0C8CE9] rounded-full"></div>
            <div className="w-2 md:w-3 h-[3px] bg-[#0C8CE9] rounded-full"></div>
            <div className="w-8 md:w-10 h-[3px] bg-[#0C8CE9] rounded-full"></div>
          </div>

          {/* Description */}
          <p className="text-gray-600 max-w-2xl mx-auto mt-5 leading-7 font-p text-sm md:text-base font-semibold">
            We offer a wide range of healthcare services to make quality medical
            care accessible to everyone.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-16">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 md:p-8 text-center">
              <div className="w-14 md:w-16 h-14 md:h-16 mx-auto rounded-full flex items-center justify-center bg-blue-100 text-[#0C8CE9]">
                <FaRegCalendarCheck size={30} />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-black mt-5 font-main">
                Book Appointment
              </h3>

              <p className="text-gray-600 text-sm leading-6 mt-3 font-p font-semibold">
                Easily book appointments with our experienced doctors.
              </p>

              <button
                onClick={() =>
                  openModal(
                    "Book Appointment",
                    "Easily book appointments with experienced doctors anytime from anywhere.",
                    `✔ Easy online booking
✔ Verified specialist doctors
✔ Instant confirmation
✔ 24/7 support system`,
                  )
                }
                className="flex items-center justify-center gap-2 text-[#0C8CE9] font-semibold mt-4 mx-auto hover:gap-3 transition-all"
              >
                Learn More <FaArrowRight size={16} />
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 md:p-8 text-center">
              <div className="w-14 md:w-16 h-14 md:h-16 mx-auto rounded-full flex items-center justify-center bg-green-100 text-[#38d39f]">
                <FaRegMessage size={30} />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-black mt-5 font-main">
                Online Consultation
              </h3>

              <p className="text-gray-600 text-sm leading-6 mt-3 font-p font-semibold">
                Consult doctors online from home easily.
              </p>

              <button
                onClick={() =>
                  openModal(
                    "Online Consultation",
                    "Consult doctors online from home easily.",
                    `✔ HD video calling system
✔ Secure private consultation
✔ No need to visit hospital
✔ Available anytime anywhere`,
                  )
                }
                className="flex items-center justify-center gap-2 text-[#0C8CE9] font-semibold mt-4 mx-auto hover:gap-3 transition-all"
              >
                Learn More <FaArrowRight size={16} />
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 md:p-8 text-center">
              <div className="w-14 md:w-16 h-14 md:h-16 mx-auto rounded-full flex items-center justify-center bg-purple-100 text-[#9b87f5]">
                <FaUserMd size={30} />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-black mt-5 font-main">
                Find Doctors
              </h3>

              <p className="text-gray-600 text-sm leading-6 mt-3 font-p font-semibold">
                Find specialist doctors based on your needs.
              </p>

              <button
                onClick={() =>
                  openModal(
                    "Find Doctors",
                    "Find specialist doctors based on your needs.",
                    `✔ Search doctors by specialty (Cardiology, Neurology, etc.)
✔ View doctor profiles, experience, and ratings
✔ Filter by location and availability
✔ Instant appointment booking system
✔ Verified and trusted medical professionals`,
                  )
                }
                className="flex items-center justify-center gap-2 text-[#0C8CE9] font-semibold mt-4 mx-auto hover:gap-3 transition-all"
              >
                Learn More <FaArrowRight size={16} />
              </button>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 md:p-8 text-center">
              <div className="w-14 md:w-16 h-14 md:h-16 mx-auto rounded-full flex items-center justify-center bg-orange-100 text-[#f4b44f]">
                <GiMedicinePills size={30} />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-black mt-5 font-main">
                Pharmacy Delivery
              </h3>

              <p className="text-gray-600 text-sm leading-6 mt-3 font-p font-semibold">
                Get medicine delivered to your doorstep.
              </p>

              <button
                onClick={() =>
                  openModal(
                    "Pharmacy Delivery",
                    "Get medicine delivered to your doorstep.",
                    `✔ Fast home delivery service
✔ Genuine and verified medicines
✔ Upload prescription easily
✔ 24/7 order support system
✔ Cash on delivery & online payment available`,
                  )
                }
                className="flex items-center justify-center gap-2 text-[#0C8CE9] font-semibold mt-4 mx-auto hover:gap-3 transition-all"
              >
                Learn More <FaArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* 🔥 CTA BUTTON (SECTION END) */}
          <div className="mt-12 md:mt-16">
            <Link to="/services">
              <button className="bg-[#0C8CE9] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition w-full sm:w-auto">
                Explore All Services
              </button>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-10 px-4 bg-[#f8fbff] overflow-hidden">
        <div className="max-w-7xl mx-auto container">
          {/* Top Content */}
          <div className="text-center mb-10">
            {/* Badge */}
            <div className="inline-block bg-blue-100 text-[#0C8CE9] text-[10px] md:text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide font-main">
              ABOUT US
            </div>

            {/* Heading */}
            <h2 className="text-2xl md:text-4xl font-extrabold text-black mt-4 font-main leading-tight">
              We Care About Your Health
            </h2>

            {/* Line */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-8 h-[3px] bg-[#0C8CE9] rounded-full"></div>
              <div className="w-2 h-[3px] bg-[#0C8CE9] rounded-full"></div>
              <div className="w-8 h-[3px] bg-[#0C8CE9] rounded-full"></div>
            </div>

            {/* Description */}
            <p className="text-gray-600 max-w-xl mx-auto mt-4 leading-6 font-p text-sm font-semibold">
              Smart Medical Services Platform is dedicated to providing quality
              healthcare services to everyone, everywhere.
            </p>
          </div>

          {/* Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="relative">
              <img
                src={sideImage}
                alt="Medical"
                className="w-full max-w-[500px] mx-auto  object-cover"
              />
            </div>

            {/* Right Content */}
            <div>
              <h3 className="text-base md:text-lg font-main text-[#0C8CE9] font-bold uppercase tracking-wide">
                WHO WE ARE
              </h3>

              <h1 className="text-2xl md:text-4xl font-extrabold text-black mt-3 leading-tight font-main">
                Your <span className="text-[#0C8CE9]">Health</span>, Our
                Priority
              </h1>

              <p className="text-gray-600 mt-4 leading-7 font-p text-sm font-semibold">
                We are a digital healthcare platform that connects patients with
                trusted doctors and modern medical services.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {/* Card 1 */}
                <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-[#0C8CE9] mx-auto mb-3">
                    <FaRegUser size={24} />
                  </div>

                  <h3 className="text-base font-main text-black font-bold">
                    Trusted Doctors
                  </h3>

                  <p className="text-gray-600 mt-2 leading-6 text-sm font-semibold">
                    Connect with verified doctors anytime.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-[#38d39f] mx-auto mb-3">
                    <FaRegCalendarDays size={24} />
                  </div>

                  <h3 className="text-base font-main text-black font-bold">
                    Easy Appointments
                  </h3>

                  <p className="text-gray-600 mt-2 leading-6 text-sm font-semibold">
                    Book appointments quickly and easily.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-[#f4b44f] mx-auto mb-3">
                    <MdOutlineHealthAndSafety size={24} />
                  </div>

                  <h3 className="text-base font-main text-black font-bold">
                    Secure & Safe
                  </h3>

                  <p className="text-gray-600 mt-2 leading-6 text-sm font-semibold">
                    Your health data stays protected.
                  </p>
                </div>
              </div>

              {/* Button */}
              <Link
                to="/about"
                className="mt-7 inline-flex items-center gap-2 border-2 border-[#0C8CE9] text-[#0C8CE9] hover:bg-[#0C8CE9] hover:text-white bg-white px-6 py-3 rounded-lg font-semibold transition font-main"
              >
                Learn More About Us <FaArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 relative shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-gray-500 hover:text-red-500 text-2xl"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold text-[#0C8CE9] mb-4">
              {modalData.title}
            </h2>

            <p className="text-gray-600 mb-4">{modalData.desc}</p>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-gray-700 whitespace-pre-line">
              {modalData.details}
            </div>

            <button
              onClick={closeModal}
              className="mt-6 w-full bg-[#0C8CE9] text-white py-3 rounded-2xl hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
