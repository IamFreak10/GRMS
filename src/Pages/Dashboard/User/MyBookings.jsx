import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
  FaCalendarCheck,
  FaCircleCheck,
  FaCircleXmark,
  FaLocationDot,
  FaShieldHalved,
  FaCopy,
  FaCheck
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
  const [copiedId, setCopiedId] = useState(null); // কপিড স্টেট ম্যানেজ করার জন্য

  const queryParams = new URLSearchParams(search);
  const status = queryParams.get('status');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosSecure.get(`/booking/my-bookings/${user?.id}`);
        setBookings(res.data?.data || res.data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user?.id, axiosSecure]);

  // কপি টু ক্লিপবোর্ড ফাংশন
  const handleCopy = (txid) => {
    if (!txid) return;
    navigator.clipboard.writeText(txid);
    setCopiedId(txid);
    
    // ২ সেকেন্ড পর চেক আইকন সরিয়ে ফেলা
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePayNow = async (book) => {
    // ... তোর আগের পেমেন্ট লজিক ঠিক আছে
    setLoading(true);
    try {
      Swal.fire({
        title: 'Redirecting to SSLCommerz...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const bookingPayload = {
        userId: user?.id,
        roomId: book.room_id,
        bedId: book.bed_id,
        checkIn: book.check_in,
        checkOut: book.check_out,
        totalAmount: book.total_amount,
        userName: user?.displayName || user?.name,
        email: user?.email,
      };

      const response = await axiosSecure.post('/booking/create-ssl-payment', bookingPayload);

      if (response.data?.success && response.data?.paymentUrl) {
        window.location.replace(response.data.paymentUrl);
      } else {
        Swal.fire('Error', 'Payment initiation failed!', 'error');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      Swal.fire('Error', error?.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-400 font-black">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Status Alerts (Success/Fail) */}
        <div className="mb-10">
          {status === 'success' && (
            <div className="bg-green-50 p-6 rounded-[2rem] flex items-center gap-4 border border-green-100">
              <FaCircleCheck className="text-green-500" size={32} />
              <h3 className="font-black text-green-800 uppercase italic text-sm">Payment Successful!</h3>
            </div>
          )}
          {(status === 'fail' || status === 'cancel') && (
            <div className="bg-red-50 p-6 rounded-[2rem] flex items-center gap-4 border border-red-100">
              <FaCircleXmark className="text-red-500" size={32} />
              <h3 className="font-black text-red-800 uppercase italic text-sm">Payment {status}!</h3>
            </div>
          )}
        </div>

        <header className="mb-12">
          <h2 className="text-5xl font-black uppercase tracking-tighter">
            My <span className="text-primary italic">Stays.</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((book) => (
            <div key={book.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all group">
              
              {/* Top Row: Room & Status */}
              <div className="flex justify-between items-start mb-6">
                <div className="bg-neutral text-white px-5 py-2 rounded-2xl text-[11px] font-black uppercase">
                  Room {book.room_no}
                </div>
                <div className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${
                  book.payment_status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {book.payment_status}
                </div>
              </div>

              {/* Transaction ID Section (Copy Enabled) */}
              <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Transaction ID</p>
                <div className="flex justify-between items-center">
                  <code className="text-[11px] font-bold text-neutral truncate max-w-[150px]">
                    {book.transaction_id || "PENDING"}
                  </code>
                  {book.transaction_id && (
                    <button 
                      onClick={() => handleCopy(book.transaction_id)}
                      className="p-2 hover:bg-white rounded-lg transition-colors text-primary"
                      title="Copy ID"
                    >
                      {copiedId === book.transaction_id ? <FaCheck size={12} className="text-green-500" /> : <FaCopy size={12} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 text-neutral">
                  <FaCalendarCheck className="text-primary" />
                  <p className="text-sm font-bold">{book.check_in} — {book.check_out}</p>
                </div>
                <div className="flex items-center gap-4 text-neutral">
                  <FaLocationDot className="text-primary" />
                  <p className="text-xs font-bold uppercase tracking-wider">{book.branch} Branch</p>
                </div>
              </div>

              {/* Amount & Action */}
              <div className="pt-6 border-t border-dashed border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-gray-300 uppercase">Payable</p>
                  <p className="text-3xl font-black text-neutral">৳{book.total_amount}</p>
                </div>

                {book.payment_status !== 'paid' ? (
                  <button
                    onClick={() => handlePayNow(book)}
                    className="bg-primary text-white text-[10px] font-black uppercase px-6 py-3 rounded-2xl hover:bg-neutral transition-all shadow-lg shadow-primary/20"
                  >
                    Pay Now
                  </button>
                ) : (
                  <div className="bg-green-50 p-3 rounded-xl text-green-500">
                    <FaShieldHalved size={20} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-300 font-black uppercase tracking-widest">No stays found yet</p>
          </div>
        )}
      </div>
    </div>
  );
}