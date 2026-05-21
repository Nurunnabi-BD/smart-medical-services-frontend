import { useState } from "react";
import {
  FaArrowRight,
  FaUserMd,
  FaVideo,
  FaFileMedical,
  FaAmbulance,
  FaBell,
  FaHeartbeat,
  FaTimes,
} from "react-icons/fa";

export default function ServicesPage() {
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

  const services = [
    {
      icon: <FaUserMd />,
      color: "blue",
      title: "Doctor Appointment",
      desc: "Book appointments with specialist doctors easily.",
      details: `✔ Easy online booking
✔ Verified specialist doctors
✔ Instant confirmation
✔ 24/7 support system`,
    },
    {
      icon: <FaVideo />,
      color: "purple",
      title: "Video Consultation",
      desc: "Consult with doctors online through secure video calls.",
      details: `✔ HD video calling system
✔ Secure private consultation
✔ No need to visit hospital
✔ Available anytime anywhere`,
    },
    {
      icon: <FaFileMedical />,
      color: "green",
      title: "Medical Reports",
      desc: "Access and manage medical reports anytime.",
      details: `✔ Digital report storage
✔ Easy access anytime
✔ Prescription history saved
✔ Secure data protection`,
    },
    {
      icon: <FaAmbulance />,
      color: "red",
      title: "Emergency Support",
      desc: "Get instant emergency support and ambulance services.",
      details: `✔ Fast ambulance response
✔ 24/7 emergency help
✔ One click emergency call
✔ Nearby hospital support`,
    },
    {
      icon: <FaBell />,
      color: "yellow",
      title: "Medicine Reminder",
      desc: "Receive reminders for medicines and health checkups.",
      details: `✔ Smart medicine alerts
✔ Daily reminder system
✔ Missed dose notification
✔ Health schedule tracking`,
    },
    {
      icon: <FaHeartbeat />,
      color: "pink",
      title: "Health Monitoring",
      desc: "Track your health data and medical history securely.",
      details: `✔ Health data tracking
✔ Heart rate monitoring support
✔ Medical history record
✔ Personal health dashboard`,
    },
  ];

  const colorMap = {
    blue: "text-blue-600 bg-blue-100",
    purple: "text-purple-600 bg-purple-100",
    green: "text-green-600 bg-green-100",
    red: "text-red-600 bg-red-100",
    yellow: "text-yellow-600 bg-yellow-100",
    pink: "text-pink-600 bg-pink-100",
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0C8CE9] mb-4">
            Our Medical Services
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Smart Medical Services Platform provides modern healthcare
            solutions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl border border-blue-100 hover:-translate-y-3 transition-all duration-300"
            >
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 ${colorMap[s.color]}`}
              >
                {s.icon}
              </div>

              <h2 className="text-2xl font-bold text-center mb-3 text-[#0C8CE9]">
                {s.title}
              </h2>

              <p className="text-gray-600 text-center">{s.desc}</p>

              <button
                onClick={() => openModal(s.title, s.desc, s.details)}
                className="flex items-center gap-2 mx-auto mt-6 font-semibold text-[#0C8CE9]"
              >
                Learn More <FaArrowRight />
              </button>
            </div>
          ))}
        </div>
        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-300 to-[#0C8CE9] rounded-[35px] py-16 px-8 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-5">
            Need Medical Help Right Now?
          </h2>

          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Book an appointment, consult doctors online, or get emergency
            support instantly through our Smart Medical Platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#0C8CE9] font-semibold px-8 py-4 rounded-2xl hover:bg-blue-100 transition">
              Book Appointment
            </button>

            <button className="bg-blue-800 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-blue-900 transition">
              Emergency Call
            </button>
          </div>
        </div>

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
      </div>
    </div>
  );
}
