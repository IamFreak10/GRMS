import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { 
    FaShieldHalved, 
    FaCreditCard, 
    FaMobileScreenButton, 
    FaBuildingColumns, 
    FaArrowLeft,
    FaCircleCheck
} from "react-icons/fa6";

const Payment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [loading, setLoading] = useState(false);

    if (!state?.bookingPayload) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-black text-2xl uppercase italic">No Payload Found!</p>
            </div>
        );
    }

    const { bookingPayload } = state;

    const handleSSLPayment = async () => {
        setLoading(true);
        try {
            // ব্যাকএন্ডে বুকিং এবং পেমেন্ট রিকোয়েস্ট পাঠানো
            // const response = await axiosSecure.post('/init-payment', bookingPayload);
            
            // যদি ব্যাকএন্ড থেকে gatewayURL আসে (SSLCommerz Logic)
            // if (response.data.url) {
            //     window.location.replace(response.data.url); // সরাসরি গেটওয়েতে নিয়ে যাবে
            // }

            console.log("🚀 Initializing SSLCommerz with:", bookingPayload);
            alert("Redirecting to SSLCommerz Gateway...");
            
        } catch (error) {
            console.error("Payment Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 lg:p-12 font-sans text-neutral">
            {/* Header */}
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <FaArrowLeft /> Back to Checkout
                </button>
                <div className="flex items-center gap-2 text-green-600">
                    <FaShieldHalved />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Encryption</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
                
                {/* Left Side: Methods */}
                <div className="lg:col-span-3 space-y-8">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Payment <span className="text-primary italic">Method.</span></h2>
                        <p className="text-gray-400 text-sm font-medium">Select your preferred way to pay securely.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Card Option */}
                        <div 
                            onClick={() => setSelectedMethod('card')}
                            className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between ${selectedMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedMethod === 'card' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <FaCreditCard size={20} />
                                </div>
                                <div>
                                    <p className="font-black uppercase text-sm">Debit / Credit Card</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Visa, Mastercard, Amex</p>
                                </div>
                            </div>
                            {selectedMethod === 'card' && <FaCircleCheck className="text-primary" />}
                        </div>

                        {/* Mobile Banking Option */}
                        <div 
                            onClick={() => setSelectedMethod('mfs')}
                            className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between ${selectedMethod === 'mfs' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedMethod === 'mfs' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <FaMobileScreenButton size={20} />
                                </div>
                                <div>
                                    <p className="font-black uppercase text-sm">Mobile Banking</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">bKash, Nagad, Rocket</p>
                                </div>
                            </div>
                            {selectedMethod === 'mfs' && <FaCircleCheck className="text-primary" />}
                        </div>
                    </div>

                    <button 
                        onClick={handleSSLPayment}
                        disabled={loading}
                        className="btn btn-neutral w-full h-20 rounded-[2rem] text-lg font-black shadow-2xl border-none group relative overflow-hidden"
                    >
                        {loading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <span className="relative z-10 flex items-center gap-3">
                                    PAY ${bookingPayload.totalAmount} WITH SSLCOMMERZ
                                </span>
                                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </>
                        )}
                    </button>
                </div>

                {/* Right Side: Order Summary Card */}
                <div className="lg:col-span-2">
                    <div className="bg-neutral text-white rounded-[3rem] p-8 sticky top-10 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8">Order Detail</h4>
                        
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] uppercase font-black opacity-40 mb-1">Room Info</p>
                                <p className="text-xl font-black italic">Room {bookingPayload.roomNo || 'N/A'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] uppercase font-black opacity-40 mb-1">Check In</p>
                                    <p className="text-xs font-bold">{bookingPayload.checkIn}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black opacity-40 mb-1">Check Out</p>
                                    <p className="text-xs font-bold">{bookingPayload.checkOut}</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/10">
                                <p className="text-[10px] uppercase font-black opacity-40 mb-1">Payable Amount</p>
                                <p className="text-4xl font-black text-primary italic">${bookingPayload.totalAmount}</p>
                            </div>
                        </div>

                        <div className="mt-12 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                            <img src="https://itshams.com/wp-content/uploads/2021/07/SSLCommerz-Logo.png" alt="SSL" className="h-6 grayscale opacity-70" />
                            <p className="text-[8px] font-medium leading-tight opacity-50 uppercase">Official payment partner for secure transactions.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Payment;