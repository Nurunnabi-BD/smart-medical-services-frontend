import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0C8CE9]">
            Contact Us
          </h1>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Have questions? We are here to help you anytime with medical support and service inquiries.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT SIDE - INFO */}
          <div className="space-y-6">

            <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-[#0C8CE9] flex items-center justify-center rounded-full">
                <FaPhone />
              </div>
              <div>
                <h3 className="font-bold">Phone</h3>
                <p className="text-gray-600">+880 1XXXXXXXXX</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                <FaEnvelope />
              </div>
              <div>
                <h3 className="font-bold">Email</h3>
                <p className="text-gray-600">support@smartmedical.com</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 flex items-center justify-center rounded-full">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3 className="font-bold">Location</h3>
                <p className="text-gray-600">Chattogram, Bangladesh</p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="bg-white p-8 rounded-3xl shadow-xl">

            <h2 className="text-2xl font-bold text-[#0C8CE9] mb-6">
              Send Message
            </h2>

            <form className="space-y-4">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-[#0C8CE9] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              >
                Send Message <FaPaperPlane />
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}