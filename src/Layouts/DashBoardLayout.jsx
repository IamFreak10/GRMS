import React from 'react';
import { Outlet, NavLink } from 'react-router';
import Navbar from '../Shared/Navbar/Navbar';
import { FaHotel, FaBed, FaWallet, FaUsers, FaChartLine, FaDoorOpen, FaPlusCircle } from 'react-icons/fa';
import UseAuth from '../Hooks/UseAuth';


export default function DashBoardLayout() {
  const { user } = UseAuth();
  const isAdmin = user?.role === 'admin'; 

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
      isActive ? "bg-primary text-primary-content shadow-lg scale-105" : "hover:bg-primary/10 text-neutral"
    }`;

  return (
    <div className="bg-base-100 min-h-screen">
      <Navbar />
      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 bg-white lg:min-h-[calc(100vh-80px)] p-6 border-r border-base-200 sticky top-20 z-40">
          <div className="mb-8 hidden lg:block">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Menu</h2>
          </div>
          
          <ul className="space-y-2">
            {/* COMMON ROUTES (User) */}
            {!isAdmin && (
              <>
                <li>
                  <NavLink to="/dashboard/my-bookings" className={navItemClass}>
                    <FaHotel /> My Bookings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/payment-history" className={navItemClass}>
                    <FaWallet /> Payment Stat
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/checkout" className={navItemClass}>
                    <FaDoorOpen /> Room Checkout
                  </NavLink>
                </li>
              </>
            )}

            {/* ADMIN ROUTES */}
            {isAdmin && (
              <>
                <li>
                  <NavLink to="/dashboard/manage-rooms" className={navItemClass}>
                    <FaBed /> Manage Rooms
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/add-room" className={navItemClass}>
                    <FaPlusCircle /> Add New Room
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/earnings" className={navItemClass}>
                    <FaChartLine /> Earning Stats
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/manage-users" className={navItemClass}>
                    <FaUsers /> User Interactivity
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-10 bg-gray-50/50 min-h-screen">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}