import React from 'react';
import { Link } from 'react-router';
import {
  UserCog,
  Mail,
  Fingerprint,
  ShieldCheck,
  Crown,
  Sparkles,
  User,
  Phone,
  CalendarDays,
  ExternalLink,
} from 'lucide-react';
import UseAuth from '../../../Hooks/UseAuth';

const DashboardHome = () => {
  const { user } = UseAuth();

  // তোর ডাটাবেজ অনুযায়ী কন্ডিশন
  const isAdmin = user?.role === 'admin';
  const hasPhoto = user?.photo_url && user?.photo_url !== '';

  return (
    <div className="space-y-8">
      {/* --- Main Profile Hero --- */}
      <div className="bg-white p-8 lg:p-12 rounded-[3.5rem] shadow-2xl shadow-gray-100 border border-gray-50 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        {/* Profile Image / Icon Logic */}
        <div className="relative">
          <div className="w-40 h-40 rounded-[2.8rem] overflow-hidden border-8 border-white shadow-2xl bg-gray-50 flex items-center justify-center ring-1 ring-gray-100">
            {hasPhoto ? (
              <img
                src={user.photo_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={60} className="text-gray-200" />
            )}
          </div>

          <div
            className={`absolute -bottom-2 -right-2 p-4 rounded-2xl border-4 border-white shadow-xl text-white ${isAdmin ? 'bg-amber-500' : 'bg-primary'}`}
          >
            {isAdmin ? (
              <Crown size={22} strokeWidth={2.5} />
            ) : (
              <ShieldCheck size={22} strokeWidth={2.5} />
            )}
          </div>
        </div>

        {/* Info & Actions */}
        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="mb-6">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                {user?.role || 'Guest'}
              </p>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-neutral tracking-tighter italic uppercase leading-none mb-4">
              {user?.name || 'User'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-3 bg-neutral text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all shadow-xl"
            >
              <UserCog size={16} /> Update Profile
            </Link>

            {user?.document_url && (
              <a
                href={user.document_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-white border-2 border-gray-100 text-gray-400 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-primary hover:text-primary transition-all"
              >
                <ExternalLink size={16} /> View NID/Doc
              </a>
            )}
          </div>
        </div>
      </div>

      {/* --- Detail Grid (Based on your DB keys) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Email */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
            <Mail size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
              Email Address
            </p>
            <p className="font-bold text-neutral truncate text-xs">
              {user?.email || 'N/A'}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center shrink-0">
            <Phone size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
              Phone
            </p>
            <p className="font-bold text-neutral text-xs">
              {user?.phone || 'N/A'}
            </p>
          </div>
        </div>

        {/* Age & Gender */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <CalendarDays size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
              Identity
            </p>
            <p className="font-bold text-neutral text-xs uppercase">
              {user?.age || '??'} Yrs • {user?.gender || 'N/A'}
            </p>
          </div>
        </div>

        {/* System ID */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
            <Fingerprint size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
              Database ID
            </p>
            <p className="font-bold text-neutral text-xs italic">
              # {user?.id || '00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
