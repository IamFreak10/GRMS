import { useState } from "react";
import { navLinks } from "./navLinks";
// Fixed the imports below - FaThLarge instead of FaLayout
import { FaUserCircle, FaBars, FaSignOutAlt, FaUserAlt, FaThLarge, FaCrown } from "react-icons/fa";
import { Link, NavLink } from "react-router"; 

export default function Navbar() {
  const [user, setUser] = useState({ 
    name: "Mahfuj", 
    email: "mahfuj@example.com",
    role: "User"
  });

  const activeClass = ({ isActive }) => 
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
      isActive ? "bg-primary text-white shadow-lg" : "hover:bg-primary/10 text-base-content"
    }`;

  return (
    <div className="navbar bg-base-100 shadow-xl px-4 md:px-12 sticky top-0 z-[100]">
      
      {/* MOBILE MENU */}
      <div className="navbar-start lg:hidden">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <FaBars size={22} className="text-primary" />
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-base-100 rounded-box w-64 border border-base-200">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className={activeClass}>
                  <link.icon /> {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* LOGO */}
      <div className="navbar-center lg:navbar-start">
        <Link to="/" className="text-2xl font-black text-primary tracking-tighter">
          GRMS<span className="text-secondary">.</span>
        </Link>
      </div>

      {/* DESKTOP MENU */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0 gap-2 font-semibold">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} className={activeClass}>
                <link.icon /> {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* AUTH SECTION */}
      <div className="navbar-end">
        {!user ? (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm px-6">Join</Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            
            {/* JHAKANAKA TOOLTIP CONTAINER */}
            <div className="relative group flex items-center justify-center">
              
              {/* Tooltip (Upor diye nambe) */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 group-hover:-top-14 transition-all duration-500 ease-out pointer-events-none z-50">
                <div className="bg-secondary text-secondary-content text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1">
                  <FaCrown className="text-warning animate-pulse" /> Profile
                </div>
                <div className="w-2 h-2 bg-secondary rotate-45 mx-auto -mt-1 shadow-xl"></div>
              </div>

              {/* DROPDOWN */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar online ring-2 ring-primary/20 ring-offset-2 hover:ring-primary transition-all duration-300">
                  <div className="w-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <FaUserCircle size={32} className="text-primary" />
                  </div>
                </label>
                
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-base-100 rounded-2xl w-60 border border-base-200 animate-in fade-in slide-in-from-top-5 duration-300">
                  <li className="p-4 border-b border-base-100">
                    <span className="font-bold text-base block leading-none">{user.name}</span>
                    <span className="text-[10px] opacity-60 block mt-1 uppercase tracking-wider">{user.role}</span>
                  </li>
                  {/* Fixed FaLayout to FaThLarge */}
                  <li><Link to="/dashboard" className="py-3 mt-2"><FaThLarge className="text-primary"/> Dashboard</Link></li>
                  <li><Link to="/profile" className="py-3"><FaUserAlt className="text-primary"/> Settings</Link></li>
                  <div className="divider my-1 opacity-20"></div>
                  <li>
                    <button onClick={() => setUser(null)} className="text-error font-bold hover:bg-error/10 py-3">
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}