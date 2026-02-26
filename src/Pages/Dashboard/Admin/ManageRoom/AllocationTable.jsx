import React, { useState } from 'react';
import { FaMale, FaFemale } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../../../Hooks/UseAxios';

export default function AllocationTable({ branch }) {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const [selectedAssignments, setSelectedAssignments] = useState({}); // { userId: { roomNo, bedId } }

  // ---------------------------
  // Fetch pending bookings for branch
  // ---------------------------
  const { data: pendingUsers = [], isLoading } = useQuery({
    queryKey: ['pendingUsers', branch],
    queryFn: async () => {
      // Mock API delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              _id: 'b1',
              name: 'Rakib Hasan',
              gender: 'male',
              room_id: 'D-201',
              bed_id: 'D-201-A',
              booking_id: 'bk1',
              payment_status: 'Paid',
            },
            {
              _id: 'b2',
              name: 'Sadia Afrin',
              gender: 'female',
              room_id: 'B-101',
              bed_id: 'B-101-A',
              booking_id: 'bk2',
              payment_status: 'Pending',
            },
          ]);
        }, 500);
      });
    },
    refetchInterval: 5000, // auto refresh for real-time feel
  });

  // ---------------------------
  // Mutation to assign room
  // ---------------------------
  const assignMutation = useMutation({
    mutationFn: async ({ userId, roomNo, bedId }) => {
      // Mock API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 300);
      });
    },
    onSuccess: () => {
      Swal.fire('Success', 'Room Assigned Successfully!', 'success');
      queryClient.invalidateQueries(['pendingUsers', branch]); // refetch data
    },
  });

  const handleAssign = (userId) => {
    const { roomNo, bedId } = selectedAssignments[userId] || {};
    if (!roomNo || !bedId) {
      Swal.fire('Error', 'Please select Room and Bed!', 'error');
      return;
    }
    assignMutation.mutate({ userId, roomNo, bedId });
  };

  if (isLoading) {
    return <p className="text-gray-400 font-bold py-8 text-center">Loading pending bookings...</p>;
  }

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-base-200 overflow-hidden">
      <div className="overflow-x-auto p-6">
        <table className="table w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-black">
              <th>Guest</th>
              <th>Gender</th>
              <th>Payment</th>
              <th>Allocation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user._id} className="bg-gray-50/50">
                <td className="rounded-l-3xl">
                  <p className="font-black text-neutral">{user.name}</p>
                  <p className="text-[10px] text-success font-bold uppercase tracking-tighter">
                    Booking: {user.booking_id}
                  </p>
                </td>
                <td>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-black uppercase ${
                      user.gender === 'male' ? 'text-secondary' : 'text-pink-500'
                    }`}
                  >
                    {user.gender === 'male' ? <FaMale /> : <FaFemale />} {user.gender}
                  </span>
                </td>
                <td>
                  <span
                    className={`px-2 py-1 text-[10px] font-bold rounded-xl uppercase ${
                      user.payment_status === 'Paid'
                        ? 'bg-green-200 text-green-800'
                        : user.payment_status === 'Pending'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {user.payment_status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <select
                      className="select select-sm rounded-xl border-gray-200 focus:border-primary font-bold text-xs"
                      value={selectedAssignments[user._id]?.roomNo || ''}
                      onChange={(e) =>
                        setSelectedAssignments((prev) => ({
                          ...prev,
                          [user._id]: { ...prev[user._id], roomNo: e.target.value, bedId: user.bed_id },
                        }))
                      }
                    >
                      <option disabled selected>
                        {user.room_id} (Room)
                      </option>
                      <option value={user.room_id}>{user.room_id}</option>
                    </select>
                    <input
                      type="text"
                      value={selectedAssignments[user._id]?.bedId || user.bed_id}
                      className="input input-sm w-16 rounded-xl border-gray-200 focus:border-primary font-bold text-xs"
                      onChange={(e) =>
                        setSelectedAssignments((prev) => ({
                          ...prev,
                          [user._id]: { ...prev[user._id], bedId: e.target.value },
                        }))
                      }
                    />
                  </div>
                </td>
                <td className="rounded-r-3xl">
                  <button
                    onClick={() => handleAssign(user._id)}
                    className="btn btn-sm btn-secondary rounded-xl text-[10px] font-black uppercase"
                  >
                    Confirm
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}