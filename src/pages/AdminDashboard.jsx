import { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserMd,
  FaCalendarCheck,
  FaPrescriptionBottleAlt,
  FaTrash,
  FaHospital,
  FaChartLine,
  FaMoneyBillWave,
  FaTint,
  FaTimes,
  FaSignOutAlt,
  FaEdit,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalPrescriptions: 0,
  });
  const [chartData, setChartData] = useState([]);
  
  // Separated lists
  const [patientsList, setPatientsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  const [activeTab, setActiveTab] = useState("overview"); // overview, patients, doctors, appointments

  // Add Doctor Modal State
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "General Medicine",
    experience: "",
    fees: "",
    gender: "Male",
    slotsText: "09:00 AM, 10:00 AM, 11:00 AM, 02:00 PM, 03:00 PM, 04:00 PM"
  });
  const [submittingDoctor, setSubmittingDoctor] = useState(false);

  // Pharmacy list states
  const [medicinesList, setMedicinesList] = useState([]);

  // Add/Edit Medicine Modal State
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null); // null if adding, medicine object if editing
  const [medicineForm, setMedicineForm] = useState({
    name: "",
    generic: "",
    category: "Prescription Medicines",
    brand: "Square Pharmaceuticals",
    price: "",
    originalPrice: "",
    discount: "0",
    form: "Tablet",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    description: "",
    stock: "100"
  });
  const [submittingMedicine, setSubmittingMedicine] = useState(false);

  // Fetch admin dashboard details
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, apptsRes, medRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/appointments"), // Fetch all appointments (since role is admin, backend returns all)
        api.get("/medicines?limit=100"), // Fetch first 100 medicines
      ]);

      setStats(statsRes.data.stats);
      setChartData(statsRes.data.chartData);
      setPatientsList(usersRes.data.patients);
      setDoctorsList(usersRes.data.doctors);
      setAppointments(apptsRes.data);
      setMedicinesList(medRes.data.medicines || []);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      Swal.fire("Error", "Failed to fetch admin stats from backend", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Delete User (Patient or Doctor)
  const handleDeleteUser = async (targetId, type) => {
    Swal.fire({
      title: `Delete ${type}?`,
      text: `This action will permanently delete this ${type.toLowerCase()} user account and profile.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/users/${targetId}`);
          Swal.fire("Deleted", "User account deleted successfully.", "success");
          if (type === "Patient") {
            setPatientsList(patientsList.filter((p) => p._id !== targetId));
          } else {
            setDoctorsList(doctorsList.filter((d) => d._id !== targetId));
          }
          // Refresh statistics
          fetchAdminData();
        } catch (err) {
          console.error("Delete user error:", err);
          Swal.fire("Error", "Could not delete user account.", "error");
        }
      }
    });
  };

  // Delete / Cancel Appointment
  const handleCancelAppointment = async (apptId) => {
    Swal.fire({
      title: "Cancel Appointment?",
      text: "Are you sure you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/appointments/${apptId}/status`, { status: "rejected" });
          Swal.fire("Cancelled", "Appointment has been cancelled.", "success");
          setAppointments(
            appointments.map((a) => (a._id === apptId ? { ...a, status: "rejected" } : a))
          );
        } catch (err) {
          console.error("Cancel appointment error:", err);
          Swal.fire("Error", "Could not cancel appointment.", "error");
        }
      }
    });
  };

  const handleTogglePaymentStatus = async (apptId, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Pending" : "Paid";
    try {
      await api.put(`/appointments/${apptId}/payment`, { paymentStatus: newStatus });
      Swal.fire({
        icon: "success",
        title: "Payment Updated",
        text: `Appointment payment status set to ${newStatus}.`,
        timer: 1500,
        showConfirmButton: false,
      });
      setAppointments(
        appointments.map((a) => (a._id === apptId ? { ...a, paymentStatus: newStatus } : a))
      );
    } catch (err) {
      console.error("Toggle payment status error:", err);
      Swal.fire("Error", "Could not update payment status.", "error");
    }
  };

  const handleLogoutClick = () => {
    logout();
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out of the admin panel.",
      timer: 1200,
      showConfirmButton: false
    });
    navigate("/");
  };

  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.email || !doctorForm.password) {
      return Swal.fire("Required Fields", "Please complete all required fields.", "warning");
    }

    setSubmittingDoctor(true);
    try {
      const parsedSlots = doctorForm.slotsText
        ? doctorForm.slotsText.split(",").map((s) => s.trim()).filter(Boolean)
        : ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

      await api.post("/doctors/register", {
        name: doctorForm.name,
        email: doctorForm.email,
        password: doctorForm.password,
        specialization: doctorForm.specialization,
        experience: Number(doctorForm.experience) || 0,
        fees: Number(doctorForm.fees) || 0,
        gender: doctorForm.gender,
        slots: parsedSlots
      });

      Swal.fire({
        icon: "success",
        title: "Doctor Registered",
        text: `Doctor ${doctorForm.name} has been successfully registered.`,
        confirmButtonColor: "#0C8CE9"
      });

      setShowAddDoctor(false);
      // Reset form
      setDoctorForm({
        name: "",
        email: "",
        password: "",
        specialization: "General Medicine",
        experience: "",
        fees: "",
        gender: "Male",
        slotsText: "09:00 AM, 10:00 AM, 11:00 AM, 02:00 PM, 03:00 PM, 04:00 PM"
      });
      // Refresh list
      fetchAdminData();
    } catch (err) {
      Swal.fire("Registration Failed", err.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setSubmittingDoctor(false);
    }
  };

  const handleDeleteMedicine = async (medId) => {
    Swal.fire({
      title: "Delete Medicine?",
      text: "Are you sure you want to permanently delete this medicine listing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/medicines/${medId}`);
          Swal.fire("Deleted", "Medicine has been deleted.", "success");
          setMedicinesList(medicinesList.filter((m) => m._id !== medId));
        } catch (err) {
          console.error("Delete medicine error:", err);
          Swal.fire("Error", "Could not delete medicine.", "error");
        }
      }
    });
  };

  const handleOpenEditMedicine = (med) => {
    setEditingMedicine(med);
    setMedicineForm({
      name: med.name,
      generic: med.generic,
      category: med.category,
      brand: med.brand,
      price: med.price.toString(),
      originalPrice: med.originalPrice.toString(),
      discount: med.discount.toString(),
      form: med.form,
      image: med.image,
      description: med.description,
      stock: med.stock.toString()
    });
    setShowMedicineModal(true);
  };

  const handleOpenAddMedicine = () => {
    setEditingMedicine(null);
    setMedicineForm({
      name: "",
      generic: "",
      category: "Prescription Medicines",
      brand: "Square Pharmaceuticals",
      price: "",
      originalPrice: "",
      discount: "0",
      form: "Tablet",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
      description: "",
      stock: "100"
    });
    setShowMedicineModal(true);
  };

  const handleMedicineSubmit = async (e) => {
    e.preventDefault();
    if (!medicineForm.name || !medicineForm.generic || !medicineForm.price || !medicineForm.originalPrice) {
      return Swal.fire("Required Fields", "Please complete all required fields.", "warning");
    }

    setSubmittingMedicine(true);
    try {
      if (editingMedicine) {
        const res = await api.put(`/medicines/${editingMedicine._id}`, {
          name: medicineForm.name,
          generic: medicineForm.generic,
          category: medicineForm.category,
          brand: medicineForm.brand,
          price: Number(medicineForm.price),
          originalPrice: Number(medicineForm.originalPrice),
          discount: Number(medicineForm.discount) || 0,
          form: medicineForm.form,
          image: medicineForm.image,
          description: medicineForm.description,
          stock: Number(medicineForm.stock) || 100
        });

        Swal.fire({
          icon: "success",
          title: "Medicine Updated",
          text: `Medicine ${medicineForm.name} has been successfully updated.`,
          confirmButtonColor: "#0C8CE9"
        });

        setMedicinesList(medicinesList.map((m) => (m._id === editingMedicine._id ? res.data : m)));
      } else {
        const res = await api.post("/medicines", {
          name: medicineForm.name,
          generic: medicineForm.generic,
          category: medicineForm.category,
          brand: medicineForm.brand,
          price: Number(medicineForm.price),
          originalPrice: Number(medicineForm.originalPrice),
          discount: Number(medicineForm.discount) || 0,
          form: medicineForm.form,
          image: medicineForm.image,
          description: medicineForm.description,
          stock: Number(medicineForm.stock) || 100
        });

        Swal.fire({
          icon: "success",
          title: "Medicine Added",
          text: `Medicine ${medicineForm.name} has been successfully registered.`,
          confirmButtonColor: "#0C8CE9"
        });

        setMedicinesList([res.data, ...medicinesList]);
      }

      setShowMedicineModal(false);
    } catch (err) {
      Swal.fire("Action Failed", err.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setSubmittingMedicine(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb]">
        <BeatLoader color="#0C8CE9" size={15} />
      </div>
    );
  }

  const totalRevenue = appointments
    .filter((a) => a.paymentStatus === "Paid")
    .reduce((sum, a) => sum + (a.doctor?.fees || 800), 0);

  return (
    <>
      <div className="min-h-screen bg-[#eef3fb] p-6 font-main flex flex-col lg:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit space-y-2">
        <div className="flex items-center gap-3 px-3 py-4 border-b mb-4">
          <FaHospital className="text-[#0C8CE9] text-3xl animate-pulse" />
          <div>
            <h2 className="font-bold text-gray-800 leading-tight">Admin System</h2>
            <p className="text-xs text-gray-500 font-semibold">Super Administrator</p>
          </div>
        </div>

        {[
          { key: "overview", name: "Overview Stats", icon: <FaChartLine /> },
          { key: "patients", name: `Patients (${patientsList.length})`, icon: <FaUsers /> },
          { key: "doctors", name: `Doctors (${doctorsList.length})`, icon: <FaUserMd /> },
          { key: "appointments", name: `Appointments (${appointments.length})`, icon: <FaCalendarCheck /> },
          { key: "pharmacy", name: "Pharmacy Store", icon: <FaPrescriptionBottleAlt /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-[#0C8CE9] text-white shadow-md shadow-blue-100"
                : "text-gray-600 hover:bg-blue-50/50 hover:text-[#0C8CE9]"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}

        <div className="border-t my-4"></div>
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all duration-300"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
        {/* OVERVIEW PANEL */}
        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { title: "Total Patients", val: stats.totalPatients, icon: <FaUsers size={24} />, color: "bg-blue-500 text-white" },
                { title: "Total Doctors", val: stats.totalDoctors, icon: <FaUserMd size={24} />, color: "bg-green-500 text-white" },
                { title: "Appointments", val: stats.totalAppointments, icon: <FaCalendarCheck size={24} />, color: "bg-orange-500 text-white" },
                { title: "Prescriptions", val: stats.totalPrescriptions, icon: <FaPrescriptionBottleAlt size={24} />, color: "bg-purple-500 text-white" },
                { title: "Total Revenue", val: `${totalRevenue} BDT`, icon: <FaMoneyBillWave size={24} />, color: "bg-emerald-500 text-white" },
              ].map((c, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{c.title}</p>
                    <h3 className="text-3xl font-extrabold text-black mt-2">{c.val}</h3>
                  </div>
                  <div className={`p-4 rounded-2xl ${c.color} shadow`}>{c.icon}</div>
                </div>
              ))}
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly appointments trend */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-black mb-5 text-lg border-b pb-3">Monthly Appointments Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontWeight: 600, fontSize: 12 }} />
                      <YAxis tick={{ fill: "#9ca3af", fontWeight: 600, fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="appointments" stroke="#0C8CE9" strokeWidth={3} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Roles distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-black mb-5 text-lg border-b pb-3">User Distribution Analysis</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Patients", count: stats.totalPatients },
                        { name: "Doctors", count: stats.totalDoctors },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontWeight: 600, fontSize: 12 }} />
                      <YAxis tick={{ fill: "#9ca3af", fontWeight: 600, fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" radius={[10, 10, 0, 0]} barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {/* PATIENTS MANAGEMENT PANEL */}
        {activeTab === "patients" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-black mb-5 border-b pb-3">Patient User Registry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase border-b">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5">Blood Group</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold">
                  {patientsList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-gray-500">No patient users found on platform.</td>
                    </tr>
                  ) : (
                    patientsList.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition">
                        <td className="p-3.5 text-black font-bold">{p.name}</td>
                        <td className="p-3.5">{p.email}</td>
                        <td className="p-3.5">{p.phone || "N/A"}</td>
                        <td className="p-3.5 text-red-500 font-bold flex items-center gap-1">
                          <FaTint /> {p.blood || "N/A"}
                        </td>
                        <td className="p-3.5">{p.location || "N/A"}</td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleDeleteUser(p._id, "Patient")}
                            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition"
                            title="Delete User"
                          >
                            <FaTrash size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCTORS MANAGEMENT PANEL */}
        {activeTab === "doctors" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h3 className="text-xl font-bold text-black">Doctor Profiles Registry</h3>
              <button
                onClick={() => setShowAddDoctor(true)}
                className="bg-[#0C8CE9] hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition duration-300 flex items-center gap-1.5 shadow-sm"
              >
                + Register Doctor
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase border-b">
                  <tr>
                    <th className="p-3.5">Doctor</th>
                    <th className="p-3.5">Specialization</th>
                    <th className="p-3.5">Experience</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Fees</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold">
                  {doctorsList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-gray-500">No doctor accounts registered.</td>
                    </tr>
                  ) : (
                    doctorsList.map((d) => (
                      <tr key={d._id} className="hover:bg-gray-50/50 transition">
                        <td className="p-3.5 text-black font-bold flex items-center gap-2">
                          <img src={d.image} alt="" className="w-8 h-8 rounded-full object-cover bg-blue-50 border" />
                          {d.name}
                        </td>
                        <td className="p-3.5 text-blue-500 font-bold">{d.specialization}</td>
                        <td className="p-3.5">{d.experience}+ Years</td>
                        <td className="p-3.5">{d.email}</td>
                        <td className="p-3.5 text-green-600 font-bold">{d.fees} BDT</td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleDeleteUser(d._id, "Doctor")}
                            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition"
                            title="Delete Doctor"
                          >
                            <FaTrash size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPOINTMENTS PANEL */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeIn">
            <h3 className="text-xl font-bold text-black mb-5 border-b pb-3">Total System Appointments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase border-b">
                  <tr>
                    <th className="p-3.5">Patient</th>
                    <th className="p-3.5">Doctor</th>
                    <th className="p-3.5">Date & Time</th>
                    <th className="p-3.5">Payment</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-gray-500">No appointments recorded.</td>
                    </tr>
                  ) : (
                    appointments.map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50/50 transition">
                        <td className="p-3.5 text-black font-bold">{a.patient?.name || "Patient"}</td>
                        <td className="p-3.5">{a.doctor?.name || "Doctor"}</td>
                        <td className="p-3.5 text-xs text-gray-500">
                          {a.date} at {a.time}
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleTogglePaymentStatus(a._id, a.paymentStatus || "Pending")}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm border ${
                              a.paymentStatus === "Paid"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                            }`}
                            title="Click to toggle Payment status"
                          >
                            {a.paymentStatus || "Pending"}
                          </button>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            a.status === "approved" ? "bg-green-100 text-green-600" :
                            a.status === "rejected" ? "bg-red-100 text-red-600" :
                            a.status === "completed" ? "bg-blue-100 text-blue-600" :
                            "bg-yellow-100 text-yellow-600"
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          {a.status === "pending" || a.status === "approved" ? (
                            <button
                              onClick={() => handleCancelAppointment(a._id)}
                              className="text-red-500 hover:text-red-700 font-bold text-xs border border-red-200 px-3 py-1.5 rounded-lg bg-red-50/50 hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">No Action</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PHARMACY STORE MANAGEMENT PANEL */}
        {activeTab === "pharmacy" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeIn">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h3 className="text-xl font-bold text-black">Pharmacy Stock Inventory</h3>
              <button
                onClick={handleOpenAddMedicine}
                className="bg-[#0C8CE9] hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition duration-300 flex items-center gap-1.5 shadow-sm"
              >
                + Add Medicine
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase border-b">
                  <tr>
                    <th className="p-3.5">Medicine Name</th>
                    <th className="p-3.5">Generic & Strength</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Brand</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold">
                  {medicinesList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-gray-500">No medicines in stock.</td>
                    </tr>
                  ) : (
                    medicinesList.map((m) => (
                      <tr key={m._id} className="hover:bg-gray-50/50 transition">
                        <td className="p-3.5 text-black font-bold flex items-center gap-2">
                          <img src={m.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-blue-50 border shrink-0" />
                          {m.name}
                        </td>
                        <td className="p-3.5 text-xs text-[#0C8CE9] font-bold">{m.generic}</td>
                        <td className="p-3.5 text-xs">{m.category}</td>
                        <td className="p-3.5 text-xs text-slate-500">{m.brand}</td>
                        <td className="p-3.5 text-xs text-green-600 font-bold">
                          ৳ {m.price} {m.discount > 0 && <span className="text-[10px] text-gray-400 line-through">৳ {m.originalPrice}</span>}
                        </td>
                        <td className={`p-3.5 text-xs font-bold ${m.stock < 20 ? 'text-red-500' : 'text-slate-800'}`}>
                          {m.stock} units
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditMedicine(m)}
                              className="bg-blue-50 text-[#0C8CE9] hover:bg-[#0C8CE9] hover:text-white p-2 rounded-xl transition"
                              title="Edit Medicine"
                            >
                              <FaEdit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteMedicine(m._id)}
                              className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-xl transition"
                              title="Delete Medicine"
                            >
                              <FaTrash size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>

    {/* ================= REGISTER DOCTOR MODAL ================= */}
    {showAddDoctor && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative p-6 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={() => setShowAddDoctor(false)}
            className="absolute top-5 right-5 text-slate-400 hover:text-red-500 transition duration-200"
          >
            <FaTimes size={18} />
          </button>

          {/* Header */}
          <div className="text-center pb-3 border-b mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-[#0C8CE9] mb-3">
              <FaUserMd size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Register New Doctor</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Create authorization credentials and physician profile</p>
          </div>

          {/* Form */}
          <form onSubmit={handleAddDoctorSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="Dr. Rabat Hasan"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="rabat@smartmedical.com"
                  value={doctorForm.email}
                  onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={doctorForm.password}
                  onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Specialization</label>
                <select
                  value={doctorForm.specialization}
                  onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                >
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="General Medicine">General Medicine</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Experience (Years)</label>
                <input
                  type="number"
                  placeholder="10"
                  value={doctorForm.experience}
                  onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Fees (BDT)</label>
                <input
                  type="number"
                  placeholder="800"
                  value={doctorForm.fees}
                  onChange={(e) => setDoctorForm({ ...doctorForm, fees: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Gender</label>
                <select
                  value={doctorForm.gender}
                  onChange={(e) => setDoctorForm({ ...doctorForm, gender: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Available Time Slots (Comma-separated)</label>
              <input
                type="text"
                placeholder="09:00 AM, 10:00 AM, 11:00 AM"
                value={doctorForm.slotsText}
                onChange={(e) => setDoctorForm({ ...doctorForm, slotsText: e.target.value })}
                className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submittingDoctor}
                className="w-full bg-[#0C8CE9] hover:bg-blue-600 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
              >
                {submittingDoctor ? "Registering..." : "Complete Registration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* ================= ADD/EDIT MEDICINE MODAL ================= */}
    {showMedicineModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative p-6 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={() => setShowMedicineModal(false)}
            className="absolute top-5 right-5 text-slate-400 hover:text-red-500 transition duration-200"
          >
            <FaTimes size={18} />
          </button>

          {/* Header */}
          <div className="text-center pb-3 border-b mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-[#0C8CE9] mb-3">
              <FaPrescriptionBottleAlt size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingMedicine ? "Edit Medicine Listing" : "Add New Medicine"}
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Configure stock items, pricing, and generic names</p>
          </div>

          {/* Form */}
          <form onSubmit={handleMedicineSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Medicine Name</label>
                <input
                  type="text"
                  placeholder="Panadol Extra"
                  value={medicineForm.name}
                  onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Generic Name & Strength</label>
                <input
                  type="text"
                  placeholder="Paracetamol 500mg"
                  value={medicineForm.generic}
                  onChange={(e) => setMedicineForm({ ...medicineForm, generic: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Category</label>
                <select
                  value={medicineForm.category}
                  onChange={(e) => setMedicineForm({ ...medicineForm, category: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                >
                  <option value="Prescription Medicines">Prescription Medicines</option>
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                  <option value="Skin Care">Skin Care</option>
                  <option value="Hair Care">Hair Care</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Baby Care">Baby Care</option>
                  <option value="Health Devices">Health Devices</option>
                  <option value="Ayurveda & Herbal">Ayurveda & Herbal</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Brand Manufacturer</label>
                <select
                  value={medicineForm.brand}
                  onChange={(e) => setMedicineForm({ ...medicineForm, brand: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                >
                  <option value="Square Pharmaceuticals">Square Pharmaceuticals</option>
                  <option value="Beximco">Beximco</option>
                  <option value="Incepta">Incepta</option>
                  <option value="GSK">GSK</option>
                  <option value="Renata">Renata</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Himalaya">Himalaya</option>
                  <option value="Dabur">Dabur</option>
                  <option value="Patanjali">Patanjali</option>
                  <option value="Omron">Omron</option>
                  <option value="Dettol">Dettol</option>
                  <option value="Savlon">Savlon</option>
                  <option value="Cipla">Cipla</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Original Price (৳)</label>
                <input
                  type="number"
                  placeholder="60"
                  value={medicineForm.originalPrice}
                  onChange={(e) => setMedicineForm({ ...medicineForm, originalPrice: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Discounted Price (৳)</label>
                <input
                  type="number"
                  placeholder="45"
                  value={medicineForm.price}
                  onChange={(e) => setMedicineForm({ ...medicineForm, price: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Discount (%)</label>
                <input
                  type="number"
                  placeholder="25"
                  value={medicineForm.discount}
                  onChange={(e) => setMedicineForm({ ...medicineForm, discount: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Medicine Form</label>
                <select
                  value={medicineForm.form}
                  onChange={(e) => setMedicineForm({ ...medicineForm, form: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Ointment">Ointment</option>
                  <option value="Device">Device</option>
                  <option value="Powder">Powder</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Inventory Stock</label>
                <input
                  type="number"
                  placeholder="200"
                  value={medicineForm.stock}
                  onChange={(e) => setMedicineForm({ ...medicineForm, stock: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Product Image URL</label>
                <input
                  type="text"
                  placeholder="https://unsplash..."
                  value={medicineForm.image}
                  onChange={(e) => setMedicineForm({ ...medicineForm, image: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Product Description</label>
              <textarea
                placeholder="Indicated for headache, muscle ache, toothache..."
                value={medicineForm.description}
                onChange={(e) => setMedicineForm({ ...medicineForm, description: e.target.value })}
                className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#0C8CE9] transition h-20 resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submittingMedicine}
                className="w-full bg-[#0C8CE9] hover:bg-blue-600 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
              >
                {submittingMedicine ? "Saving..." : (editingMedicine ? "Save Changes" : "Create Listing")}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default AdminDashboard;
