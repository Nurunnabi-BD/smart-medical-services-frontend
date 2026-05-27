import { useState, useEffect, useCallback } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaTint,
  FaCalendarAlt,
  FaClock,
  FaFilePrescription,
  FaNotesMedical,
  FaWeight,
  FaRulerVertical,
  FaBirthdayCake,
  FaUserMd,
  FaTimes,
  FaFileMedical,
  FaTrash,
  FaUpload,
  FaRegComments,
  FaLock,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";
import Logo from "../assets/logo.png";

const PatientDashboard = () => {
  const { user, updateProfile } = useAuth();

  // Loading States
  const [loadingData, setLoadingData] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);

  // Modal States
  const [openEdit, setOpenEdit] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Payment Checkout States
  const [payAppointment, setPayAppointment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("bkash"); // bkash, nagad, card
  const [billingDetails, setBillingDetails] = useState({
    mobile: "",
    pin: "",
    otp: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });
  const [submittingPayment, setSubmittingPayment] = useState(false);
  
  // Live Chat States
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatContacts, setChatContacts] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatDoctor, setActiveChatDoctor] = useState(null);
  const [chatInput, setChatInput] = useState("");

  // URL check for redirect from doctor detail page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatDocId = params.get("chat");
    if (chatDocId) {
      setShowChatModal(true);
      
      const loadDocAndChat = async () => {
        try {
          const res = await api.get("/doctors");
          const foundDoc = res.data.find(d => d.user === chatDocId);
          if (foundDoc) {
            setActiveChatDoctor({
              _id: chatDocId,
              name: foundDoc.name,
              role: "doctor",
              specialization: foundDoc.specialization,
              image: foundDoc.image,
            });
          }
        } catch (err) {
          console.error("Failed to load doctor for chat", err);
        }
      };
      loadDocAndChat();
    }
  }, [appointments]);

  const fetchPatientContacts = useCallback(async () => {
    try {
      const res = await api.get("/messages/contacts");
      
      // Also get doctors from appointments so they can message them
      const uniqueDocs = [];
      const seenDocIds = new Set();
      appointments.forEach(appt => {
        const d = appt.doctor;
        if (d && d.user && !seenDocIds.has(d.user)) {
          seenDocIds.add(d.user);
          uniqueDocs.push({
            _id: d.user,
            name: d.name,
            role: "doctor",
            specialization: d.specialization || "Medical Specialist",
            image: d.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=250",
            lastMessage: "",
            lastMessageTime: null
          });
        }
      });

      const merged = [...res.data];
      uniqueDocs.forEach(d => {
        if (!merged.some(c => c._id === d._id)) {
          merged.push(d);
        }
      });
      setChatContacts(merged);
    } catch (err) {
      console.error("Error loading chat contacts:", err);
    }
  }, [appointments]);

  const fetchPatientChatHistory = useCallback(async (doctorId) => {
    if (!doctorId) return;
    try {
      const res = await api.get(`/messages/history/${doctorId}`);
      setChatHistory(res.data);
    } catch (err) {
      console.error("Error loading chat history:", err);
    }
  }, []);

  useEffect(() => {
    if (showChatModal) {
      fetchPatientContacts();
    }
  }, [showChatModal, fetchPatientContacts]);

  useEffect(() => {
    if (!showChatModal || !activeChatDoctor) return;
    fetchPatientChatHistory(activeChatDoctor._id);
    const interval = setInterval(() => {
      fetchPatientChatHistory(activeChatDoctor._id);
      fetchPatientContacts();
    }, 2000);
    return () => clearInterval(interval);
  }, [showChatModal, activeChatDoctor, fetchPatientChatHistory, fetchPatientContacts]);

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatDoctor) return;
    try {
      const res = await api.post("/messages", {
        receiverId: activeChatDoctor._id,
        text: chatInput
      });
      setChatHistory(prev => [...prev, res.data]);
      setChatInput("");
      fetchPatientContacts();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const generatePrescriptionText = (item) => {
    const doctorName = item.doctor?.name || "Doctor";
    const doctorSpecialization = item.doctor?.specialization || "General Medicine";
    const diagnosis = item.diagnosis || "N/A";
    const date = item.date || "N/A";
    const patientName = user?.name || "Patient";
    
    let text = `==================================================\n`;
    text += `             SMART MEDICAL SERVICES\n`;
    text += `                PRESCRIPTION\n`;
    text += `==================================================\n\n`;
    text += `Date: ${date}\n`;
    text += `Patient Name: ${patientName}\n`;
    text += `Doctor: ${doctorName} (${doctorSpecialization})\n\n`;
    text += `--------------------------------------------------\n`;
    text += `DIAGNOSIS: ${diagnosis.toUpperCase()}\n`;
    text += `--------------------------------------------------\n\n`;
    text += `PRESCRIBED MEDICINES:\n\n`;
    
    if (item.medicines && item.medicines.length > 0) {
      item.medicines.forEach((med, index) => {
        text += `${index + 1}. ${med.name}\n`;
        text += `   Dosage: ${med.dosage}\n`;
        text += `   Duration: ${med.duration}\n`;
        if (med.instructions) {
          text += `   Instructions: ${med.instructions}\n`;
        }
        text += `\n`;
      });
    } else {
      text += `No medicines prescribed.\n`;
    }
    
    text += `==================================================\n`;
    text += `Please follow the prescribed dosage and consult your\n`;
    text += `doctor if symptoms persist. Stay healthy!\n`;
    text += `==================================================\n`;
    
    return text;
  };

  const handlePrintPrescription = (presc) => {
    const printWindow = window.open("", "_blank");
    
    const medicinesHTML = presc.medicines && presc.medicines.length > 0
      ? presc.medicines.map((med) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${med.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${med.dosage}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${med.duration}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">${med.instructions || '-'}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="4" style="padding: 10px; text-align: center; color: #888;">No medicines prescribed.</td></tr>';

    const doctorName = presc.doctor?.name || "Registered Practitioner";
    const specialization = presc.doctor?.specialization || "Medical Officer";
    const email = presc.doctor?.email || "";
    const date = presc.date || "";
    const patientName = user?.name || "Patient Profile";
    const patientAge = user?.dob ? calculateAge(user.dob) : "N/A";
    const patientGender = user?.gender || "N/A";

    const htmlContent = `
      <html>
      <head>
        <title>Prescription - ${patientName}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #333; }
          .letterhead { display: flex; justify-content: space-between; border-bottom: 3px solid #0C8CE9; padding-bottom: 20px; margin-bottom: 30px; }
          .clinic-info h1 { color: #0C8CE9; margin: 0; font-size: 28px; font-weight: 800; }
          .clinic-info p { margin: 5px 0 0 0; color: #666; font-size: 14px; font-weight: 500; }
          .doctor-info { text-align: right; }
          .doctor-info h2 { margin: 0; font-size: 18px; color: #333; font-weight: bold; }
          .doctor-info p { margin: 4px 0; color: #666; font-size: 12px; font-weight: 500; }
          .patient-bar { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 30px; font-size: 13px; font-weight: 600; color: #475569; }
          .patient-bar div span { color: #0f172a; font-weight: 800; }
          .rx-symbol { font-size: 36px; font-weight: bold; color: #0C8CE9; margin-bottom: 10px; font-family: Georgia, serif; }
          .diagnosis { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 15px; margin-bottom: 25px; border-radius: 0 8px 8px 0; font-size: 14px; }
          .diagnosis span { font-weight: 800; color: #1e3a8a; }
          .meds-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; margin-bottom: 40px; }
          .meds-table th { background: #f1f5f9; padding: 12px; font-weight: bold; color: #334155; text-transform: uppercase; font-size: 11px; tracking-wider: 0.05em; border-bottom: 2px solid #cbd5e1; }
          .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 11px; font-weight: 600; margin-top: 60px; }
          @media print {
            body { margin: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="letterhead">
          <div class="clinic-info" style="display: flex; align-items: center; gap: 15px;">
            <img src="${window.location.origin + Logo}" alt="logo" style="width: 50px; height: 50px; object-fit: cover;" />
            <div style="text-align: left;">
              <h1 style="color: #0C8CE9; margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">Smart Medical</h1>
              <p style="margin: 0; color: #666; font-size: 13px; font-weight: 500;">Service Platform</p>
            </div>
          </div>
          <div class="doctor-info">
            <h2>${doctorName}</h2>
            <p>${specialization}</p>
            <p>${email}</p>
          </div>
        </div>
        
        <div class="patient-bar">
          <div>Patient Name: <span>${patientName}</span></div>
          <div>Age: <span>${patientAge} Yrs</span></div>
          <div>Gender: <span>${patientGender}</span></div>
          <div>Date: <span>${date}</span></div>
        </div>
        
        <div class="rx-symbol">℞</div>
        
        <div class="diagnosis">
          <span>Diagnosis:</span> ${presc.diagnosis || 'General Cardiovascular Observation'}
        </div>
        
        <table class="meds-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Dosage</th>
              <th>Duration</th>
              <th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${medicinesHTML}
          </tbody>
        </table>
        
        <div class="footer">
          This is an electronically generated prescription under the MediCare network. Smart Medical Services.
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };
  
  // Report Upload States
  const [showUploadReport, setShowUploadReport] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportFile, setReportFile] = useState("");
  const [uploadingReport, setUploadingReport] = useState(false);

  // Profile Edit Local State
  const [editedUser, setEditedUser] = useState({
    name: "",
    phone: "",
    location: "",
    dob: "",
    blood: "",
    gender: "Male",
    weight: 0,
    height: 0,
    emergency: "",
    occupation: "",
    about: "",
    image: "",
  });

  // Sync editedUser state with user context on load/edit click
  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        dob: user.dob || "",
        blood: user.blood || "",
        gender: user.gender || "Male",
        weight: user.weight || 0,
        height: user.height || 0,
        emergency: user.emergency || "",
        occupation: user.occupation || "",
        about: user.about || "",
        image: user.image || "",
      });
    }
  }, [user, openEdit]);

  // Fetch dynamic appointments, prescriptions, and reports
  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      const [apptRes, prescRes, reportRes] = await Promise.all([
        api.get("/appointments"),
        api.get("/prescriptions"),
        api.get("/reports"),
      ]);
      setAppointments(apptRes.data);
      setPrescriptions(prescRes.data);
      setReports(reportRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate Age from Date of Birth
  const calculateAge = (dobString) => {
    if (!dobString) return "N/A";
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return "N/A";
    const today = new Date();
    let ageVal = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      ageVal--;
    }
    return ageVal;
  };

  const age = user ? calculateAge(user.dob) : "N/A";

  // Handle Profile Inputs
  const handleProfileChange = (e) => {
    const value = e.target.name === "weight" || e.target.name === "height" 
      ? Number(e.target.value) || 0 
      : e.target.value;
    setEditedUser({ ...editedUser, [e.target.name]: value });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("File Too Large", "Profile picture must be smaller than 2MB", "warning");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedUser(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Submit Profile Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(editedUser);
      setOpenEdit(false);
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your changes have been saved successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err,
      });
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!payAppointment) return;

    if (paymentMethod === "bkash" || paymentMethod === "nagad") {
      if (!billingDetails.mobile || !billingDetails.pin) {
        return Swal.fire("Required Fields", "Please enter your mobile number and PIN.", "warning");
      }
    } else {
      if (!billingDetails.cardName || !billingDetails.cardNumber || !billingDetails.expiry || !billingDetails.cvv) {
        return Swal.fire("Required Fields", "Please complete all card details.", "warning");
      }
    }

    setSubmittingPayment(true);
    try {
      await api.put(`/appointments/${payAppointment._id}/payment`, { paymentStatus: "Paid" });
      
      Swal.fire({
        icon: "success",
        title: "Payment Successful",
        text: `You have successfully paid for your appointment.`,
        confirmButtonColor: "#0C8CE9"
      });

      setPayAppointment(null);
      // Reset inputs
      setBillingDetails({
        mobile: "",
        pin: "",
        otp: "",
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
      });
      // Refresh appointments list
      fetchDashboardData();
    } catch (err) {
      Swal.fire("Payment Failed", err.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setSubmittingPayment(false);
    }
  };

  // File to Base64 converter for Report uploads
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("File Too Large", "Please select a file smaller than 2MB", "warning");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setReportFile(reader.result); // Base64 data URL
    };
    reader.readAsDataURL(file);
  };

  // Upload Medical Report
  const handleUploadReport = async (e) => {
    e.preventDefault();
    if (!reportTitle || !reportFile) {
      return Swal.fire("Required", "Please provide a title and select a report file.", "warning");
    }

    setUploadingReport(true);
    try {
      await api.post("/reports", { title: reportTitle, fileUrl: reportFile });
      Swal.fire("Uploaded", "Report uploaded successfully!", "success");
      setReportTitle("");
      setReportFile("");
      setShowUploadReport(false);
      // Refresh report list
      const reportRes = await api.get("/reports");
      setReports(reportRes.data);
    } catch (err) {
      Swal.fire("Upload Failed", err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setUploadingReport(false);
    }
  };

  // Delete Medical Report
  const handleDeleteReport = async (reportId) => {
    Swal.fire({
      title: "Delete Report?",
      text: "Are you sure you want to delete this report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/reports/${reportId}`);
          Swal.fire("Deleted", "Your report has been deleted.", "success");
          setReports(reports.filter((r) => r._id !== reportId));
        } catch (err) {
          console.error("Delete report error:", err);
          Swal.fire("Error", "Could not delete report.", "error");
        }
      }
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#eef3fb] p-4 sm:p-6 relative font-main">
      {/* Welcome Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight">
            Welcome back,{" "}
            <span className="text-[#0C8CE9]">{user.name.split(" ")[0]}!</span>
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Take care of your health and stay safe
          </p>
        </div>
      </div>

      {loadingData ? (
        <div className="flex justify-center items-center py-20">
          <BeatLoader color="#0C8CE9" size={15} />
        </div>
      ) : (
        /* Main Grid */
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover border bg-sky-50 shadow-inner shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border bg-blue-100 text-[#0C8CE9] flex items-center justify-center font-bold text-3xl shadow-inner shrink-0">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {user.name}
                    </h2>

                    <div className="space-y-2 mt-4 text-gray-600 text-sm font-semibold w-full">
                      <p className="flex items-center gap-2 justify-center sm:justify-start">
                        <FaEnvelope className="text-gray-400" />
                        {user.email}
                      </p>

                      <p className="flex items-center gap-2 justify-center sm:justify-start">
                        <FaPhoneAlt className="text-gray-400" />
                        {user.phone || "No phone number added"}
                      </p>

                      <p className="flex items-center gap-2 justify-center sm:justify-start">
                        <FaMapMarkerAlt className="text-gray-400" />
                        {user.location || "No address added"}
                      </p>

                      <p className="flex items-center gap-2 justify-center sm:justify-start">
                        <FaCalendarAlt className="text-gray-400" />
                        {user.dob || "No DOB added"}
                      </p>

                      <p className="flex items-center gap-2 justify-center sm:justify-start">
                        <FaTint className="text-red-500" />
                        Blood Group: <span className="text-red-500 font-bold">{user.blood || "N/A"}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions container */}
                <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => setShowChatModal(true)}
                    className="flex-1 md:flex-none bg-[#0C8CE9] border-2 border-[#0C8CE9] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <FaRegComments />
                    My Chats
                  </button>
                  <button
                    onClick={() => setOpenEdit(true)}
                    className="flex-1 md:flex-none border-2 border-[#0C8CE9] text-[#0C8CE9] font-bold px-6 py-2.5 rounded-xl hover:bg-[#0C8CE9] hover:text-white transition-all duration-300 text-sm text-center"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-black">Upcoming Appointments</h2>
                <button
                  onClick={() => setShowAppointments(true)}
                  className="text-[#0C8CE9] text-sm font-bold hover:underline"
                >
                  View All ({appointments.length})
                </button>
              </div>

              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <p className="text-gray-500 py-4 font-semibold text-center bg-gray-50 rounded-xl">
                    No upcoming appointments found.
                  </p>
                ) : (
                  appointments.slice(0, 2).map((item) => (
                    <div
                      key={item._id}
                      className="border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition duration-300"
                    >
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xl shrink-0">
                          {item.doctor?.name ? item.doctor.name.charAt(0) : "D"}
                        </div>

                        <div>
                          <h3 className="font-bold text-black">{item.doctor?.name || "Doctor"}</h3>
                          <p className="text-sm text-[#0C8CE9] font-bold">{item.doctor?.specialization || "General Medicine"}</p>
                          <div className="flex gap-4 mt-1 text-xs text-gray-400 font-semibold flex-wrap">
                            <p className="flex items-center gap-1">
                              <FaCalendarAlt />
                              {item.date}
                            </p>
                            <p className="flex items-center gap-1">
                              <FaClock />
                              {item.time}
                            </p>
                            <p className="text-slate-700 font-bold">
                              Fee: {item.doctor?.fees || 800} BDT
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.status === "approved" ? "bg-green-100 text-green-600" :
                          item.status === "rejected" ? "bg-red-100 text-red-600" :
                          item.status === "completed" ? "bg-blue-100 text-blue-600" :
                          "bg-yellow-100 text-yellow-600"
                        }`}>
                          {item.status}
                        </span>

                        <div className="flex gap-2 items-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide border ${
                            item.paymentStatus === "Paid"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-amber-50 text-amber-600 border-amber-200"
                          }`}>
                            {item.paymentStatus === "Paid" ? "Paid" : "Unpaid"}
                          </span>

                          {item.paymentStatus !== "Paid" && item.status !== "rejected" && (
                            <button
                              onClick={() => setPayAppointment(item)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1 rounded text-[10px] tracking-wider transition duration-300 uppercase shadow-sm"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Prescriptions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-black">Recent Prescriptions</h2>
                <button
                  onClick={() => setShowPrescriptions(true)}
                  className="text-[#0C8CE9] text-sm font-bold hover:underline"
                >
                  View All ({prescriptions.length})
                </button>
              </div>

              <div className="space-y-4">
                {prescriptions.length === 0 ? (
                  <p className="text-gray-500 py-4 font-semibold text-center bg-gray-50 rounded-xl">
                    No prescriptions issued yet.
                  </p>
                ) : (
                  prescriptions.slice(0, 2).map((item) => (
                    <div
                      key={item._id}
                      className="border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-500 p-4 rounded-xl shrink-0">
                          <FaFilePrescription size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-black">{item.diagnosis}</h3>
                          <p className="text-sm text-gray-500 font-semibold">Prescribed by {item.doctor?.name || "Doctor"}</p>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">{item.date}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <button
                          onClick={() => setSelectedPrescription(item)}
                          className="flex-1 sm:flex-initial text-center border-2 border-[#0C8CE9] text-[#0C8CE9] font-bold px-4 py-2 rounded-xl hover:bg-[#0C8CE9] hover:text-white transition text-sm"
                        >
                          View
                        </button>
                        <a
                          href={item.medicines ? `data:text/plain;charset=utf-8,${encodeURIComponent(
                            generatePrescriptionText(item)
                          )}` : "#"}
                          download={`Prescription-${item.diagnosis.replace(/\s+/g, '_')}-${item.date}.txt`}
                          className="flex-1 sm:flex-initial text-center bg-[#0C8CE9] text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-600 transition text-sm flex items-center justify-center"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Medical Reports Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-black">Medical Reports</h2>
                <button
                  onClick={() => setShowUploadReport(true)}
                  className="bg-[#0C8CE9] hover:bg-blue-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm transition"
                >
                  <FaUpload />
                  Upload Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.length === 0 ? (
                  <p className="text-gray-500 py-6 font-semibold text-center bg-gray-50 rounded-xl col-span-2">
                    No medical reports uploaded yet.
                  </p>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report._id}
                      className="border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition bg-gray-50/50"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="bg-orange-100 text-orange-500 p-3 rounded-xl shrink-0">
                          <FaFileMedical size={20} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-black text-sm truncate max-w-[150px] sm:max-w-[200px]">{report.title}</h4>
                          <p className="text-xs text-gray-400 font-semibold">{report.date}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100/50">
                        <a
                          href={report.fileUrl}
                          download={`${report.title}.txt`}
                          className="flex-1 sm:flex-initial text-center text-xs font-bold text-[#0C8CE9] hover:underline bg-white border px-3 py-1.5 rounded-lg shadow-sm font-semibold"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDeleteReport(report._id)}
                          className="text-red-500 hover:text-red-700 bg-white border p-2 rounded-lg shadow-sm flex items-center justify-center"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Stats Summary */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
              {[
                {
                  icon: <FaNotesMedical />,
                  title: "Total Appointments",
                  value: appointments.length,
                  color: "bg-blue-100 text-blue-500",
                },
                {
                  icon: <FaUserMd />,
                  title: "Approved Consultations",
                  value: appointments.filter((a) => a.status === "approved" || a.status === "completed").length,
                  color: "bg-green-100 text-green-500",
                },
                {
                  icon: <FaFilePrescription />,
                  title: "Prescriptions",
                  value: prescriptions.length,
                  color: "bg-purple-100 text-purple-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className={`p-3.5 rounded-2xl ${item.color}`}>
                    {item.icon}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-black">{item.value}</h2>
                    <p className="text-sm text-gray-500 font-semibold">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Health Summary Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-center mb-5 text-black border-b pb-3">
                Health Summary
              </h2>

              <div className="space-y-4">
                {/* Blood Group */}
                <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 bg-gray-50/50">
                  <div className="bg-pink-100 text-pink-500 p-3.5 rounded-xl">
                    <FaTint />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">Blood Group</p>
                    <h3 className="font-bold text-lg text-black">{user.blood || "N/A"}</h3>
                  </div>
                </div>

                {/* Weight */}
                <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 bg-gray-50/50">
                  <div className="bg-blue-100 text-blue-500 p-3.5 rounded-xl">
                    <FaWeight />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">Weight</p>
                    <h3 className="font-bold text-lg text-black">{user.weight ? `${user.weight} kg` : "N/A"}</h3>
                  </div>
                </div>

                {/* Height */}
                <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 bg-gray-50/50">
                  <div className="bg-green-100 text-green-500 p-3.5 rounded-xl">
                    <FaRulerVertical />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">Height</p>
                    <h3 className="font-bold text-lg text-black">{user.height ? `${user.height} cm` : "N/A"}</h3>
                  </div>
                </div>

                {/* Age */}
                <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 bg-gray-50/50">
                  <div className="bg-purple-100 text-purple-500 p-3.5 rounded-xl">
                    <FaBirthdayCake />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">Age</p>
                    <h3 className="font-bold text-lg text-black">{age === "N/A" ? "N/A" : `${age} Years`}</h3>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= REPORT UPLOAD MODAL ================= */}
      {showUploadReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl border">
            <button
              onClick={() => setShowUploadReport(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FaTimes size={18} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-black">Upload Medical Report</h3>
            <form onSubmit={handleUploadReport} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">Report Title</label>
                <input
                  type="text"
                  placeholder="e.g. Blood Test, Prescription Scan"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none bg-white text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">Select File (PDF, Image, Doc)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none bg-white text-gray-800 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploadingReport}
                className="w-full bg-[#0C8CE9] hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl shadow transition"
              >
                {uploadingReport ? "Uploading..." : "Confirm Upload"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT PROFILE MODAL ================= */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 sm:p-8 relative shadow-2xl border my-8">
            {/* Close Button */}
            <button
              onClick={() => setOpenEdit(false)}
              className="absolute top-5 right-5 text-gray-500 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
              Edit Patient Profile
            </h2>

            <form onSubmit={handleSaveProfile}>
              {/* Form Grid */}
              <div className="grid md:grid-cols-2 gap-5">
                {/* Profile Picture */}
                <div className="md:col-span-2 flex items-center gap-4 border-b pb-4 mb-2">
                  {editedUser.image ? (
                    <img src={editedUser.image} alt="Preview" className="w-16 h-16 rounded-full object-cover border bg-sky-50 shadow" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-[#0C8CE9] flex items-center justify-center font-bold text-xl border">
                      {editedUser.name ? editedUser.name.charAt(0) : "P"}
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <label className="block mb-1 text-sm font-semibold text-gray-700">Upload Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 bg-white text-gray-800"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Address / Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editedUser.location}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 bg-white text-gray-800"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={editedUser.phone}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 bg-white text-gray-800"
                  />
                </div>

                {/* DOB */}
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Date of Birth (YYYY-MM-DD)</label>
                  <input
                    type="text"
                    name="dob"
                    placeholder="e.g. 1995-10-15"
                    value={editedUser.dob}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 bg-white text-gray-800"
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Blood Group</label>
                  <select
                    name="blood"
                    value={editedUser.blood}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 bg-white text-gray-800"
                  >
                    <option value="">Select Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={editedUser.gender}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 bg-white text-gray-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Weight */}
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Weight (KG)</label>
                  <input
                    type="number"
                    name="weight"
                    value={editedUser.weight}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 bg-white text-gray-800"
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Height (CM)</label>
                  <input
                    type="number"
                    name="height"
                    value={editedUser.height}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 bg-white text-gray-800"
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Emergency Contact</label>
                  <input
                    type="text"
                    name="emergency"
                    value={editedUser.emergency}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 bg-white text-gray-800"
                  />
                </div>

                {/* Occupation */}
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={editedUser.occupation}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 bg-white text-gray-800"
                  />
                </div>
              </div>

              {/* About */}
              <div className="mt-5">
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">About Yourself</label>
                <textarea
                  rows="3"
                  name="about"
                  value={editedUser.about}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:border-blue-500 resize-none bg-white text-gray-800"
                  placeholder="Write something about yourself..."
                ></textarea>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenEdit(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-[#0C8CE9] text-white hover:bg-blue-600 font-semibold shadow transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ALL APPOINTMENTS MODAL ================= */}
      {showAppointments && (
        <div className="fixed inset-0 bg-black/40 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative border shadow-2xl max-h-[85vh] overflow-y-auto my-8">
            <button
              onClick={() => setShowAppointments(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-black border-b pb-2">All Appointments History</h2>
            <div className="space-y-4">
              {appointments.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 hover:shadow-md transition"
                >
                  <div>
                    <h3 className="font-bold text-black">{item.doctor?.name || "Doctor"}</h3>
                    <p className="text-sm text-[#0C8CE9] font-semibold">{item.doctor?.specialization}</p>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                      {item.date} - {item.time} | Fee: {item.doctor?.fees || 800} BDT
                    </p>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.status === "approved" ? "bg-green-100 text-green-600" :
                      item.status === "rejected" ? "bg-red-100 text-red-600" :
                      item.status === "completed" ? "bg-blue-100 text-blue-600" :
                      "bg-yellow-100 text-yellow-600"
                    }`}>
                      {item.status}
                    </span>

                    <div className="flex gap-2 items-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide border ${
                        item.paymentStatus === "Paid"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }`}>
                        {item.paymentStatus === "Paid" ? "Paid" : "Unpaid"}
                      </span>

                      {item.paymentStatus !== "Paid" && item.status !== "rejected" && (
                        <button
                          onClick={() => {
                            setPayAppointment(item);
                            setShowAppointments(false);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1 rounded text-[10px] tracking-wider transition duration-300 uppercase shadow-sm"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= ALL PRESCRIPTIONS MODAL ================= */}
      {showPrescriptions && (
        <div className="fixed inset-0 bg-black/40 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative border shadow-2xl max-h-[85vh] overflow-y-auto my-8">
            <button
              onClick={() => setShowPrescriptions(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-black border-b pb-2">All Prescriptions</h2>
            <div className="space-y-4">
              {prescriptions.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 hover:shadow-md transition"
                >
                  <div>
                    <h3 className="font-bold text-black">{item.diagnosis}</h3>
                    <p className="text-sm text-gray-500 font-semibold">Prescribed by {item.doctor?.name || "Doctor"}</p>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">{item.date}</p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedPrescription(item);
                        setShowPrescriptions(false);
                      }}
                      className="border border-[#0C8CE9] text-[#0C8CE9] font-semibold px-4 py-2 rounded-xl hover:bg-[#0C8CE9] hover:text-white transition text-sm animate-pulse"
                    >
                      View
                    </button>
                    <a
                      href={item.medicines ? `data:text/plain;charset=utf-8,${encodeURIComponent(
                        generatePrescriptionText(item)
                      )}` : "#"}
                      download={`Prescription-${item.diagnosis.replace(/\s+/g, '_')}-${item.date}.txt`}
                      className="bg-[#0C8CE9] text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-600 transition text-sm text-center flex items-center justify-center"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= RX PRESCRIPTION PAD VIEWER MODAL ================= */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 relative border shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn text-slate-700 my-8">
            {/* Close */}
            <button
              onClick={() => setSelectedPrescription(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition"
            >
              <FaTimes size={20} />
            </button>

            {/* Letterhead */}
            <div className="flex justify-between items-start border-b-2 border-[#0C8CE9] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <img src={Logo} alt="logo" className="w-12 h-12 object-cover" />
                <div className="leading-tight text-left">
                  <h2 className="text-xl font-bold text-[#0C8CE9]">Smart Medical</h2>
                  <p className="text-xs tracking-wide text-gray-500">Service Platform</p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-gray-800 text-sm">{selectedPrescription.doctor?.name || "Doctor"}</h3>
                <p className="text-xs text-blue-500 font-bold">{selectedPrescription.doctor?.specialization || "General Medicine"}</p>
                <p className="text-[10px] text-gray-400 font-semibold">{selectedPrescription.doctor?.email || ""}</p>
              </div>
            </div>

            {/* Patient bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 text-xs text-gray-500 font-semibold">
              <p>Patient: <span className="text-slate-800 font-bold">{user.name}</span></p>
              <p>Age: <span className="text-slate-800 font-bold">{age} Yrs</span></p>
              <p>Gender: <span className="text-slate-800 font-bold">{user.gender || "Male"}</span></p>
              <p>Date: <span className="text-slate-800 font-bold">{selectedPrescription.date}</span></p>
            </div>

            {/* Rx symbol */}
            <div className="text-4xl font-serif text-[#0C8CE9] font-bold mb-3 select-none">℞</div>

            {/* Diagnosis */}
            <div className="bg-blue-50/50 border-l-4 border-[#0C8CE9] p-4 rounded-r-xl text-xs font-semibold text-blue-900 mb-6">
              <span>Diagnosis:</span> {selectedPrescription.diagnosis}
            </div>

            {/* Table of Medicines */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl mb-6">
              <table className="w-full text-left text-xs text-gray-600 bg-white min-w-[500px]">
                <thead className="bg-slate-50 text-gray-700 font-bold uppercase border-b border-slate-100">
                  <tr>
                    <th className="p-3">Medicine Name</th>
                    <th className="p-3">Dosage</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold">
                  {selectedPrescription.medicines && selectedPrescription.medicines.length > 0 ? (
                    selectedPrescription.medicines.map((med, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-800 font-bold">{med.name}</td>
                        <td className="p-3">{med.dosage}</td>
                        <td className="p-3">{med.duration}</td>
                        <td className="p-3 text-gray-500">{med.instructions || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-400">No medicines prescribed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Print & Download buttons inside modal */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handlePrintPrescription(selectedPrescription)}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
              >
                Print Prescription
              </button>
              <a
                href={selectedPrescription.medicines ? `data:text/plain;charset=utf-8,${encodeURIComponent(
                  generatePrescriptionText(selectedPrescription)
                )}` : "#"}
                download={`Prescription-${selectedPrescription.diagnosis.replace(/\s+/g, '_')}-${selectedPrescription.date}.txt`}
                className="w-full sm:w-auto bg-[#0C8CE9] hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition text-center flex items-center justify-center"
              >
                Download Text
              </a>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="w-full sm:w-auto border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold py-2.5 px-6 rounded-xl text-xs transition text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PATIENT CHAT / MESSAGES MODAL ================= */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl relative border shadow-2xl h-[80vh] flex flex-col overflow-hidden animate-fadeIn text-slate-700 font-main my-8">
            {/* Header */}
            <div className="bg-[#0C8CE9] p-5 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <FaRegComments size={24} />
                <div>
                  <h2 className="text-lg font-bold">Consultation Chat Desk</h2>
                  <p className="text-[10px] text-blue-100 font-semibold tracking-wider uppercase">Live Patient Consultation Messages</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChatModal(false);
                  window.history.replaceState(null, "", window.location.pathname);
                }}
                className="text-white hover:text-red-200 transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content pane */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Doctor contacts sidebar */}
              <div className={`w-full md:w-72 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/30 ${activeChatDoctor ? "hidden md:flex" : "flex"}`}>
                <div className="p-4 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">My Consultation Doctors</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {chatContacts.length === 0 ? (
                    <p className="text-xs text-gray-400 font-semibold text-center py-10">No doctors available for chat.</p>
                  ) : (
                    chatContacts.map((contact) => (
                      <div
                        key={contact._id}
                        onClick={() => setActiveChatDoctor(contact)}
                        className={`flex items-center gap-3.5 p-3 rounded-2xl border cursor-pointer transition ${
                          activeChatDoctor?._id === contact._id
                            ? "bg-blue-50 border-blue-100 text-blue-600"
                            : "bg-white border-slate-50 hover:bg-slate-50"
                        }`}
                      >
                        <img
                          src={contact.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=250"}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-800 leading-tight truncate">{contact.name}</h4>
                          <p className="text-[9px] text-[#0C8CE9] font-bold truncate mt-0.5">{contact.specialization}</p>
                          {contact.lastMessage && (
                            <p className="text-[9px] text-slate-400 truncate mt-1">{contact.lastMessage}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat messages main window */}
              <div className={`flex-1 flex flex-col bg-slate-50/30 ${activeChatDoctor ? "flex" : "hidden md:flex"}`}>
                {activeChatDoctor ? (
                  <>
                    {/* Header */}
                    <div className="bg-white border-b border-slate-100 px-5 py-3.5 flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setActiveChatDoctor(null)}
                        className="md:hidden text-slate-500 hover:text-[#0C8CE9] mr-2 p-1 font-bold text-sm flex items-center gap-1 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                      >
                        &larr; Back
                      </button>
                      <img
                        src={activeChatDoctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=250"}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{activeChatDoctor.name}</h4>
                        <span className="text-[9px] text-[#0C8CE9] font-bold block">{activeChatDoctor.specialization}</span>
                      </div>
                    </div>

                    {/* Messages bubbles */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {chatHistory.length === 0 ? (
                        <div className="text-center py-20 text-slate-400 text-xs font-semibold">
                          <p>No messages in this chat session yet.</p>
                          <p className="text-[10px] text-slate-300 mt-1">Send a message below to start consults.</p>
                        </div>
                      ) : (
                        chatHistory.map((msg, index) => {
                          const isMe = msg.sender === user._id;
                          return (
                            <div
                              key={index}
                              className={`flex flex-col max-w-[75%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
                            >
                              <div className={`p-3 rounded-xl text-xs font-semibold ${
                                isMe
                                  ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                                  : "bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm"
                              }`}>
                                {msg.text}
                              </div>
                              <span className="text-[8px] font-semibold text-slate-400 mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Chat Text Input bar */}
                    <form onSubmit={handleSendChatMessage} className="bg-white border-t border-slate-100 p-4 flex gap-2 shrink-0">
                      <input
                        type="text"
                        placeholder="Type question or message to doctor..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 border border-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none text-slate-800 placeholder-slate-400 font-semibold focus:border-blue-500 bg-slate-50/20"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition"
                      >
                        Send
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center p-6">
                    <FaRegComments size={40} className="mb-3 text-slate-200 animate-bounce" />
                    <p className="text-sm font-bold text-slate-500">Select Doctor Conversation</p>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Select one of your doctors on the left side list to chat in real-time.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= PAYMENT CHECKOUT MODAL ================= */}
      {payAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-[100] p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative p-6 flex flex-col gap-5 my-8">
            {/* Close Button */}
            <button
              onClick={() => {
                setPayAppointment(null);
                // Reset inputs
                setBillingDetails({
                  mobile: "",
                  pin: "",
                  otp: "",
                  cardName: "",
                  cardNumber: "",
                  expiry: "",
                  cvv: ""
                });
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-red-500 transition duration-200"
            >
              <FaTimes size={20} />
            </button>

            {/* Header */}
            <div className="text-center pb-2 border-b border-slate-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-3">
                <FaLock size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-800">Secure Checkout</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Complete your consultation payment securely</p>
            </div>

            {/* Details */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-1.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Doctor:</span>
                <span className="text-slate-800 font-bold">{payAppointment.doctor?.name || "Doctor"}</span>
              </div>
              <div className="flex justify-between">
                <span>Specialization:</span>
                <span className="text-[#0C8CE9] font-bold">{payAppointment.doctor?.specialization || "General Medicine"}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span className="text-slate-800 font-bold">{payAppointment.date} at {payAppointment.time}</span>
              </div>
              <div className="border-t border-slate-200/60 my-1"></div>
              <div className="flex justify-between text-sm font-bold text-slate-800">
                <span>Amount:</span>
                <span className="text-blue-600 font-black">{payAppointment.doctor?.fees || 800} BDT</span>
              </div>
            </div>

            {/* Payment Tabs */}
            <div>
              <label className="block mb-2 text-xs font-bold text-slate-700 uppercase tracking-wider">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bkash")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    paymentMethod === "bkash"
                      ? "border-pink-500 bg-pink-50 text-pink-700 shadow-sm scale-105"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider">bKash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("nagad")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    paymentMethod === "nagad"
                      ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm scale-105"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider">Nagad</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    paymentMethod === "card"
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm scale-105"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider">Card</span>
                </button>
              </div>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleProcessPayment} className="flex flex-col gap-4">
              {(paymentMethod === "bkash" || paymentMethod === "nagad") ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Mobile Number</label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={billingDetails.mobile}
                      onChange={(e) => setBillingDetails({ ...billingDetails, mobile: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition"
                      maxLength={11}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">PIN</label>
                    <input
                      type="password"
                      placeholder="XXXX"
                      value={billingDetails.pin}
                      onChange={(e) => setBillingDetails({ ...billingDetails, pin: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={billingDetails.cardName}
                      onChange={(e) => setBillingDetails({ ...billingDetails, cardName: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Card Number</label>
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={billingDetails.cardNumber}
                      onChange={(e) => setBillingDetails({ ...billingDetails, cardNumber: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition"
                      maxLength={16}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={billingDetails.expiry}
                        onChange={(e) => setBillingDetails({ ...billingDetails, expiry: e.target.value })}
                        className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">CVV</label>
                      <input
                        type="password"
                        placeholder="XXX"
                        value={billingDetails.cvv}
                        onChange={(e) => setBillingDetails({ ...billingDetails, cvv: e.target.value })}
                        className="w-full border border-slate-200 p-3 rounded-xl bg-white text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingPayment}
                className="w-full bg-[#0C8CE9] hover:bg-blue-600 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
              >
                {submittingPayment ? (
                  <>
                    <BeatLoader size={6} color="#ffffff" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Pay Now ({payAppointment.doctor?.fees || 800} BDT)</span>
                )}
              </button>
            </form>

            {/* Gateway Branding */}
            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1 mt-1">
              <FaLock size={8} /> SSL Secured & Encrypted Gateway
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
