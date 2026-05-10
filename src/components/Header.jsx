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
    { name: "About", path: "/about" },
  ];

  const navClass = ({ isActive }) =>
    `
    relative px-1 py-2 font-medium font-main transition-all duration-300
    ${isActive ? "text-[#0C8CE9]" : "text-gray-700 hover:text-[#0C8CE9]"}
    after:content-[''] after:absolute after:left-0 after:-bottom-1 
    after:h-[2px] after:w-0 after:bg-[#0C8CE9] after:transition-all after:duration-300
    hover:after:w-full
    ${isActive ? "after:w-full" : ""}
    `;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 ">
      <div className="navbar max-w-7xl mx-auto px-4 lg:px-8 container">

        {/* LEFT */}
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="logo" className="w-12 h-12" />
            <div className="hidden sm:block leading-tight">
              <h1 className="text-lg font-bold text-[#0C8CE9]">
                Smart Medical
              </h1>
              <p className="text-xs text-[#6C6C6C]">Service Platform</p>
            </div>
          </Link>
        </div>

        {/* CENTER */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex gap-8">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} className={navClass}>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="navbar-end gap-3">

          <button className="btn btn-ghost btn-circle text-[#6C6C6C] hover:text-[#0C8CE9] transition">
            <FaBell className="text-xl" />
          </button>

          <Link
            to="/login"
            className="hidden sm:flex items-center font-main gap-2 px-5 py-2 rounded-full bg-[#0C8CE9] text-white hover:opacity-90 transition"
          >
            <FaUserCircle />
            Login / Register
          </Link>

          {/* MOBILE */}
          <button
            onClick={() => setOpen(!open)}
            className="btn btn-ghost lg:hidden text-gray-700"
          >
            {open ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <ul className="p-4 space-y-3">
            {navItems.map((item) => (
              <li key={item.path} onClick={() => setOpen(false)}>
                <NavLink to={item.path} className={navClass}>
                  {item.name}
                </NavLink>
              </li>
            ))}

            <li className="pt-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="btn w-full rounded-full bg-[#0C8CE9] text-white"
              >
                Login / Register
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;