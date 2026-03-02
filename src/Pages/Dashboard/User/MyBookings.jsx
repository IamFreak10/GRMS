import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
  FaCalendarCheck,
  FaCircleCheck,
  FaCircleXmark,
  FaLocationDot,
  FaClockRotateLeft,
  FaTriangleExclamation,
  FaShieldHalved,
} from 'react-icons/fa6';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import UseAuth from '../../../Hooks/UseAuth';

export default function MyBookings() {
  const { user } = UseAuth();
  const { search } = useLocation();
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const queryParams = new URLSearchParams(search);
  const status = queryParams.get('status');


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosSecure.get(`/booking/my-bookings/${user?.id}`);
        setBookings(res.data.data || res.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchBookings();
  }, [user, axiosSecure]);

 
  const handlePendingPayment = async (book) => {
    try {
      Swal.fire({
        title: 'Redirecting to Payment...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const paymentPayload = {
        userId: user?.id,
        roomId: book.room_id,
        bedId: book.bed_id,
        checkIn: book.check_in,
        checkOut: book.check_out,
        totalAmount: book.total_amount,
        userName: user?.displayName || user?.name,
        email: user?.email
      };

      // তোর ব্যাকএন্ডের পেমেন্ট ইনিশিয়েট এপিআই
      const res = await axiosSecure.post('/booking/initiate-payment', paymentPayload);

      if (res.data?.success && res.data?.paymentUrl) {
        window.location.replace(res.data.paymentUrl);
      } else {
        Swal.fire('Error', 'Failed to start payment process', 'error');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      Swal.fire('Error', 'Could not connect to payment gateway', 'error');
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-black animate-pulse text-gray-400 uppercase tracking-widest">
        Loading Your History...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 font-sans text-neutral">
      <div className="max-w-6xl mx-auto">
        
        {/* পেমেন্ট স্ট্যাটাস অ্যালার্ট */}
        <div className="mb-10">
          {status === 'success' && (
            <div className="bg-green-50 border border-green-100 p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <FaCircleCheck className="text-green-500" size={32} />
              <div>
                <h3 className="font-black text-green-800 uppercase text-sm italic">Payment Successful!</h3>
                <p className="text-xs text-green-600 font-bold uppercase opacity-80">Your spot is reserved and dates are blocked.</p>
              </div>
            </div>
          )}

          {(status === 'fail' || status === 'cancel') && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <FaCircleXmark className="text-red-500" size={32} />
              <div>
                <h3 className="font-black text-red-800 uppercase text-sm italic">
                  {status === 'fail' ? 'Payment Failed!' : 'Payment Canceled!'}
                </h3>
                <p className="text-xs text-red-600 font-bold uppercase opacity-80">Please try paying again from the list below.</p>
              </div>
            </div>
          )}
        </div>

        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-5xl font-black tracking-tighter uppercase mb-2">
              My <span className="text-primary italic">Stays.</span>
            </h2>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Record of your upcoming and past bookings</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-3xl font-black text-neutral">{bookings.length}</p>
            <p className="text-[9px] font-black uppercase text-gray-300 italic">Total Entries</p>
          </div>
        </header>

        {/* বুকিং লিস্ট কার্ডস */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.length > 0 ? (
            bookings.map((book) => (
              <div key={book.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 hover:border-primary/20 transition-all group">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-neutral group-hover:bg-primary transition-colors text-white px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest italic">
                    Room {book.room_no}
                  </div>
                  <div className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border-2 ${
                    book.payment_status === 'paid' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-orange-50 border-orange-100 text-orange-600'
                  }`}>
                    {book.payment_status}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-4 text-neutral">
                    <FaCalendarCheck className="text-primary" size={18} />
                    <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase leading-none mb-1">Duration</p>
                      <p className="text-sm font-bold">{book.check_in} — {book.check_out}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-neutral">
                    <FaLocationDot className="text-primary" size={18} />
                    <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase leading-none mb-1">Branch</p>
                      <p className="text-xs font-bold uppercase">{book.branch} Branch</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-neutral opacity-60 italic">
                    <FaClockRotateLeft className="text-gray-400" size={16} />
                    <p className="text-[10px] font-bold tracking-tight">Trxn: {book.transaction_id}</p>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-dashed border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase italic">Amount Payable</p>
                    <p className="text-3xl font-black text-neutral">${book.total_amount}</p>
                  </div>

                  {/* যদি পেমেন্ট পেইড না হয়, তবে Pay Now বাটন দেখাবে */}
                  {book.payment_status !== 'paid' ? (
                    <button 
                      onClick={() => handlePendingPayment(book)}
                      className="bg-primary text-white text-[10px] font-black uppercase px-6 py-3 rounded-2xl hover:bg-neutral transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-inner">
                      <FaShieldHalved size={20} />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-4 border-dashed border-gray-50">
              <FaCalendarCheck size={40} className="mx-auto text-gray-100 mb-4" />
              <h3 className="text-2xl font-black text-gray-200 uppercase italic tracking-tighter">No bookings found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}