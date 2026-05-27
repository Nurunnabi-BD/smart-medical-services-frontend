import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaBriefcaseMedical,
  FaStar,
  FaPhoneAlt,
  FaHospital,
  FaVideo,
  FaUser,
  FaRegComments,
  FaHeadset,
  FaHeartbeat,
} from "react-icons/fa";
import api from "../api/axios";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab State (for sidebar scroll alignment or highlight)
  const [activeTab, setActiveTab] = useState("overview");



  // Fetch Doctor details
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Failed to fetch doctor details:", err);
        Swal.fire({
          icon: "error",
          title: "Doctor Not Found",
          text: "The requested doctor profile could not be retrieved.",
        });
        navigate("/find-doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id, navigate]);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb]">
        <BeatLoader color="#0C8CE9" size={15} />
      </div>
    );
  }

  if (!doctor) return null;

  // Render dummy education & reviews based on doctor specialization dynamically
  const degreesMap = {
    Cardiologist: "MBBS, MD (Cardiology) - BSMMU",
    Neurologist: "MBBS, MD (Neurology) - DMC",
    Dermatologist: "MBBS, DDV (Dermatology) - SSMC",
    Pediatrician: "MBBS, FCPS (Pediatrics) - BSMMU",
    Orthopedic: "MBBS, MS (Orthopedics) - NITOR",
    Gynecologist: "MBBS, FCPS (Gynae & Obs) - DMC",
  };

  const specializationsList = {
    Cardiologist: ["Interventional Cardiology", "Cardiac Consultation", "Heart Disease Treatments", "Preventive Cardiology"],
    Neurologist: ["Clinical Neurology", "Stroke Treatment", "Epilepsy Management", "Neuromuscular Disorders"],
    Dermatologist: ["Laser Skin Surgery", "Acne Treatment", "Anti-aging Solutions", "Allergy Care"],
    Pediatrician: ["Child Development", "Pediatric Immunology", "Neonatal Care", "Child Nutrition"],
    Orthopedic: ["Joint Replacement Surgery", "Sports Injuries Clinic", "Spine Care", "Fracture Management"],
    Gynecologist: ["High-Risk Pregnancy Care", "Infertility Consult", "Laparoscopic Gynae Surgery", "Maternal Care"],
  };

  const degrees = degreesMap[doctor.specialization] || "MBBS, MD - Dhaka Medical College";
  const specialtiesArr = specializationsList[doctor.specialization] || ["General Medicine", "Primary Care Consultation", "Preventive Health"];

  return (
    <div className="bg-[#f4f7fb] min-h-screen pb-16 font-main">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Breadcrumb Header */}
        <nav className="text-xs font-bold text-gray-500 flex items-center gap-2">
          <Link to="/" className="text-[#0C8CE9] hover:underline">Home</Link>
          <span>&gt;</span>
          <Link to="/find-doctors" className="text-[#0C8CE9] hover:underline">Doctors</Link>
          <span>&gt;</span>
          <span className="text-gray-600">{doctor.name}</span>
        </nav>

        {/* ================= 1. TOP HEADER DOCTOR CARD ================= */}
        <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between gap-8">
          
          {/* Main Info */}
          <div className="flex flex-col sm:flex-row gap-6 flex-1">
            {/* Picture */}
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full sm:w-48 h-48 object-cover rounded-3xl shadow bg-sky-50 shrink-0"
            />
            {/* Text description */}
            <div className="space-y-3.5">
              <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Available
              </span>
              <h1 className="text-3xl font-extrabold text-[#0b1220] tracking-tight">{doctor.name}</h1>
              <p className="text-[#0C8CE9] font-bold text-sm">{doctor.specialization}</p>
              <p className="text-gray-600 text-sm font-semibold">{degrees}</p>

              <div className="space-y-2 text-xs text-gray-500 font-bold border-t pt-3">
                <p className="flex items-center gap-2">
                  <FaBriefcaseMedical className="text-[#0C8CE9]" />
                  {doctor.experience}+ Years Experience
                </p>
                <p className="flex items-center gap-2">
                  <FaHospital className="text-[#0C8CE9]" />
                  Green Life Hospital
                </p>
                <p className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  {doctor.rating} (120)
                </p>
              </div>

              {/* Header Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  onClick={() => navigate(`/doctors/${doctor._id}/book`)}
                  className="bg-[#0C8CE9] hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 text-sm transition shadow-md shadow-blue-100"
                >
                  <FaCalendarAlt />
                  Book Appointment
                </button>

                <button
                  onClick={() => {
                    if (doctor && doctor.user) {
                      navigate(`/user?chat=${doctor.user}`);
                    } else {
                      Swal.fire("Error", "Could not open chat with this doctor profile.", "error");
                    }
                  }}
                  className="border-2 border-gray-200 text-gray-600 hover:border-[#0C8CE9] hover:text-[#0C8CE9] bg-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 text-sm transition"
                >
                  <FaRegComments />
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Consultation Fee Card */}
          <div className="lg:w-80 bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-between shadow-sm bg-gradient-to-b from-[#fbfcff] to-white">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Consultation Fee</p>
                <h2 className="text-3xl font-black text-slate-800 mt-1 flex items-baseline">
                  ৳{doctor.fees} <span className="text-xs text-gray-500 font-semibold ml-2">(including VAT)</span>
                </h2>
              </div>

              <div className="space-y-2.5 text-xs text-gray-500 font-bold">
                <p className="flex items-center gap-2"><FaVideo className="text-[#0C8CE9]" /> Video Consultation</p>
                <p className="flex items-center gap-2"><FaUser className="text-[#0C8CE9]" /> In-person Consultation</p>
                <p className="flex items-center gap-2 text-green-600"><FaClock /> Available today</p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/doctors/${doctor._id}/book`)}
              className="w-full mt-6 bg-blue-50 hover:bg-[#0C8CE9] text-[#0C8CE9] hover:text-white py-3.5 rounded-2xl font-bold transition duration-300 text-sm text-center"
            >
              Book Now
            </button>
          </div>

        </div>

        {/* ================= 2. BOTTOM DETAILS ROW (Sidebar + Tabs + Clinic Info) ================= */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Vertical Sidebar Tabs (Left) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-1.5">
              {[
                { id: "overview", name: "Overview" },
                { id: "about", name: "About" },
                { id: "education", name: "Education" },
                { id: "experience", name: "Experience" },
                { id: "specializations", name: "Specializations" },
                { id: "reviews", name: "Reviews(120)" },
                { id: "availability", name: "Availability" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`w-full flex items-center px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-[#0C8CE9] border-l-4 border-[#0C8CE9]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-slate-800"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Need Help Card */}
            <div className="bg-gradient-to-b from-[#e8f2fc] to-white rounded-3xl p-6 border border-gray-100 text-center shadow-sm space-y-4">
              <div className="w-12 h-12 bg-white text-[#0C8CE9] rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <FaHeadset size={20} />
              </div>
              <h4 className="font-extrabold text-black text-base">Need Help?</h4>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Our medical support desk is available to assist you.
              </p>
              <Link
                to="/contact"
                className="w-full inline-block border-2 border-[#0C8CE9] text-[#0C8CE9] hover:bg-[#0C8CE9] hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-300"
              >
                Contact support
              </Link>
            </div>
          </div>

          {/* Main Details Center Tabs (Center 2-Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Doctor Section */}
            <div id="about" className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
              <h3 className="text-xl font-bold text-slate-800 border-b pb-3.5">About Doctor</h3>
              <p className="text-gray-500 text-sm font-semibold leading-7">
                {doctor.name} is a renowned {doctor.specialization} with over {doctor.experience} years of experience in diagnosing and treating specialized disorders. Dedicated to providing premium patient care and modern evidence-based solutions.
              </p>

              {/* Highlights cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { label: "Experience", val: `${doctor.experience}+ Yr` },
                  { label: "Patient Treated", val: "5000+" },
                  { label: "Satisfaction Rate", val: "98%" },
                  { label: "Awards Received", val: "10+" },
                ].map((stat, i) => (
                  <div key={i} className="border border-gray-100 bg-gray-50/50 p-4 rounded-2xl">
                    <h4 className="text-xl font-black text-[#0b1220]">{stat.val}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div id="education" className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-800 border-b pb-3.5">Education</h3>
              
              {/* Timeline list */}
              <div className="relative pl-6 border-l-2 border-blue-100 space-y-6 ml-2 text-sm">
                {[
                  { degree: `MD (${doctor.specialization})`, place: "Dhaka Medical College & Hospital (DMC)", year: "2017" },
                  { degree: "MBBS Degree", place: "Dhaka Medical College (DMC)", year: "2014" },
                ].map((edu, i) => (
                  <div key={i} className="relative space-y-1">
                    {/* Blue dot on line */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 bg-white border-4 border-[#0C8CE9] rounded-full"></div>
                    <div className="flex justify-between items-baseline gap-4">
                      <h4 className="font-extrabold text-[#0b1220]">{edu.degree}</h4>
                      <span className="text-xs text-gray-400 font-bold">{edu.year}</span>
                    </div>
                    <p className="text-gray-500 font-semibold text-xs">{edu.place}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div id="experience" className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-800 border-b pb-3.5">Experience</h3>
              
              {/* Timeline list */}
              <div className="relative pl-6 border-l-2 border-blue-100 space-y-6 ml-2 text-sm">
                {[
                  { role: `Senior Consultant - ${doctor.specialization}`, place: "Green Life Hospital, Dhaka.", years: "2019-Present", color: "text-green-600" },
                  { role: `Consultant - ${doctor.specialization}`, place: "Labaid Cardiac Hospital, Dhaka.", years: "2017-2019", color: "text-gray-400" },
                  { role: "Junior Consultant", place: "National Heart Foundation Hospital.", years: "2015-2017", color: "text-gray-400" },
                ].map((exp, i) => (
                  <div key={i} className="relative space-y-1">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 bg-white border-4 border-[#0C8CE9] rounded-full"></div>
                    <div className="flex justify-between items-baseline gap-4">
                      <h4 className="font-extrabold text-[#0b1220]">{exp.role}</h4>
                      <span className="text-xs font-bold text-gray-400">{exp.years}</span>
                    </div>
                    <p className="text-gray-500 font-semibold text-xs">{exp.place}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column Details */}
          <div className="space-y-6">
            
            {/* Specializations list */}
            <div id="specializations" className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Specializations</h3>
              <div className="space-y-3 font-semibold text-sm text-gray-600">
                {specialtiesArr.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0C8CE9] flex items-center justify-center text-xs shrink-0">
                      <FaHeartbeat />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinic Info */}
            <div id="availability" className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Clinic Information</h3>
              <div className="space-y-3 text-xs text-gray-500 font-semibold">
                <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#0C8CE9]" /> Green Life Hospital, Dhaka.</p>
                <p className="flex items-center gap-2"><FaClock className="text-[#0C8CE9]" /> Mon-Sat (10:00 am - 8:00 pm)</p>
                <p className="flex items-center gap-2"><FaPhoneAlt className="text-[#0C8CE9]" /> +880 1712-345892</p>
              </div>
              <button
                onClick={() =>
                  Swal.fire({
                    title: "Clinic Location",
                    text: "Opening coordinates of Green Life Hospital, Dhaka.",
                    icon: "info",
                    confirmButtonColor: "#0C8CE9",
                  })
                }
                className="w-full mt-4 bg-blue-50 text-[#0C8CE9] hover:bg-[#0C8CE9] hover:text-white py-2 rounded-xl text-xs font-bold transition duration-300"
              >
                View on Map
              </button>
            </div>

          </div>

        </div>

        {/* ================= 3. BOTTOM SECTION: REVIEWS ================= */}
        <div id="reviews" className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Patient Reviews</h3>
          
          <div className="grid md:grid-cols-4 gap-6 items-center border-b pb-6">
            {/* Average score */}
            <div className="text-center md:border-r border-gray-100 space-y-2">
              <h2 className="text-6xl font-black text-slate-800">{doctor.rating}</h2>
              <div className="flex justify-center text-yellow-400 gap-1 text-sm">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="text-xs text-gray-400 font-bold">(120 Reviews)</p>
            </div>

            {/* Individual Review cards list */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Farhan Ahmed", text: "Great doctor! He listens carefully and explains everything very well.", date: "2 days ago" },
                { name: "Nusrat Jahan", text: "Very professional and kind behaviour. Highly recommended.", date: "1 week ago" },
                { name: "Shakila Islam", text: "Excellent Consultation and clinic management. Thank you doctor.", date: "2 weeks ago" },
              ].map((rev, i) => (
                <div key={i} className="border border-gray-100 bg-gray-50/50 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0C8CE9] font-bold text-xs flex items-center justify-center">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-black text-xs truncate max-w-[100px]">{rev.name}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold">{rev.date}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 text-[10px] gap-0.5">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed line-clamp-3">
                      "{rev.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>


    </div>
  );
};

export default DoctorDetails;
