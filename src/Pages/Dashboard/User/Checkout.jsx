import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  MessageSquare,
  DoorOpen,
  LogIn,
  ClipboardPaste,
} from 'lucide-react';
import UseAuth from '../../../Hooks/UseAuth';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = UseAuth();
  const [txnId, setTxnId] = useState('');

  const handleWhatsApp = (type) => {
    if (!txnId) return alert('Please paste your Transaction ID first!');

    const adminPhone = '8801789800651';
    const action = type === 'in' ? 'Check-In' : 'Check-Out';

    const message =
      `*GRMS- Status Update*%0A%0A` +
      `*Request Type:* ${action}%0A` +
      `*Guest Name:* ${user?.displayName || user?.name}%0A` +
      `*Transaction ID:* ${txnId}%0A%0A` +
      `Dear Admin, please verify this ID and update my stay status.`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${adminPhone}&text=${message}`;

    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      whatsappUrl,
      'WhatsAppPopup',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-6 lg:p-12 font-sans flex flex-col items-center">
      <div className="w-full max-w-xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-8 hover:text-primary transition-all"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-indigo-100/50 border border-white">
          <header className="text-center mb-12">
            <div className="inline-block p-4 bg-primary/5 rounded-3xl mb-4">
              <MessageSquare size={32} className="text-primary" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-neutral">
              Action <span className="text-primary italic">Center</span>
            </h2>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
              Notify reception for status update
            </p>
          </header>

          <div className="mb-12">
            <div className="flex items-center justify-between mb-3 px-6">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                Transaction ID
              </label>
              <ClipboardPaste size={14} className="text-gray-300" />
            </div>
            <input
              type="text"
              placeholder="Enter or Paste ID"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              className="w-full h-20 px-8 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-xl transition-all text-center placeholder:opacity-30"
            />
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleWhatsApp('in')}
              className="group w-full bg-neutral text-white py-6 rounded-3xl font-black uppercase text-xs flex items-center justify-center gap-4 hover:bg-primary transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-primary/20"
            >
              <LogIn
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
              Confirm Check-In
            </button>

            <button
              onClick={() => handleWhatsApp('out')}
              className="group w-full bg-white border-2 border-rose-100 text-rose-500 py-6 rounded-3xl font-black uppercase text-xs flex items-center justify-center gap-4 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-lg shadow-rose-50"
            >
              <DoorOpen
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Confirm Check-Out
            </button>
          </div>

          <div className="mt-10 py-6 border-t border-gray-50 text-center">
            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              Fast Response Protocol • Hostel Reception
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
