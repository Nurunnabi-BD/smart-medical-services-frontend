import { useMemo, useState, useEffect } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaFilter,
  FaStar,
  FaBriefcaseMedical,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import api from "../api/axios";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

import Doctor_section from "../assets/doctor-section.png";

const Doctors = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allDoctors, setAllDoctors] = useState([]);

  // SEARCH STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedSpecialtySearch, setSelectedSpecialtySearch] = useState("All");

  // TRIGGER SEARCH STATES (On click search button)
  const [appliedSearch, setAppliedSearch] = useState("");

  // SIDEBAR FILTER STATES
  const [selectedSpecialties, setSelectedSpecialties] = useState(["All"]);
  const [experience, setExperience] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [gender, setGender] = useState("All");

  // COLLAPSIBLE SIDEBAR CATEGORIES
  const [collapseSpecialties, setCollapseSpecialties] = useState(false);
  const [collapseExperience, setCollapseExperience] = useState(false);
  const [collapseAvailability, setCollapseAvailability] = useState(false);
  const [collapseGender, setCollapseGender] = useState(false);

  // BOOKING MODAL STATE
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 12; // 3 rows of 4 cards each, matching the design page sizing!

  // Fetch doctors from backend
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctors");
      setAllDoctors(res.data);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      Swal.fire("Error", "Could not fetch doctors list from backend.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Checkbox Handler for Specialties
  const handleSpecialtyCheckboxChange = (spec) => {
    if (spec === "All") {
      setSelectedSpecialties(["All"]);
      setCurrentPage(1);
      return;
    }

    let updated = [...selectedSpecialties].filter((s) => s !== "All");
    if (updated.includes(spec)) {
      updated = updated.filter((s) => s !== spec);
      if (updated.length === 0) {
        updated = ["All"];
      }
    } else {
      updated.push(spec);
    }
    setSelectedSpecialties(updated);
    setCurrentPage(1);
  };

  // Trigger search execution
  const handleSearchSubmit = () => {
    setAppliedSearch(searchQuery);
    if (selectedSpecialtySearch !== "All") {
      setSelectedSpecialties([selectedSpecialtySearch]);
    }
    setCurrentPage(1);
  };

  // FILTER LOGIC
  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doctor) => {
      // 1. Text Search Name/Specialty
      const matchText =
        !appliedSearch ||
        doctor.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(appliedSearch.toLowerCase());

      // 2. Specialty Selection (Checkboxes)
      const matchSpecialty =
        selectedSpecialties.includes("All") ||
        selectedSpecialties.some(
          (spec) => doctor.specialization.toLowerCase() === spec.toLowerCase()
        );

      // 3. Gender
      const matchGender =
        gender === "All" ||
        (gender === "Male" && doctor.gender === "Male") ||
        (gender === "Female" && doctor.gender === "Female") ||
        (gender === "Others" && doctor.gender !== "Male" && doctor.gender !== "Female");

      // 4. Availability
      const matchAvailability =
        availability === "All" ||
        (availability === "Available Today" && doctor.available);

      // 5. Experience
      let matchExperience = true;
      if (experience === "0-5") {
        matchExperience = doctor.experience <= 5;
      } else if (experience === "5-10") {
        matchExperience = doctor.experience > 5 && doctor.experience <= 10;
      } else if (experience === "10+") {
        matchExperience = doctor.experience > 10;
      }

      return matchText && matchSpecialty && matchGender && matchAvailability && matchExperience;
    });
  }, [allDoctors, appliedSearch, selectedSpecialties, gender, availability, experience]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, startIndex + doctorsPerPage);

  // CLEAR FILTERS
  const clearFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setSelectedSpecialtySearch("All");
    setAppliedSearch("");
    setSelectedSpecialties(["All"]);
    setExperience("All");
    setAvailability("All");
    setGender("All");
    setCurrentPage(1);
  };



  // Submit appointment booking
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) {
      return Swal.fire("Required", "Please choose a Date and Time Slot.", "warning");
    }

    setBookingLoading(true);
    try {
      await api.post("/appointments", {
        doctor: selectedDoctor._id,
        date: bookingDate,
        time: bookingTime,
      });

      Swal.fire({
        icon: "success",
        title: "Appointment Requested!",
        text: `Your appointment with ${selectedDoctor.name} has been submitted for approval.`,
        confirmButtonColor: "#0C8CE9",
      });

      setSelectedDoctor(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: err.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const specialtiesList = [
    "Cardiologist",
    "Neurologist",
    "Dermatologist",
    "Paediatrician",
    "Orthopaedic",
    "Gynaecologist",
    "ENT Specialist",
  ];

  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-16 font-main">
      {/* 1. Hero Header Section */}
      <section className="bg-gradient-to-r from-[#f4f8fc] to-[#e8f2fc] relative overflow-hidden py-10 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-12">
          {/* Left Text Column */}
          <div className="z-10">
            <nav className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-2">
              <span className="text-[#0C8CE9] cursor-pointer hover:underline">Home</span>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-600">Doctors</span>
            </nav>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0b1220] tracking-tight leading-tight">
              Find the <span className="text-[#0C8CE9]">Best</span> Doctors
            </h1>

            <p className="text-gray-500 mt-4 text-sm sm:text-base font-semibold max-w-md leading-relaxed">
              Connect with experienced and trusted doctors specialized in different fields
            </p>
          </div>

          {/* Right Banner Image Column */}
          <div className="relative flex justify-center lg:justify-end">
            <img
              src={Doctor_section}
              alt="Doctors"
              className="w-full max-w-xl object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* 2. Floating Search Panel */}
      <div className="max-w-7xl mx-auto px-6 relative -mt-8 z-20">
        <div className="bg-white p-5 rounded-3xl shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Query search */}
          <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-3.5 bg-white">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search doctors, specialities"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none w-full bg-transparent text-sm font-semibold text-gray-800"
            />
          </div>

          {/* Specialty Dropdown */}
          <div className="border border-gray-200 rounded-2xl px-4 py-3.5 bg-white flex items-center">
            <select
              value={selectedSpecialtySearch}
              onChange={(e) => setSelectedSpecialtySearch(e.target.value)}
              className="outline-none w-full bg-transparent text-sm font-semibold text-gray-800 cursor-pointer"
            >
              <option value="All">Specialities</option>
              {specialtiesList.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Location Query */}
          <div className="flex items-center border border-gray-200 rounded-2xl px-4 py-3.5 bg-white">
            <FaMapMarkerAlt className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Location"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="outline-none w-full bg-transparent text-sm font-semibold text-gray-800"
            />
          </div>

          {/* Trigger button */}
          <button
            onClick={handleSearchSubmit}
            className="bg-[#0C8CE9] hover:bg-blue-600 text-white font-bold py-3.5 rounded-2xl transition duration-300 shadow-md shadow-blue-100 flex items-center justify-center gap-2"
          >
            Search
          </button>
        </div>
      </div>

      {/* 3. Main Filter & Cards Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTERS (Left Column) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md h-fit space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              Filters
            </h2>
            <FaFilter className="text-[#0C8CE9]" />
          </div>

          {/* Category A: Specialities Checkboxes */}
          <div className="border-b pb-6">
            <button
              onClick={() => setCollapseSpecialties(!collapseSpecialties)}
              className="w-full flex items-center justify-between text-base font-bold text-slate-800 mb-4"
            >
              <span>Specialities</span>
              {collapseSpecialties ? <FaChevronDown size={14} /> : <FaChevronUp size={14} />}
            </button>

            {!collapseSpecialties && (
              <div className="space-y-3 pl-1">
                {/* All Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer text-sm font-bold text-gray-600 hover:text-[#0C8CE9] transition">
                  <input
                    type="checkbox"
                    checked={selectedSpecialties.includes("All")}
                    onChange={() => handleSpecialtyCheckboxChange("All")}
                    className="checkbox checkbox-primary checkbox-sm border-gray-300 rounded-md"
                  />
                  <span>All Specialities</span>
                </label>

                {/* Individual Checkboxes */}
                {specialtiesList.map((spec) => (
                  <label
                    key={spec}
                    className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-gray-600 hover:text-[#0C8CE9] transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSpecialties.includes(spec)}
                      onChange={() => handleSpecialtyCheckboxChange(spec)}
                      className="checkbox checkbox-primary checkbox-sm border-gray-300 rounded-md"
                    />
                    <span>{spec}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Category B: Experience Radios */}
          <div className="border-b pb-6">
            <button
              onClick={() => setCollapseExperience(!collapseExperience)}
              className="w-full flex items-center justify-between text-base font-bold text-slate-800 mb-4"
            >
              <span>Experience</span>
              {collapseExperience ? <FaChevronDown size={14} /> : <FaChevronUp size={14} />}
            </button>

            {!collapseExperience && (
              <div className="space-y-3 pl-1 font-semibold text-sm text-gray-600">
                {[
                  ["All", "All Experience"],
                  ["0-5", "0-5 Years"],
                  ["5-10", "5-10 Years"],
                  ["10+", "10+ Years"],
                ].map(([value, label]) => (
                  <label key={value} className="flex items-center gap-3 cursor-pointer hover:text-[#0C8CE9] transition">
                    <input
                      type="radio"
                      name="experience-radio"
                      checked={experience === value}
                      onChange={() => {
                        setExperience(value);
                        setCurrentPage(1);
                      }}
                      className="radio radio-primary radio-sm"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Category C: Availability Radios */}
          <div className="border-b pb-6">
            <button
              onClick={() => setCollapseAvailability(!collapseAvailability)}
              className="w-full flex items-center justify-between text-base font-bold text-slate-800 mb-4"
            >
              <span>Availability</span>
              {collapseAvailability ? <FaChevronDown size={14} /> : <FaChevronUp size={14} />}
            </button>

            {!collapseAvailability && (
              <div className="space-y-3 pl-1 font-semibold text-sm text-gray-600">
                {[
                  ["All", "All Time"],
                  ["Available Today", "Available Today"],
                  ["Available This Week", "Available This Week"],
                ].map(([value, label]) => (
                  <label key={value} className="flex items-center gap-3 cursor-pointer hover:text-[#0C8CE9] transition">
                    <input
                      type="radio"
                      name="availability-radio"
                      checked={availability === value}
                      onChange={() => {
                        setAvailability(value);
                        setCurrentPage(1);
                      }}
                      className="radio radio-primary radio-sm"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Category D: Gender Radios */}
          <div className="pb-4">
            <button
              onClick={() => setCollapseGender(!collapseGender)}
              className="w-full flex items-center justify-between text-base font-bold text-slate-800 mb-4"
            >
              <span>Gender</span>
              {collapseGender ? <FaChevronDown size={14} /> : <FaChevronUp size={14} />}
            </button>

            {!collapseGender && (
              <div className="space-y-3 pl-1 font-semibold text-sm text-gray-600">
                {["All", "Male", "Female", "Others"].map((g) => (
                  <label key={g} className="flex items-center gap-3 cursor-pointer hover:text-[#0C8CE9] transition">
                    <input
                      type="radio"
                      name="gender-radio"
                      checked={gender === g}
                      onChange={() => {
                        setGender(g);
                        setCurrentPage(1);
                      }}
                      className="radio radio-primary radio-sm"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="w-full border-2 border-[#0C8CE9] text-[#0C8CE9] hover:bg-[#0C8CE9] hover:text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
          >
            <FaUndo size={12} />
            Clear All Filters
          </button>
        </div>

        {/* DOCTORS GRID PANEL (Right 3-Columns) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <p className="text-gray-600 font-bold text-sm">
              Showing{" "}
              <span className="text-[#0C8CE9]">
                {filteredDoctors.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + doctorsPerPage, filteredDoctors.length)}
              </span>{" "}
              of <span className="text-gray-800">{filteredDoctors.length}</span> doctors
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-40 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <BeatLoader color="#0C8CE9" size={15} />
            </div>
          ) : currentDoctors.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-500 font-bold">
              No medical experts match the selected filters.
            </div>
          ) : (
            /* 4-Columns Grid responsive layout, matching Figma screenshot layout exactly */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {currentDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-3xl p-4 border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Doctor Photo */}
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-44 object-cover rounded-2xl bg-sky-50 shadow-inner"
                    />

                    {/* Doctor Info */}
                    <h3 className="font-extrabold text-[#0b1220] mt-4 text-base truncate">
                      {doc.name}
                    </h3>
                    
                    <p className="text-[#0C8CE9] font-bold text-xs mt-0.5">
                      {doc.specialization}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-gray-500 font-bold border-t pt-3.5">
                      <div className="flex items-center gap-2">
                        <FaBriefcaseMedical className="text-[#0C8CE9] text-sm shrink-0" />
                        <span>{doc.experience}+ Years Experience</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#0C8CE9] text-sm shrink-0" />
                        <span className="truncate">Green Life Hospital</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-400 text-sm shrink-0" />
                        <span>{doc.rating} (120)</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Modal Action (Figma: View Profile) */}
                  <button
                    onClick={() => navigate(`/doctors/${doc._id}`)}
                    className="w-full mt-6 bg-blue-50 hover:bg-[#0C8CE9] text-[#0C8CE9] hover:text-white py-3 rounded-2xl font-bold transition duration-300 text-xs text-center"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 4. Figma pagination design */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-gray-100">
              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-blue-300 disabled:opacity-40 transition"
              >
                <FaChevronLeft size={10} />
              </button>

              {/* Numbers */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl border font-bold text-sm transition-all duration-200 ${
                    currentPage === i + 1
                      ? "bg-[#0C8CE9] border-[#0C8CE9] text-white shadow-md shadow-blue-100"
                      : "bg-white border-gray-200 text-gray-500 hover:border-blue-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-blue-300 disabled:opacity-40 transition"
              >
                <FaChevronRight size={10} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= BOOKING APPOINTMENT MODAL ================= */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 relative shadow-2xl border">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-5 right-5 text-gray-500 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold text-[#0C8CE9] mb-3">
              Book Appointment
            </h2>
            <p className="text-gray-500 font-semibold mb-6">
              with {selectedDoctor.name} ({selectedDoctor.specialization})
            </p>

            <form onSubmit={handleBookAppointment} className="space-y-5">
              {/* Select Date */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FaCalendarAlt className="text-[#0C8CE9]" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full border border-gray-300 p-3.5 rounded-xl outline-none focus:border-blue-500 bg-white text-gray-800 font-semibold"
                  required
                />
              </div>

              {/* Select Time Slot */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FaClock className="text-[#0C8CE9]" />
                  Select Available Slot
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {selectedDoctor.slots?.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingTime(slot)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border-2 transition-all duration-300 ${
                        bookingTime === slot
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-gray-200 text-gray-600 hover:border-blue-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs font-semibold text-gray-600 leading-5">
                <p>✔ Fees: {selectedDoctor.fees} BDT</p>
                <p>✔ Doctor: {selectedDoctor.name}</p>
                <p>✔ Instant booking request pending doctor approval</p>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-[#0C8CE9] hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl shadow-lg transition"
              >
                {bookingLoading ? "Booking appointment..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;