import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  FaUserCheck,
  FaWalking,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';
import useAxiosSecure from '../../../../Hooks/UseAxiosSecure';
import { data } from 'react-router';

const UserInteractivity = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ১. সার্চ স্টেট
  const [searchTerm, setSearchTerm] = useState('');

  // ২. ডাটা ফেচিং
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const res = await axiosSecure.get('/booking/all-bookings-for-admin');
      return res.data?.data || [];
    },
  });

  console.log(bookings);
  // ৩. সার্চ লজিক (Client-side Filter)
  const filteredBookings = bookings.filter(
    (book) =>
      book.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.room_no?.toString().includes(searchTerm)
  );

  // ৪. মিউটেশন (Check-In/Out)
  const mutation = useMutation({
    mutationFn: async ({ bookingId, endpoint }) => {
      const res = await axiosSecure.patch(endpoint, { bookingId });
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire('Success', data.message || 'Updated!', 'success');
      queryClient.invalidateQueries(['admin-bookings']);
    },
    onError: (error) => {
      Swal.fire('Error', error.response?.data?.message || 'Failed!', 'error');
    },
  });

  const handleStatusAction = async (bookingId, type) => {
    const isCheckIn = type === 'in';
    const endpoint = isCheckIn ? '/booking/check-in' : '/booking/check-out';

    if (!isCheckIn) {
      const confirm = await Swal.fire({
        title: 'Confirm Check-Out?',
        text: 'This will free up the bed!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, Check-Out',
      });
      if (!confirm.isConfirmed) return;
    }
    mutation.mutate({ bookingId, endpoint });
  };

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse font-black text-gray-400">
        LOADING...
      </div>
    );

  return (
    <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen">
      {/* Header & Search Bar */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-neutral">
            Guest <span className="text-primary italic">Interactivity</span>
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            Search by Transaction ID or Guest Name
          </p>
        </div>

        {/* --- SEARCH BAR START --- */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search Transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm shadow-sm group-hover:shadow-md"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500"
            >
              <FaTimes />
            </button>
          )}
        </div>
        {/* --- SEARCH BAR END --- */}
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBookings.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 relative group transition-all duration-300"
          >
            {/* Transaction ID Badge */}
            <div className="mb-4">
              <span className="text-[9px] font-black bg-gray-100 px-3 py-1 rounded-md text-gray-500 uppercase tracking-tighter">
                TXID: {book.transaction_id || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-black text-neutral uppercase">
                  Room {book.room_no}
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {book.branch} Branch
                </p>
              </div>
              <div
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  book.status === 'active'
                    ? 'bg-green-100 text-green-600'
                    : book.status === 'completed'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-orange-100 text-orange-600'
                }`}
              >
                {book.status || 'Pending'}
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <FaUserCheck className="text-gray-300" size={14} />
                <p className="text-sm font-bold text-neutral truncate">
                  {book.guest_name}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
                <FaClock className="text-gray-400" size={12} />
                <p className="text-[10px] font-bold text-neutral">
                  {book.check_in} — {book.check_out}
                </p>
              </div>
            </div>

            {/* Buttons (Same Logic as before) */}
            <div className="pt-4 border-t border-dashed border-gray-100">
              {book.status === 'pending' && book.is_permitted && (
                <button
                  disabled={mutation.isPending}
                  onClick={() => handleStatusAction(book.id, 'in')}
                  className="w-full bg-neutral text-white font-black text-[11px] uppercase py-4 rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                >
                  <FaWalking className="animate-bounce" /> Confirm Check-In
                </button>
              )}
              {book.status === 'active' && (
                <button
                  disabled={mutation.isPending}
                  onClick={() => handleStatusAction(book.id, 'out')}
                  className="w-full bg-red-50 text-red-600 border border-red-100 font-black text-[11px] uppercase py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <FaCheckCircle /> Final Check-Out
                </button>
              )}
              {book.status === 'completed' && (
                <div className="w-full bg-gray-50 text-gray-400 font-black text-[11px] uppercase py-4 rounded-2xl text-center border border-dashed">
                  Stay Completed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 mt-10">
          <p className="text-gray-300 font-black uppercase tracking-[0.2em]">
            No match found for "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};

export default UserInteractivity;
