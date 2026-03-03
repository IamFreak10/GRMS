import React from 'react';
import { Outlet, NavLink } from 'react-router';
import Navbar from '../Shared/Navbar/Navbar';
import {
  FaHotel,
  FaBed,
  FaWallet,
  FaUsers,
  FaChartLine,
  FaDoorOpen,
  FaCirclePlus, // 5.5.0 fa6 এ এটাই সঠিক নাম
  FaBarsStaggered,
} from 'react-icons/fa6';
import UseAuth from '../Hooks/UseAuth';

export default function DashBoardLayout() {
  const { user } = UseAuth();
  const isAdmin = user?.role === 'admin';

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
      isActive
        ? 'bg-primary text-primary-content shadow-lg'
        : 'hover:bg-primary/10 text-neutral'
    }`;

  const SideLinks = () => (
    <>
      <div className="mb-6 hidden lg:block">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b pb-2 border-base-200">
          Management Console
        </h2>
      </div>
      <ul className="space-y-3">
        {!isAdmin ? (
          <>
            <li>
              <NavLink to="/dashboard/book-room" className={navItemClass}>
                <FaHotel /> Book Room
              </NavLink>
            </li>
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
        ) : (
          <>
            <li>
              <NavLink to="/dashboard/manage-rooms" className={navItemClass}>
                <FaBed /> Manage Rooms
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
    </>
  );

  return (
    <div className="bg-base-100 min-h-screen">
      <Navbar />

      {/* Drawer Structure for Perfect Mobile Responsiveness */}
      <div className="drawer lg:drawer-open">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        <div className="drawer-content flex flex-col">
          {/* Mobile Header: Only shows on small screens */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-30 shadow-sm">
            <h2 className="font-black text-primary uppercase tracking-widest text-xs">
              Dashboard
            </h2>
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost btn-sm drawer-button"
            >
              <FaBarsStaggered className="text-primary text-xl" />
            </label>
          </div>

          {/* Main Content: Outlet rendered here */}
          <main className="flex-1 p-4 lg:p-10 bg-[#F9FAFB] min-h-[calc(100vh-80px)]">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Sidebar Overlay and Content */}
        <aside className="drawer-side z-[100]">
          <label
            htmlFor="dashboard-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="w-72 min-h-full bg-white p-6 border-r border-base-200 shadow-xl lg:shadow-none">
            {/* Brand Logo in Sidebar (Visible on mobile) */}
            <div className="lg:hidden mb-8">
              <h1 className="text-2xl font-black text-neutral">
                Nexus<span className="text-primary">.</span>
              </h1>
            </div>

            <SideLinks />
          </div>
        </aside>
      </div>
    </div>
  );
}
