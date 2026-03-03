import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';

// React Icons Imports
import {
  FaCalendarDays,
  FaLocationDot,
  FaCrown,
  FaBed,
  FaDoorOpen,
  FaShieldHalved,
  FaMars,
  FaVenus,
} from 'react-icons/fa6';
import { RiInformationFill } from 'react-icons/ri';
import UseAuth from '../../../Hooks/UseAuth';

const BookRoom = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [branch, setBranch] = useState('Dhaka');
  const axiosSecure = useAxiosSecure();

  const { user } = UseAuth();
  const userGender = user?.gender;

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms', selectedDate, branch],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rooms/availability?date=${selectedDate}&branch=${branch}`
      );
      return res.data.data;
    },
  });

  const handleBooking = (room, bed, type) => {
    navigate(`/dashboard/checkout`, {
      state: {
        room,
        selectedBed: bed,
        bookingType: type,
        checkInDate: selectedDate,
      },
    });
  };

  if (isLoading)
    return (
      <div className="text-center mt-20 font-black">
        Nexus Living is Curating...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-neutral">
      {/* Header Section */}
      <div className="bg-neutral pt-12 pb-28 px-6 rounded-b-[4rem] shadow-2xl relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <div className="flex items-center gap-2 text-primary mb-3">
              <FaShieldHalved size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Premium Secure Booking
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none">
              GR<span className="text-primary italic">MS</span>
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-4 bg-white/10 p-4 rounded-[2.5rem] backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-3xl shadow-2xl">
              <FaCalendarDays className="text-primary" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none focus:ring-0 font-bold text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-3xl shadow-2xl">
              <FaLocationDot className="text-primary" />
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="bg-transparent border-none focus:ring-0 font-bold text-sm outline-none"
              >
                <option value="Dhaka">Dhaka Branch</option>
                <option value="Barishal">Barishal Branch</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Room Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms?.map((room) => {
            // ১. বর্তমান ডেটের জন্য জেন্ডার লক ডাটা বের করা
            const status = room.daily_occupancy?.find(
              (d) => d.booking_date === selectedDate
            );
            const bookedBedIds = status?.booked_bed_ids || [];

            // ডাটাবেস থেকে আসা জেন্ডার লক
            const genderLock = status?.gender_lock;

            // ২. জেন্ডার চেক লজিক
            const isGenderMismatch = genderLock && genderLock !== userGender;
            const isAnyBedBooked = bookedBedIds.length > 0;

            return (
              <div
                key={room.id}
                className={`card bg-white rounded-[3rem] shadow-2xl border-none transition-all duration-500 hover:-translate-y-4 overflow-hidden 
                ${isGenderMismatch ? 'opacity-40 grayscale pointer-events-none' : ''}`}
              >
                {/* Image/Room Header Area */}
                <div className="relative h-60 bg-secondary group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Gender Badge */}
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    <div className="badge badge-primary font-black px-4 py-3 border-none text-[9px] uppercase tracking-widest shadow-lg">
                      {room.type}
                    </div>
                    {genderLock && (
                      <div
                        className={`badge ${genderLock === 'male' ? 'bg-blue-600' : 'bg-pink-600'} text-white border-none font-black px-4 py-3 text-[9px] uppercase shadow-lg flex gap-1 items-center animate-pulse`}
                      >
                        {genderLock === 'male' ? <FaMars /> : <FaVenus />}{' '}
                        {genderLock} ONLY
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-6 left-8">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <FaDoorOpen size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                        Suite Unit
                      </span>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">
                      Room {room.room_no}
                    </h2>
                  </div>
                </div>

                <div className="p-8">
                  {/* Pricing Info */}
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-50">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">
                        Price Per Bed
                      </p>
                      <p className="text-3xl font-black text-secondary">
                        ৳{room.price_per_day}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">
                        Available
                      </p>
                      <p className="text-2xl font-black text-accent">
                        {room.total_beds - bookedBedIds.length}/
                        {room.total_beds}
                      </p>
                    </div>
                  </div>

                  {/* Bed Selection Grid */}
                  <div className="mb-8">
                    <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-neutral/70 mb-4">
                      <FaBed className="text-primary" size={16} /> Select Your
                      Bed
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {room.all_beds.map((bed) => {
                        const isBooked = bookedBedIds.includes(bed.id);
                        return (
                          <button
                            key={bed.id}
                            disabled={isBooked || isGenderMismatch}
                            onClick={() => handleBooking(room, bed, 'bed')}
                            className={`h-12 rounded-2xl border-2 font-black text-[11px] transition-all flex items-center justify-center
                              ${
                                isBooked
                                  ? 'bg-gray-100 border-gray-100 text-gray-300'
                                  : 'bg-white border-primary/20 text-secondary hover:bg-primary hover:text-black shadow-sm active:scale-90'
                              }
                            `}
                          >
                            {isBooked ? 'SOLD' : bed.bed_label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      disabled={isAnyBedBooked || isGenderMismatch}
                      onClick={() => handleBooking(room, null, 'full-room')}
                      className={`group relative btn btn-neutral rounded-3xl h-20 flex flex-col items-center justify-center border-none shadow-xl overflow-hidden
                        ${isAnyBedBooked ? 'opacity-40' : 'hover:scale-[1.02] active:scale-95 transition-all'}
                      `}
                    >
                      <div className="flex items-center gap-3 text-primary text-lg">
                        <FaCrown />
                        <span className="font-black uppercase tracking-[0.2em] text-xs">
                          Book Full Room
                        </span>
                      </div>
                      <span className="text-[9px] font-bold opacity-50 uppercase">
                        10% Off • Premium Privacy
                      </span>
                    </button>

                    {isGenderMismatch && (
                      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-widest mt-2">
                        <FaShieldHalved /> Restricted for {genderLock}s
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
