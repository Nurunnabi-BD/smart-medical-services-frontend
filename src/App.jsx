import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import LoginRegistration from "./components/Login";
import Register from "./components/Register";
import ServicesPage from "./pages/Services";
import ContactPage from "./pages/Contact";
import User from "./pages/User";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import BookAppointment from "./pages/BookAppointment";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import DoctorLogin from "./pages/DoctorLogin";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import GuestRoute from "./components/GuestRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Pharmacy from "./pages/Pharmacy";
import CartDrawer from "./components/CartDrawer";
import "./App.css";

function App() {
  const location = useLocation();
  const isDashboard =
    location.pathname.startsWith("/doctor-dashboard") ||
    location.pathname.startsWith("/admin-dashboard");

  return (
    <AuthProvider>
      <CartProvider>
        <CartDrawer />
        <div className="bg-white min-h-screen">
          <ScrollToTop />
          {!isDashboard && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginRegistration />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/admin-login"
            element={
              <GuestRoute>
                <AdminLogin />
              </GuestRoute>
            }
          />
          <Route
            path="/doctor-login"
            element={
              <GuestRoute>
                <DoctorLogin />
              </GuestRoute>
            }
          />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected Patient Routes */}
          <Route
            path="/user"
            element={
              <PrivateRoute allowedRoles={["patient"]}>
                <User />
              </PrivateRoute>
            }
          />
          <Route
            path="/find-doctors"
            element={
              <PrivateRoute allowedRoles={["patient"]}>
                <Doctors />
              </PrivateRoute>
            }
          />
          <Route
            path="/doctors/:id"
            element={
              <PrivateRoute allowedRoles={["patient"]}>
                <DoctorDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/doctors/:id/book"
            element={
              <PrivateRoute allowedRoles={["patient"]}>
                <BookAppointment />
              </PrivateRoute>
            }
          />

          {/* Protected Doctor Routes */}
          <Route
            path="/doctor-dashboard"
            element={
              <PrivateRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </PrivateRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {!isDashboard && <Footer />}
      </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
