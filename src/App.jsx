import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login"
import About from "./pages/About";
import "./App.css"

function App() {
  return (
    <div className="bg-white min-h-screen">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/About" element={<About/>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
