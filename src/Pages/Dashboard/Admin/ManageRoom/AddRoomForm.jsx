import React from 'react';
import { FaDoorOpen, FaBed, FaMoneyBillWave, FaMapMarkerAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../Hooks/UseAxiosSecure';



export default function AddRoomForm({ refreshData }) {
  const axiosSecure= useAxiosSecure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // ডাটা গুছিয়ে নেওয়া (ব্যাকএন্ডের SQL কলামের সাথে মিল রেখে)
    const roomData = {
      roomNo: form.roomNo.value,
      branch: form.branch.value,      
      type: form.type.value,          
      price: parseFloat(form.price.value), 
      totalBeds: parseInt(form.totalBeds.value), 
    };

    try {
      // আপনার এক্সপ্রেস ব্যাকএন্ডের রাউট (Modular Pattern অনুযায়ী)
      const res = await axiosSecure.post('/rooms', roomData);
      
      if(res.data.success) {
          Swal.fire({
            title: "Room Created!",
            text: `Room ${roomData.roomNo} is now live and neutral.`,
            icon: "success",
            confirmButtonColor: "#3b82f6",
            border: "none",
            borderRadius: "20px"
          });
          form.reset();
          refreshData(); // রুমের লিস্ট অটো-আপডেট হবে
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Something went wrong!",
        icon: "error"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-gray-50">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-black text-neutral mb-2 flex items-center justify-center md:justify-start gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl">
              <FaDoorOpen className="text-primary text-2xl"/>
          </div>
          Create New Room
        </h2>
        <p className="text-gray-400 text-sm font-medium ml-1">Room will be gender-locked upon first booking.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Room Number */}
        <div className="form-control w-full">
          <label className="label text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Room Number</label>
          <input 
            name="roomNo" 
            type="text" 
            required 
            className="input input-bordered w-full h-14 rounded-2xl focus:border-primary font-bold transition-all" 
            placeholder="e.g. D-101" 
          />
        </div>

        {/* Branch Selection */}
        <div className="form-control w-full">
          <label className="label text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Select Branch</label>
          <div className="relative">
            <select name="branch" className="select select-bordered w-full h-14 rounded-2xl focus:border-primary font-bold appearance-none">
              <option value="Dhaka">Dhaka Branch</option>
              <option value="Barishal">Barishal Branch</option>
            </select>
            <FaMapMarkerAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
          </div>
        </div>

        {/* Room Type */}
        <div className="form-control w-full">
          <label className="label text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Room Type</label>
          <select name="type" className="select select-bordered w-full h-14 rounded-2xl focus:border-primary font-bold">
            <option value="shared">Shared Capacity</option>
            <option value="private">Private Luxury</option>
          </select>
        </div>

        {/* Price Per Bed */}
        <div className="form-control w-full">
          <label className="label text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Price (Per Bed/Day)</label>
          <div className="relative">
            <input 
              name="price" 
              type="number" 
              step="0.01" 
              required 
              className="input input-bordered w-full h-14 rounded-2xl focus:border-primary font-bold" 
              placeholder="0.00" 
            />
            <FaMoneyBillWave className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
          </div>
        </div>

        {/* Total Beds */}
        <div className="form-control w-full md:col-span-2">
          <label className="label text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total Bed Capacity</label>
          <div className="relative">
            <input 
              name="totalBeds" 
              type="number" 
              min="1" 
              max="20" 
              required 
              className="input input-bordered w-full h-14 rounded-2xl focus:border-primary font-bold" 
              placeholder="Enter number of beds" 
            />
            <FaBed className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
          </div>
        </div>

        {/* Submit Button */}
        <button className="btn btn-primary md:col-span-2 h-16 text-white font-black text-lg rounded-[24px] shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all duration-200 uppercase tracking-widest">
          Publish Room & Generate Beds
        </button>
      </form>
    </div>
  );
}