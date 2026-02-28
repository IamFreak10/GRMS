import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';

// React Icons Imports (Fixed Names)
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

const BookRoom = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [branch, setBranch] = useState('Dhaka');
  const axiosSecure = useAxiosSecure();
  const userGender = 'male';

  const {
    data: rooms,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['rooms', selectedDate, branch],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rooms/availability?date=${selectedDate}&branch=${branch}`
      );
      return res.data.data;
    },
  });

  const handleBooking = (room, bed, type) => {
    // type: 'bed' অথবা 'full-room'
    navigate(`/dashboard/checkout`, {
      state: {
        room,
        selectedBed: bed,
        bookingType: type,
        checkInDate: selectedDate
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-neutral relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse"></div>

        <div className="relative flex flex-col items-center">
          {/* Central Animated Icon Container */}
          <div className="relative w-24 h-24 mb-8">
            {/* Outer Rotating Ring */}
            <div className="absolute inset-0 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>

            {/* Inner Pulsing Gold Icon */}
            <div className="absolute inset-2 bg-gradient-to-br from-primary to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-pulse">
              <FaCrown className="text-black text-2xl" />
            </div>
          </div>

          {/* Elegant Text Animation */}
          <div className="text-center space-y-3">
            <h2 className="text-white text-2xl font-black tracking-[0.2em] uppercase overflow-hidden border-r-2 border-primary pr-2 animate-typing whitespace-nowrap">
              Nexus{' '}
              <span className="text-primary italic font-serif">Living</span>
            </h2>

            <div className="flex items-center justify-center gap-2">
              <div className="h-[1px] w-8 bg-primary/30"></div>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] animate-bounce">
                Curating Excellence
              </p>
              <div className="h-[1px] w-8 bg-primary/30"></div>
            </div>
          </div>

          {/* Progress Line */}
          <div className="mt-10 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress-line"></div>
          </div>
        </div>

        {/* Footer Detail */}
        <p className="absolute bottom-10 text-white/20 text-[9px] font-bold tracking-widest uppercase italic">
          Est. 2026 • Premium Residency
        </p>

        <style jsx>{`
          @keyframes progress-line {
            0% {
              width: 0%;
              transform: translateX(-100%);
            }
            50% {
              width: 100%;
              transform: translateX(0%);
            }
            100% {
              width: 0%;
              transform: translateX(100%);
            }
          }
          .animate-progress-line {
            animation: progress-line 2s infinite ease-in-out;
          }
          @keyframes typing {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }
          .animate-typing {
            animation: typing 2.5s steps(30, end) infinite;
          }
        `}</style>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-neutral">
      {/* Luxury Header */}
      <div className="bg-neutral pt-12 pb-28 px-6 rounded-b-[4rem] shadow-2xl relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-primary mb-3">
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
                className="bg-transparent border-none focus:ring-0 font-bold text-sm cursor-pointer outline-none"
              >
                <option value="Dhaka">Dhaka Branch</option>
                <option value="Barishal">Barishal Barishal</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms?.map((room) => {
            const status = room.daily_occupancy.find(
              (d) => d.booking_date === selectedDate
            );
            const bookedBedIds = status ? status.booked_bed_ids || [] : [];
            const genderLock = status ? status.gender_lock : null;
            const isGenderMismatch = genderLock && genderLock !== userGender;
            const isAnyBedBooked = bookedBedIds.length > 0;

            return (
              <div
                key={room.id}
                className={`card bg-white rounded-[3rem] shadow-2xl border-none transition-all duration-500 hover:-translate-y-4 overflow-hidden ${isGenderMismatch ? 'opacity-40 grayscale' : ''}`}
              >
                <div className="relative h-60 bg-secondary group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    <div className="badge badge-primary font-black px-4 py-3 border-none text-[9px] uppercase tracking-widest shadow-lg">
                      {room.type}
                    </div>
                    {genderLock && (
                      <div
                        className={`badge ${genderLock === 'male' ? 'bg-blue-600' : 'bg-pink-600'} text-white border-none font-black px-4 py-3 text-[9px] uppercase shadow-lg flex gap-1`}
                      >
                        {genderLock === 'male' ? <FaMars /> : <FaVenus />}{' '}
                        {genderLock} Only
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
                      {room.room_no}
                    </h2>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-50">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic text-secondary">
                        Individual Bed
                      </p>
                      <p className="text-3xl font-black text-secondary">
                        ${room.price_per_day}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic text-accent">
                        Available Space
                      </p>
                      <p className="text-2xl font-black text-accent">
                        {room.total_beds - bookedBedIds.length}/
                        {room.total_beds}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-neutral/70">
                        <FaBed className="text-primary" size={16} /> Individual
                        Bed Selection
                      </h4>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {room.all_beds.map((bed) => {
                        const isBooked = bookedBedIds.includes(bed.id);
                        return (
                          <button
                            key={bed.id}
                            disabled={isBooked || isGenderMismatch}
                            onClick={() => handleBooking(room, bed, 'bed')}
                            className={`h-12 rounded-2xl border-2 font-black text-[11px] transition-all flex items-center justify-center
                              ${isBooked
                                ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed'
                                : 'bg-white border-primary/20 text-secondary hover:bg-primary hover:text-black hover:border-primary shadow-sm active:scale-90'
                              }
                            `}
                          >
                            {bed.bed_label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      disabled={isAnyBedBooked || isGenderMismatch}
                      onClick={() => handleBooking(room, null, 'full-room')}
                      className={`group relative btn btn-neutral rounded-3xl h-20 flex flex-col items-center justify-center border-none shadow-xl overflow-hidden
                        ${isAnyBedBooked ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95 transition-all'}
                      `}
                    >
                      <div className="flex items-center gap-3 text-primary text-lg">
                        <FaCrown />
                        <span className="font-black uppercase tracking-[0.2em] text-xs">
                          Book Full Room
                        </span>
                      </div>
                      <span className="text-[9px] font-bold opacity-50 uppercase mt-1">
                        10% Off • Complete Privacy
                      </span>
                    </button>

                    {isAnyBedBooked && (
                      <div className="flex items-center justify-center gap-2 text-[9px] font-black text-error uppercase tracking-tighter italic">
                        <RiInformationFill size={12} /> Partial beds booked -
                        full room lock unavailable
                      </div>
                    )}
                  </div>
                </div>

                {isGenderMismatch && (
                  <div className="bg-red-600 py-3 flex items-center justify-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.3em]">
                    <FaShieldHalved /> Restricted for {genderLock}s
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
