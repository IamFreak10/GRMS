import React from 'react';
import {
  FaBed,
  FaMale,
  FaFemale,
  FaDoorOpen,
  FaCircle,
  FaUserCheck,
} from 'react-icons/fa';

export default function RoomMap({ floorData }) {
  console.log();
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-base-200">
      {/* Header & Legends */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <h2 className="text-xl font-black text-neutral uppercase tracking-tighter">
          Live Occupancy Map
        </h2>
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase">
            <FaMale /> Male
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-pink-500 uppercase">
            <FaFemale /> Female
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
            <FaCircle className="text-[6px]" /> Empty/Neutral
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {floorData?.map((room) => (
          <div
            key={room.roomNo}
            className={`p-6 rounded-[35px] border-2 transition-all duration-300 hover:shadow-xl group ${
              room.gender === 'male'
                ? 'border-secondary/10 bg-secondary/[0.01]'
                : room.gender === 'female'
                  ? 'border-pink-100 bg-pink-50/20'
                  : 'border-gray-100 bg-gray-50/50'
            }`}
          >
            {/* Room Info */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xl font-black text-neutral uppercase tracking-tighter">
                  Room {room.roomNo}
                </h4>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {room.type}
                </span>
              </div>

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 ${
                  room.gender === 'male'
                    ? 'bg-secondary'
                    : room.gender === 'female'
                      ? 'bg-pink-500'
                      : 'bg-gray-300'
                }`}
              >
                {room.gender === 'male' ? (
                  <FaMale />
                ) : room.gender === 'female' ? (
                  <FaFemale />
                ) : (
                  <FaDoorOpen className="text-xs" />
                )}
              </div>
            </div>

            {/* Beds Grid */}
            {/* Beds Grid */}
            <div className="grid grid-cols-2 gap-3">
              {room.beds.map((bed) => {
                // --- DEBUG LOG START ---
                // ব্রাউজার কনসোলে (F12) গেলেই তুই টেবিল আকারে ডাটা দেখতে পাবি
                if (bed.occupied) {
                  console.log(bed);
                }
                // --- DEBUG LOG END ---

                return (
                  <div
                    key={bed.id}
                    className={`relative h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all group/bed ${
                      bed.occupied
                        ? 'bg-white border-gray-100 shadow-sm'
                        : 'bg-emerald-50/50 border-emerald-100 border-dashed hover:border-emerald-400'
                    } ${bed.occupied && !bed.is_permitted ? 'border-orange-500' : ''}`} // ডিবাগের জন্য: পারমিশন না থাকলে বর্ডার কমলা হবে
                  >
                    <FaBed
                      className={
                        bed.occupied
                          ? 'text-gray-300 scale-110'
                          : 'text-emerald-500 animate-pulse'
                      }
                    />
                    <span
                      className={`text-[9px] font-black mt-1 uppercase ${bed.occupied ? 'text-neutral' : 'text-emerald-600'}`}
                    >
                      {bed.id}
                    </span>

                    {/* মেইন হোভার লজিক */}
                    {bed.occupied && bed.is_permitted === true ? (
                      <div className="absolute inset-0 bg-neutral/95 rounded-2xl opacity-0 group-hover/bed:opacity-100 flex flex-col items-center justify-center transition-opacity p-2 text-center overflow-hidden z-10">
                        <p className="text-secondary text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                          <FaUserCheck /> Verified
                        </p>
                        <p className="text-white text-[11px] font-bold leading-tight mt-1 truncate w-full px-1">
                          {bed.guest}
                        </p>
                      </div>
                    ) : bed.occupied ? (
                      /* যদি পারমিটেড না হয় অথবা ডাটা না থাকে (undefined) তবে এইটা দেখাবে */
                      <div className="absolute inset-0 bg-orange-500/90 rounded-2xl opacity-0 group-hover/bed:opacity-100 flex flex-col items-center justify-center transition-opacity p-2 text-center z-10">
                        <p className="text-white text-[9px] font-black uppercase tracking-tighter italic">
                          {bed.is_permitted === false
                            ? 'Waiting Approval'
                            : 'Missing Permit Data'}
                        </p>
                        {/* ডিবাগের জন্য গেস্টের নাম এখানে ছোট করে দেখাচ্ছি */}
                        <p className="text-[8px] text-white/50">{bed.guest}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="flex gap-1.5">
                {room.beds.map((b, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-1.5 rounded-full transition-colors ${
                      b.occupied
                        ? b.is_permitted
                          ? 'bg-red-400'
                          : 'bg-orange-300'
                        : 'bg-emerald-400'
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {room.beds.filter((b) => !b.occupied).length} Seats Left
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
