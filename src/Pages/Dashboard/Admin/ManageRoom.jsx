import React, { useState } from 'react';
import { FaLayerGroup, FaPlusCircle, FaUserTag, FaMapMarkerAlt } from 'react-icons/fa';
import RoomMap from './ManageRoom/RoomMap';
import AllocationTable from './ManageRoom/AllocationTable';
import AddRoomForm from './ManageRoom/AddRoomForm';
import { useQuery } from '@tanstack/react-query';

export default function ManageRoom() {
  const [activeTab, setActiveTab] = useState('structure');
  const [selectedBranch, setSelectedBranch] = useState('Dhaka');

  // ========================
  // TanStack Query v5 with MOCK DATA
  // ========================
  const { data: rooms = [], isLoading, refetch } = useQuery({
    queryKey: ['rooms', selectedBranch],
    queryFn: async () => {
      // mock data, simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockData = selectedBranch === 'Dhaka' 
            ? [
                { roomNo: 'D-201', type: 'Shared', gender: 'male', beds: [{ id: 'D-201-A', occupied: true, guest: 'Dhaka Guest' }] }
              ]
            : [
                { roomNo: 'B-101', type: 'Private', gender: 'female', beds: [{ id: 'B-101-A', occupied: false, guest: null }] }
              ];
          resolve(mockData);
        }, 500);
      });
    },
    refetchInterval: 5000, 
    refetchOnWindowFocus: true,
  });

  return (
    <div className="space-y-6">
      {/* --- TOP BAR: BRANCH SELECTOR --- */}
      <div className="flex justify-center md:justify-start">
        <div className="inline-flex bg-white p-1.5 rounded-[22px] shadow-sm border border-base-200">
          <button 
            onClick={() => setSelectedBranch('Dhaka')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-wider transition-all ${selectedBranch === 'Dhaka' ? "bg-secondary text-white shadow-lg" : "text-gray-400 hover:text-neutral"}`}
          >
            <FaMapMarkerAlt /> Dhaka GH
          </button>
          <button 
            onClick={() => setSelectedBranch('Barishal')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-wider transition-all ${selectedBranch === 'Barishal' ? "bg-secondary text-white shadow-lg" : "text-gray-400 hover:text-neutral"}`}
          >
            <FaMapMarkerAlt /> Barishal GH
          </button>
        </div>
      </div>

      {/* --- MAIN HEADER & TABS --- */}
      <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-base-200 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-neutral italic">
            {selectedBranch} <span className="text-primary not-italic">Inventory</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            Current Status of {selectedBranch} Branch
          </p>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase transition-all ${activeTab === 'structure' ? "bg-white text-secondary shadow-sm" : "text-gray-500"}`}
          >
            <FaLayerGroup /> Structure
          </button>
          <button 
            onClick={() => setActiveTab('assign')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase transition-all ${activeTab === 'assign' ? "bg-secondary text-white shadow-md" : "text-gray-500"}`}
          >
            <FaUserTag /> Allocation
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase transition-all ${activeTab === 'add' ? "bg-primary text-white shadow-md" : "text-gray-500"}`}
          >
            <FaPlusCircle /> Add Room
          </button>
        </div>
      </div>

      {/* --- DYNAMIC CONTENT --- */}
      <div className="transition-all duration-500">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-gray-400 font-bold mt-4 animate-pulse uppercase text-[10px] tracking-[0.2em]">Syncing {selectedBranch} Data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'structure' && <RoomMap floorData={rooms} />}
            {activeTab === 'assign' && <AllocationTable rooms={rooms} refreshData={refetch} branch={selectedBranch} />}
            {activeTab === 'add' && <AddRoomForm refreshData={refetch} branch={selectedBranch} />}
          </>
        )}
      </div>
    </div>
  );
}