import {
  FaUserMd,
  FaHeartbeat,
  FaHospital,
  FaAward,
  FaCheckCircle,
} from "react-icons/fa";
import doctorImage from "../assets/doctor.png";
import team1 from "../assets/team1.jpeg";
import team2 from "../assets/team2.jpeg";
import team3 from "../assets/team3.jpeg";
import { useState } from "react";

const About = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <section className="bg-[#f8fbff] overflow-hidden ">
      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[28px] p-5 sm:p-7 md:p-8 relative shadow-2xl animate-[fadeIn_.3s_ease]">
            {/* Close Button */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-red-100 text-red-500 w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-red-500 hover:text-white transition flex items-center justify-center"
            >
              ✕
            </button>

            {/* Content */}
            <div className="text-center">
              <div className="inline-block bg-blue-100 text-[#0C8CE9] text-[10px] sm:text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide">
                Smart Medical Platform
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-5 text-black font-main leading-tight">
                Advanced Healthcare For Everyone
              </h2>

              <p className="text-gray-600 mt-4 sm:mt-5 leading-7 text-sm sm:text-base font-p max-w-xl mx-auto">
                We provide trusted healthcare solutions with experienced
                doctors, online appointment systems, emergency support, secure
                medical records and modern hospital facilities.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7 sm:mt-8">
                <div className="bg-[#f8fbff] p-4 sm:p-5 rounded-2xl">
                  <h3 className="font-bold text-[#0C8CE9] text-base sm:text-lg">
                    Expert Doctors
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 leading-6">
                    Professional and experienced medical specialists.
                  </p>
                </div>

                <div className="bg-[#f8fbff] p-4 sm:p-5 rounded-2xl">
                  <h3 className="font-bold text-[#0C8CE9] text-base sm:text-lg">
                    Emergency Support
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 leading-6">
                    Fast emergency response for urgent situations.
                  </p>
                </div>

                <div className="bg-[#f8fbff] p-4 sm:p-5 rounded-2xl">
                  <h3 className="font-bold text-[#0C8CE9] text-base sm:text-lg">
                    Secure Records
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 leading-6">
                    Safe and private patient medical information.
                  </p>
                </div>

                <div className="bg-[#f8fbff] p-4 sm:p-5 rounded-2xl">
                  <h3 className="font-bold text-[#0C8CE9] text-base sm:text-lg">
                    Online Appointment
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 leading-6">
                    Book appointments anytime from anywhere.
                  </p>
                </div>
              </div>

              {/* Bottom Button */}
              <button
                onClick={() => setOpenModal(false)}
                className="mt-7 sm:mt-8 bg-[#0C8CE9] hover:bg-[#0a7ad0] text-white px-7 sm:px-8 py-3 rounded-full font-semibold transition w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="bg-[#DFF1FF] py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block bg-white text-[#0C8CE9] text-xs font-bold px-5 py-2 rounded-full uppercase tracking-wide">
            ABOUT US
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-black mt-5 leading-tight font-main">
            Caring For Life, Every Step Of The Way
          </h1>

          <p className="max-w-3xl mx-auto mt-5 text-gray-600 leading-7 text-sm md:text-base font-p">
            Smart Medical Services Platform provides trusted healthcare
            solutions with experienced doctors, easy appointments, emergency
            support and secure medical services.
          </p>
        </div>
      </div>

      {/* About Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative">
            <img
              src={doctorImage}
              alt="Doctor"
              className="w-full rounded-3xl shadow-2xl object-cover"
            />

            {/* Experience Card */}
            <div className="absolute bottom-5 left-5 bg-white rounded-2xl shadow-xl px-5 py-4">
              <h2 className="text-3xl font-bold text-[#0C8CE9]">15+</h2>
              <p className="text-sm text-gray-600">Years of Experience</p>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <h3 className="text-[#0C8CE9] font-bold uppercase tracking-wide text-sm">
              WHO WE ARE
            </h3>

            <h2 className="text-3xl md:text-4xl font-extrabold text-black mt-4 leading-tight font-main">
              We Always Ensure The Best Medical Treatment
            </h2>

            <p className="text-gray-600 mt-6 leading-8 text-sm md:text-base font-p">
              Our platform connects patients with trusted healthcare
              professionals and hospitals to make medical care easier, faster
              and more accessible for everyone.
            </p>

            {/* Features */}
            <div className="space-y-4 mt-8">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-[#0C8CE9] mt-1" />
                <p className="text-gray-700 text-sm md:text-base font-p">
                  Trusted and experienced doctors.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-[#0C8CE9] mt-1" />
                <p className="text-gray-700 text-sm md:text-base font-p">
                  Fast online appointment booking.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-[#0C8CE9] mt-1" />
                <p className="text-gray-700 text-sm md:text-base">
                  Secure medical records and patient privacy.
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => setOpenModal(true)}
              className="mt-8 bg-[#0C8CE9] hover:opacity-90 text-white px-7 py-3 rounded-full font-semibold shadow-lg transition duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black font-main">
              Why Choose Us
            </h2>

            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We provide modern healthcare services with trusted doctors and
              advanced medical support.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Card 1 */}
            <div className="bg-[#f8fbff] p-6 rounded-2xl text-center shadow-md hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-[#0C8CE9] flex items-center justify-center mx-auto">
                <FaUserMd size={26} />
              </div>

              <h3 className="text-lg font-bold mt-5 text-[#0C8CE9]">
                Expert Doctors
              </h3>

              <p className="text-gray-600 text-sm mt-3 leading-6">
                Experienced doctors for better healthcare support.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#f8fbff] p-6 rounded-2xl text-center shadow-md hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center mx-auto">
                <FaHeartbeat size={26} />
              </div>

              <h3 className="text-lg font-bold mt-5 text-pink-500">
                Emergency Care
              </h3>

              <p className="text-gray-600 text-sm mt-3 leading-6">
                Quick emergency services for urgent medical needs.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#f8fbff] p-6 rounded-2xl text-center shadow-md hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto">
                <FaHospital size={26} />
              </div>

              <h3 className="text-lg font-bold mt-5 text-green-500">
                Modern Hospital
              </h3>

              <p className="text-gray-600 text-sm mt-3 leading-6">
                Advanced healthcare technology and facilities.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#f8fbff] p-6 rounded-2xl text-center shadow-md hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center mx-auto">
                <FaAward size={26} />
              </div>

              <h3 className="text-lg font-bold mt-5 text-yellow-500">
                Quality Service
              </h3>

              <p className="text-gray-600 text-sm mt-3 leading-6">
                Reliable and patient-friendly healthcare services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black font-main">
              Meet Our Doctors
            </h2>

            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our experienced doctors are always ready to provide the best care.
            </p>
          </div>

          {/* Team Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Doctor 1 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
              <img
                src={team1}
                alt="Doctor"
                className="w-full h-80 object-cover"
              />

              <div className="p-6 text-center">
                <h3 className="text-xl font-bold font-main text-black">
                  Dr. John Smith
                </h3>

                <p className="text-[#0C8CE9] mt-2 text-sm">Cardiologist</p>
              </div>
            </div>

            {/* Doctor 2 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
              <img
                src={team2}
                alt="Doctor"
                className="w-full h-80 object-cover"
              />

              <div className="p-6 text-center">
                <h3 className="text-xl font-bold font-main text-black">
                  Dr. Sarah Lee
                </h3>

                <p className="text-[#0C8CE9] mt-2 text-sm">Neurologist</p>
              </div>
            </div>

            {/* Doctor 3 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
              <img
                src={team3}
                alt="Doctor"
                className="w-full h-80 object-cover"
              />

              <div className="p-6 text-center">
                <h3 className="text-xl font-bold font-main text-black">
                  Dr. Michael Brown
                </h3>

                <p className="text-[#0C8CE9] mt-2 text-sm">Pediatrician</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
