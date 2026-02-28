import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
    FaArrowLeft,
    FaCalendarDays,
    FaCrown,
    FaBed,
    FaCreditCard,
    FaCircleCheck,
    FaLocationDot
} from "react-icons/fa6";
import { RiInformationFill } from "react-icons/ri";
import UseAuth from '../../../Hooks/UseAuth';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const {user}=UseAuth();


    // চেক-আউট ডেট স্টেট (ডিফল্ট চেক-ইন এর পরের দিন)
    const [checkOutDate, setCheckOutDate] = useState('');

    if (!state) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10">
                <RiInformationFill size={60} className="text-primary mb-4" />
                <h2 className="text-2xl font-black text-neutral">Selection Not Found</h2>
                <button onClick={() => navigate('/dashboard/book-room')} className="btn btn-primary mt-6 rounded-2xl">Return to Booking</button>
            </div>
        );
    }

    const { room, selectedBed, bookingType, checkInDate } = state;

    // দিন ক্যালকুলেশন লজিক
    const calculateDays = () => {
        if (!checkInDate || !checkOutDate) return 1;
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    };

    const totalDays = calculateDays();
    const unitPrice = room.price_per_day;
    const basePrice = bookingType === 'full-room' ? unitPrice * room.total_beds : unitPrice;
    const totalPrice = basePrice * totalDays;

const handleConfirmBooking = () => {
    // ১. ভ্যালিডেশন: চেকআউট ডেট না থাকলে আটকানো
    if (!checkOutDate) {
        alert("Please select a check-out date!");
        return;
    }

    const bookingPayload = {
        userId:user?.id,
        roomId: room.id,
        userName:user?.name,
        userEmail:user?.email,
        bedId: selectedBed ? selectedBed.id : null, 
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalAmount: totalPrice,
        bookingType: bookingType, 
        status: 'pending' 
    };

    console.log("🚀 Prepared for Payment Page:", bookingPayload);

    // ২. পেমেন্ট পেজে ডাটা নিয়ে যাওয়া
    navigate('/dashboard/payment', { state: { bookingPayload } });
};

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-sans text-neutral">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all mb-8"
            >
                <FaArrowLeft /> Change Selection
            </button>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
                        <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase">
                            Confirm <span className="text-primary italic">Stay.</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Room Info */}
                            <div className="bg-neutral p-8 rounded-[2rem] text-white relative overflow-hidden">
                                <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">Reserved Space</p>
                                <h3 className="text-4xl font-black mb-1 italic">Room {room.room_no}</h3>
                                <div className="flex items-center gap-2 text-xs opacity-60 font-bold mt-2">
                                    <FaLocationDot size={10} /> {room.branch} Branch
                                </div>
                                <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        {bookingType === 'full-room' ? <FaCrown className="text-primary" /> : <FaBed className="text-primary" />}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase opacity-50">Type</p>
                                        <p className="text-sm font-bold uppercase">{bookingType === 'full-room' ? 'Full Private Room' : `Bed - ${selectedBed?.bed_label}`}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Date Picker Section */}
                            <div className="space-y-4">
                                <div className="bg-white border-2 border-gray-100 rounded-[1.5rem] p-4 flex items-center gap-4">
                                    <FaCalendarDays className="text-primary" />
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-gray-400">Check-in (Fixed)</p>
                                        <p className="font-bold">{checkInDate}</p>
                                    </div>
                                </div>

                                <div className="bg-white border-2 border-primary/20 rounded-[1.5rem] p-4 flex items-center gap-4 shadow-sm">
                                    <FaCalendarDays className="text-secondary" />
                                    <div className="w-full">
                                        <p className="text-[9px] font-black uppercase text-secondary">Select Check-out</p>
                                        <input
                                            type="date"
                                            min={checkInDate}
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                            className="w-full bg-transparent font-bold outline-none border-none p-0 focus:ring-0 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-3xl text-blue-900 border border-blue-100">
                        <RiInformationFill size={24} className="shrink-0" />
                        <p className="text-xs font-medium leading-relaxed">
                            Total Duration: <span className="font-black text-blue-600">{totalDays} Day(s)</span>.
                            Please double-check your check-out date before confirming.
                        </p>
                    </div>
                </div>

                {/* Right Column: Billing */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-gray-100 sticky top-28">
                        <h4 className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Bill Summary</h4>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-400 uppercase">Rate/Day</span>
                                <span className="font-black">${basePrice}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-400 uppercase italic">Duration</span>
                                <span className="font-black">x {totalDays} Day(s)</span>
                            </div>

                            <div className="h-[1px] bg-gray-100 w-full my-4"></div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Total Payable</p>
                                    <p className="text-5xl font-black text-neutral tracking-tighter">${totalPrice}</p>
                                </div>
                                <p className="text-[10px] font-black text-gray-300">USD</p>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmBooking}
                            disabled={!checkOutDate}
                            className={`btn btn-neutral w-full h-20 rounded-[2rem] text-lg font-black shadow-xl border-none flex items-center gap-3 ${!checkOutDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FaCreditCard className="text-primary" />
                            <span>CONFIRM BOOKING</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;