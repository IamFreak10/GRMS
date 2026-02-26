import React from 'react';
import { FaBed, FaMale, FaFemale, FaDoorOpen } from 'react-icons/fa';

export default function RoomMap({ floorData }) {
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-base-200">
      
      {/* Header & Legends */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <h2 className="text-xl font-black text-neutral uppercase tracking-tighter">Live Occupancy Map</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase"><FaMale /> Male Wing</div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-pink-500 uppercase"><FaFemale /> Female Wing</div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {floorData?.map((room) => (
          <div 
            key={room.roomNo} 
            className={`p-6 rounded-[35px] border-2 transition-all duration-300 hover:shadow-xl group ${
              room.gender === 'male' ? 'border-secondary/10 bg-secondary/[0.01]' : 'border-pink-100 bg-pink-50/20'
            }`}
          >
            {/* Room Info */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xl font-black text-neutral">Room {room.roomNo}</h4>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{room.type}</span>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${room.gender === 'male' ? 'bg-secondary' : 'bg-pink-500'}`}>
                {room.gender === 'male' ? <FaMale /> : <FaFemale />}
              </div>
            </div>

            {/* Beds Grid */}
            <div className="grid grid-cols-2 gap-3">
              {room.beds.map((bed) => (
                <div 
                  key={bed.id} 
                  className={`relative h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all group/bed ${
                    bed.occupied 
                    ? "bg-white border-gray-100" 
                    : "bg-emerald-50 border-emerald-100 border-dashed"
                  }`}
                >
                  <FaBed className={bed.occupied ? "text-gray-300" : "text-emerald-500 animate-pulse"} />
                  <span className={`text-[9px] font-bold mt-1 ${bed.occupied ? "text-neutral" : "text-emerald-600"}`}>
                    {bed.id}
                  </span>

                  {/* Tooltip on Occupied */}
                  {bed.occupied && (
                    <div className="absolute inset-0 bg-neutral/95 rounded-2xl opacity-0 group-hover/bed:opacity-100 flex flex-col items-center justify-center transition-opacity p-2 text-center">
                      <p className="text-primary text-[10px] font-black uppercase tracking-tighter">Guest</p>
                      <p className="text-white text-[11px] font-bold truncate w-full">{bed.guest}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="flex gap-1">
                {room.beds.map((b, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${b.occupied ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                ))}
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {room.beds.filter(b => !b.occupied).length} Seats Available
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}