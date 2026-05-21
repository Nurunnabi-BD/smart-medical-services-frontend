import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import LoginRegistration from "./components/Login";
import Register from "./components/Register";
import ServicesPage from "./pages/Services";
import ContactPage from "./pages/Contact";
import "./App.css";

function App() {
  return (
    <div className="bg-white min-h-screen">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/login" element={<LoginRegistration />} />
        <Route path="/Register" element={<Register/>}/>
        <Route path="/Services" element={<ServicesPage/>}/>
        <Route path="/Contact" element={<ContactPage/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
