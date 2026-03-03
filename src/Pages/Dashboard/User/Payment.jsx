import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  FaArrowLeft,
  FaCreditCard,
  FaLock,
  FaShieldHalved,
} from 'react-icons/fa6';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Swal from 'sweetalert2';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const bookingPayload = state?.bookingPayload;

  if (!bookingPayload) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10">
        <h2 className="text-2xl font-black italic">No Payment Data Found!</h2>
        <button
          onClick={() => navigate('/dashboard/book-room')}
          className="btn btn-primary mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleSSLPayment = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.post(
        '/booking/create-ssl-payment',
        bookingPayload
      );
      if (response.data?.success && response.data?.paymentUrl) {
        window.location.replace(response.data.paymentUrl);
      } else {
        Swal.fire('Error', 'Payment initiation failed!', 'error');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      Swal.fire(
        'Error',
        error?.response?.data?.message || 'Something went wrong',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-sans text-neutral">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 hover:text-primary transition-all"
      >
        <FaArrowLeft /> Back to Checkout
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100">
          <header className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              {/* এখানে FaShieldHalved ব্যবহার করা হয়েছে */}
              <FaShieldHalved size={30} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">
              Secure <span className="text-primary italic">Payment.</span>
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
              SSLCommerz Encrypted Gateway
            </p>
          </header>

          {/* Summary Card */}
          <div className="bg-neutral p-8 rounded-[2.5rem] text-white mb-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
              <span className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em]">
                Transaction For
              </span>
              <span className="font-bold italic text-primary underline">
                Room {bookingPayload.roomId}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black uppercase opacity-50">
                  Amount to Pay
                </p>
                <p className="text-5xl font-black tracking-tighter">
                  ${bookingPayload.totalAmount}
                </p>
              </div>
              <p className="text-xs font-black opacity-30 italic tracking-widest">
                USD
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex items-center gap-4">
              <FaLock className="text-gray-400 shrink-0" />
              <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed">
                By clicking 'Pay Now', you will be redirected to the secure
                SSLCommerz portal to complete your transaction.
              </p>
            </div>

            <button
              onClick={handleSSLPayment}
              disabled={loading}
              className={`btn btn-neutral w-full h-20 rounded-[2rem] text-lg font-black shadow-xl border-none gap-3 flex items-center justify-center ${loading ? 'opacity-70 animate-pulse' : ''}`}
            >
              {loading ? (
                'PROCESSING...'
              ) : (
                <>
                  <FaCreditCard className="text-primary" />
                  <span>PAY NOW WITH SSLCOMMERZ</span>
                </>
              )}
            </button>
          </div>

          <footer className="mt-8 text-center">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">
              Protected by SSL Security Layer
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Payment;
