import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaBriefcaseMedical,
  FaStar,
  FaLock,
  FaHeadset,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaHospital,
  FaVideo,
  FaHistory,
} from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";
import bookingBanner from "../assets/booking_banner.png";

const BookAppointment = () => {
  const { id } = useParams(); // Doctor ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedDateObj, setSelectedDateObj] = useState(new Date());

  // Available Time Slots
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // Patient Info Inputs
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientGender, setPatientGender] = useState("Male");
  const [patientDob, setPatientDob] = useState("");

  // Appointment Type Input
  const [appointmentType, setAppointmentType] = useState("In-Person Visit");

  // Reason Input
  const [reason, setReason] = useState("");

  // Submit loading state
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch doctor data and prefill patient info from current logged-in user
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/doctors/${id}`);
        setDoctor(res.data);
        if (res.data.slots && res.data.slots.length > 0) {
          setSelectedTimeSlot(res.data.slots[0]);
        } else {
          setSelectedTimeSlot("10:00 am");
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        Swal.fire("Error", "Could not retrieve doctor details.", "error");
        navigate("/find-doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    if (user) {
      setPatientName(user.name || "");
      setPatientEmail(user.email || "");
      setPatientPhone(user.phone || "");
      setPatientGender(user.gender || "Male");
      if (user.dob) {
        // Format dob to YYYY-MM-DD for date inputs
        const formattedDate = user.dob.split("T")[0];
        setPatientDob(formattedDate);
      }
    }
  }, [id, user, navigate]);

  // Calendar Helper Functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    // Limit to current month
    const now = new Date();
    if (prev.getMonth() < now.getMonth() && prev.getFullYear() <= now.getFullYear()) {
      return;
    }
    setCurrentMonth(prev);
    setSelectedDay(1);
    updateSelectedDate(prev, 1);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(next);
    setSelectedDay(1);
    updateSelectedDate(next, 1);
  };

  const updateSelectedDate = (monthDate, day) => {
    const target = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    setSelectedDateObj(target);
  };

  const handleDaySelect = (day) => {
    const today = new Date();
    const target = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Don't select past days
    today.setHours(0, 0, 0, 0);
    if (target < today) {
      return;
    }
    setSelectedDay(day);
    setSelectedDateObj(target);
  };

  // Format date helper: "Wednesday, 22 May 2026"
  const formatDateFriendly = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTimeSlot) {
      return Swal.fire("Required", "Please select an appointment time slot.", "warning");
    }

    try {
      setSubmitLoading(true);
      const bookingData = {
        doctor: doctor._id,
        date: selectedDateObj.toISOString().split("T")[0],
        time: selectedTimeSlot,
        patientName,
        patientPhone,
        patientEmail,
        patientGender,
        patientDob,
        appointmentType,
        reason,
      };

      await api.post("/appointments", bookingData);

      Swal.fire({
        icon: "success",
        title: "Appointment Requested!",
        text: `Your appointment with ${doctor.name} has been successfully submitted.`,
        confirmButtonColor: "#0C8CE9",
      });

      navigate("/user");
    } catch (err) {
      console.error(err);
      Swal.fire("Booking Failed", err.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb]">
        <BeatLoader color="#0C8CE9" size={15} />
      </div>
    );
  }

  if (!doctor) return null;

  // Calendar rendering variables
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const blankCells = Array(firstDayIndex).fill(null);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarCells = [...blankCells, ...daysArray];

  const defaultSlots = [
    "09:00 am",
    "09:30 am",
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
    "04:00 pm",
    "04:30 pm",
    "05:00 pm",
  ];
  const timeSlots = doctor.slots && doctor.slots.length > 0 ? doctor.slots : defaultSlots;

  return (
    <div className="bg-[#f4f7fb] min-h-screen pb-16 font-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs font-bold text-gray-500 flex items-center gap-2">
          <Link to="/" className="text-[#0C8CE9] hover:underline">Home</Link>
          <span>&gt;</span>
          <Link to="/find-doctors" className="text-[#0C8CE9] hover:underline">Doctors</Link>
          <span>&gt;</span>
          <Link to={`/doctors/${doctor._id}`} className="text-[#0C8CE9] hover:underline">{doctor.name}</Link>
          <span>&gt;</span>
          <span className="text-gray-600">Book Appointment</span>
        </nav>

        {/* Hero Header Banner Card */}
        <div className="bg-gradient-to-r from-[#e8f2fc] to-[#f4f8fc] rounded-[32px] overflow-hidden relative shadow-sm border border-gray-100 min-h-[220px] flex items-center">
          <div className="relative z-10 px-8 lg:px-12 py-8 w-full lg:w-3/5 space-y-3">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0b1220] tracking-tight">
              Book Appointment
            </h1>
            <p className="text-gray-500 text-sm font-semibold leading-relaxed max-w-md">
              Fill in the details below to book an appointment with{" "}
              <span className="text-[#0C8CE9] font-bold">{doctor.name}</span>
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-2/5 hidden lg:flex items-center justify-end pr-8">
            <img
              src={bookingBanner}
              alt="Doctor Patient Consultation"
              className="h-full object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Form and Sidebar Container */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Booking Form (Left Columns) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-gray-100 space-y-8">
            
            <form onSubmit={handleBookingSubmit} className="space-y-8">
              
              {/* SECTION 1: Select Appointment Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg">
                  <span className="w-6 h-6 rounded-full bg-[#0C8CE9] text-white text-xs flex items-center justify-center font-bold">1</span>
                  <h3>Select Appointment Details</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-2">
                  
                  {/* Custom Calendar Widget */}
                  <div className="border border-gray-200 rounded-3xl p-4 bg-white shadow-sm">
                    {/* Calendar Month Header */}
                    <div className="flex items-center justify-between mb-4 px-1">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="text-gray-500 hover:text-blue-500 p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition"
                      >
                        <FaChevronLeft size={10} />
                      </button>
                      <span className="font-extrabold text-sm text-[#0b1220]">{monthName}</span>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="text-gray-500 hover:text-blue-500 p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition"
                      >
                        <FaChevronRight size={10} />
                      </button>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 uppercase mb-2">
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>

                    {/* Grid Days */}
                    <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs">
                      {calendarCells.map((day, idx) => {
                        if (day === null) {
                          return <div key={`empty-${idx}`} className="p-2"></div>;
                        }

                        const targetDateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isPast = targetDateObj < today;
                        const isSelected = selectedDay === day && selectedDateObj.getMonth() === currentMonth.getMonth() && selectedDateObj.getFullYear() === currentMonth.getFullYear();

                        return (
                          <button
                            key={`day-${day}`}
                            type="button"
                            disabled={isPast}
                            onClick={() => handleDaySelect(day)}
                            className={`p-2.5 rounded-xl transition duration-200 text-center ${
                              isSelected
                                ? "bg-[#0C8CE9] text-white shadow-md shadow-blue-100"
                                : isPast
                                ? "text-gray-200 cursor-not-allowed"
                                : "text-gray-600 hover:bg-sky-50/50 hover:text-[#0C8CE9]"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots Selector */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Time</p>
                    <div className="grid grid-cols-2 gap-3.5">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-3 px-2 rounded-2xl text-xs font-bold border-2 transition-all duration-300 ${
                            selectedTimeSlot === slot
                              ? "bg-[#0C8CE9] border-[#0C8CE9] text-white shadow-md shadow-blue-100"
                              : "border-gray-200 text-gray-600 hover:border-[#0C8CE9] hover:text-[#0C8CE9] bg-white"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 2: Patient Information */}
              <div className="space-y-5 border-t pt-6">
                <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg">
                  <span className="w-6 h-6 rounded-full bg-[#0C8CE9] text-white text-xs flex items-center justify-center font-bold">2</span>
                  <h3>Patient Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-3.5 bg-white focus-within:border-[#0C8CE9] transition">
                      <FaUser className="text-gray-400 mr-3" />
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Enter your full name"
                        className="outline-none w-full bg-transparent text-sm font-semibold text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-3.5 bg-white focus-within:border-[#0C8CE9] transition">
                      <FaPhoneAlt className="text-gray-400 mr-3" />
                      <input
                        type="tel"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="outline-none w-full bg-transparent text-sm font-semibold text-gray-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  {/* Email Address */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-3.5 bg-white focus-within:border-[#0C8CE9] transition">
                      <FaEnvelope className="text-gray-400 mr-3" />
                      <input
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="outline-none w-full bg-transparent text-sm font-semibold text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  {/* Gender Selector (radios) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                    <div className="flex items-center justify-between border border-gray-200 rounded-2xl px-4 py-3.5 h-[54px] bg-white text-xs font-bold text-gray-600">
                      {["Male", "Female", "Other"].map((g) => (
                        <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="patient-gender"
                            checked={patientGender === g}
                            onChange={() => setPatientGender(g)}
                            className="radio radio-primary radio-xs"
                          />
                          <span>{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                    <input
                      type="date"
                      value={patientDob}
                      onChange={(e) => setPatientDob(e.target.value)}
                      className="w-full border border-gray-200 p-3.5 rounded-2xl outline-none focus:border-[#0C8CE9] bg-white text-sm font-semibold text-gray-800"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Appointment Type */}
              <div className="space-y-5 border-t pt-6">
                <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg">
                  <span className="w-6 h-6 rounded-full bg-[#0C8CE9] text-white text-xs flex items-center justify-center font-bold">3</span>
                  <h3>Appointment Type</h3>
                </div>

                {/* 3 Option Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-main">
                  {[
                    { id: "In-Person Visit", title: "In-Person Visit", desc: "Visit the doctor at the clinic", icon: <FaHospital className="text-xl" /> },
                    { id: "Video Consultation", title: "Video Consultation", desc: "Consult with doctor online", icon: <FaVideo className="text-xl" /> },
                    { id: "Follow-up Visit", title: "Follow-up Visit", desc: "For existing treatment", icon: <FaHistory className="text-xl" /> },
                  ].map((type) => {
                    const isActive = appointmentType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setAppointmentType(type.id)}
                        className={`p-4 rounded-2xl border-2 text-left transition duration-300 flex items-start gap-3.5 ${
                          isActive
                            ? "border-[#0C8CE9] bg-blue-50/50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className={`p-3 rounded-xl ${isActive ? "bg-[#0C8CE9] text-white" : "bg-blue-50 text-[#0C8CE9]"} shrink-0`}>
                          {type.icon}
                        </div>
                        <div className="space-y-1 mt-0.5">
                          <h4 className="font-extrabold text-slate-800 text-sm">{type.title}</h4>
                          <p className="text-[10px] text-gray-500 font-bold leading-normal">{type.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: Problem/Reason for Visit */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg">
                  <span className="w-6 h-6 rounded-full bg-[#0C8CE9] text-white text-xs flex items-center justify-center font-bold">4</span>
                  <h3>Problem/Reason for Visit</h3>
                </div>

                <div className="space-y-2 relative">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value.slice(0, 500))}
                    placeholder="Describe your problem or reason for the visit"
                    rows="4"
                    maxLength="500"
                    className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:border-[#0C8CE9] bg-white text-sm font-semibold text-gray-800 resize-none"
                    required
                  ></textarea>
                  <p className="absolute bottom-3 right-4 text-[10px] text-gray-400 font-bold">
                    {reason.length}/500
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-[#0C8CE9] hover:bg-blue-600 disabled:bg-gray-300 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg shadow-blue-100 flex items-center gap-2 transition duration-300 cursor-pointer"
                >
                  {submitLoading ? "Submitting Request..." : "Continue to Confirm"}
                  <FaArrowRight />
                </button>
              </div>

            </form>
          </div>

          {/* Right Summary Card Sidebar */}
          <div className="space-y-6">
            
            {/* Summary Card */}
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-md space-y-6">
              
              <h3 className="text-slate-800 font-black text-lg border-b pb-3.5">Appointment Summary</h3>
              
              {/* Doctor Miniprofile */}
              <div className="flex items-center gap-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-14 h-14 rounded-full object-cover bg-sky-50 shadow-inner"
                />
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base">{doctor.name}</h4>
                  <p className="text-gray-500 font-bold text-xs">{doctor.specialization}</p>
                  <p className="text-[#0C8CE9] font-bold text-[10px] mt-0.5">{doctor.experience}+ Years Experience</p>
                </div>
              </div>

              {/* Details table list */}
              <div className="space-y-4 pt-4 border-t border-gray-100 font-bold text-xs text-gray-500">
                
                {/* Date */}
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-[#0C8CE9] mt-0.5 text-sm shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">Date</p>
                    <p className="text-slate-800 mt-0.5">{formatDateFriendly(selectedDateObj)}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3">
                  <FaClock className="text-[#0C8CE9] mt-0.5 text-sm shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">Time</p>
                    <p className="text-slate-800 mt-0.5">{selectedTimeSlot || "Not Selected"}</p>
                  </div>
                </div>

                {/* Appointment Type */}
                <div className="flex items-start gap-3">
                  <FaBriefcaseMedical className="text-[#0C8CE9] mt-0.5 text-sm shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">Appointment Type</p>
                    <p className="text-slate-800 mt-0.5">{appointmentType}</p>
                  </div>
                </div>

                {/* Fee */}
                <div className="flex items-start gap-3">
                  <FaStar className="text-yellow-400 mt-0.5 text-sm shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">Consultation Fee</p>
                    <p className="text-slate-800 mt-0.5">৳{doctor.fees} <span className="text-[10px] font-semibold text-gray-400 ml-1">(Including VAT)</span></p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <FaHospital className="text-[#0C8CE9] mt-0.5 text-sm shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">Location</p>
                    <p className="text-slate-800 mt-0.5 leading-normal">
                      Green Life Hospital, Dhaka.<br />
                      <span className="text-[10px] font-semibold text-gray-400">House #45, Road #12, Dhanmondi, Dhaka-1209</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Secure Info Alert */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
                <FaLock className="text-green-600 mt-0.5 text-sm shrink-0" />
                <div className="space-y-0.5 text-[10px] font-bold text-green-700 leading-normal">
                  <p>Secure & Confidential</p>
                  <p className="font-semibold text-green-600/95">Your information is secure and will not be shared with anyone.</p>
                </div>
              </div>

            </div>

            {/* Need Help support widget */}
            <div className="bg-gradient-to-b from-[#e8f2fc] to-white rounded-[32px] p-6 border border-gray-100 text-center shadow-sm space-y-4">
              <div className="w-12 h-12 bg-white text-[#0C8CE9] rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <FaHeadset size={20} />
              </div>
              <h4 className="font-extrabold text-black text-base">Need Help?</h4>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Our support team is here to help you.
              </p>
              <Link
                to="/contact"
                className="w-full inline-block border-2 border-[#0C8CE9] text-[#0C8CE9] hover:bg-[#0C8CE9] hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-300"
              >
                Contact support
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BookAppointment;
