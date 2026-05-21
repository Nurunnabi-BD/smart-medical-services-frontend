import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";

import Logo from "../assets/logo.png";

const Header = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Find Doctors", path: "/find-doctors" },
    { name: "Pharmacy", path: "/pharmacy" },
    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const navClass = ({ isActive }) =>
    `
    relative text-[15px] font-semibold transition-all duration-300
    ${isActive ? "text-[#0C8CE9]" : "text-gray-700 hover:text-[#0C8CE9]"}

    after:absolute after:left-0 after:-bottom-1
    after:h-[2px] after:bg-[#0C8CE9]
    after:transition-all after:duration-300
    after:w-0 hover:after:w-full

    ${isActive ? "after:w-full" : ""}
  `;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-[80px]">
          {/* LEFT */}
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="logo" className="w-12 h-12 object-cover" />

            <div className="hidden sm:block leading-tight">
              <h1 className="text-xl font-bold text-[#0C8CE9]">
                Smart Medical
              </h1>

              <p className="text-xs tracking-wide text-gray-500">
                Service Platform
              </p>
            </div>
          </Link>

          {/* CENTER */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={navClass}>
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Notification */}
            <button className="relative w-11 h-11 rounded-full border border-[#0C8CE9] text-[#0C8CE9] flex items-center justify-center hover:bg-[#0C8CE9] hover:text-white transition-all duration-300">
              <FaBell className="text-lg" />

              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Login Button */}
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0C8CE9] text-white font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <FaUserCircle className="text-lg" />
              Login / Register
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-11 h-11 rounded-full border border-[#0C8CE9] flex items-center justify-center text-[#0C8CE9]"
            >
              {open ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 bg-white border-t border-gray-100 ${
          open ? "max-h-[400px] py-4" : "max-h-0"
        }`}
      >
        <div className="px-6 space-y-5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block text-[16px] font-medium ${
                  isActive ? "text-[#0C8CE9]" : "text-gray-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#0C8CE9] text-white font-medium"
          >
            <FaUserCircle />
            Login / Register
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
