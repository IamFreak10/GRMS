import React from 'react';
import {
  FaMale,
  FaFemale,
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../../Hooks/UseAxiosSecure';

export default function AllocationTable({ branch }) {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ডাটা ফেচিং
  const { data: allBookings = [], isLoading } = useQuery({
    queryKey: ['allBookings', branch],
    queryFn: async () => {
      const res = await axiosSecure.get(`/booking/pending?branch=${branch}`);
      console.log('API Data:', res.data.data); // ডিবাগিং এর জন্য
      return res.data.data;
    },
  });

  // এলাউ বাটন মিউটেশন
  const allowMutation = useMutation({
    mutationFn: async (bookingId) => {
      return await axiosSecure.patch('/booking/allow-guest', { bookingId });
    },
    onSuccess: () => {
      Swal.fire('Success', 'Guest allowed and visible on map!', 'success');
      queryClient.invalidateQueries(['allBookings']);
    },
  });

  // ডকুমেন্ট দেখার ফাংশন (Image/PDF/Drive সাপোর্ট)
  const viewDoc = (url, name) => {
    if (!url)
      return Swal.fire('No Document', 'User has not uploaded any ID.', 'info');

    let finalUrl = url;
    // গুগল ড্রাইভ লিঙ্ক হলে ওটাকে প্রিভিউ মোডে নেওয়া
    if (url.includes('drive.google.com')) {
      const fileId =
        url.match(/\/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
      if (fileId) {
        finalUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    Swal.fire({
      title: `<span style="font-size: 16px;">${name}'s Verification Document</span>`,
      html: `
        <div style="width: 100%; height: 500px; border-radius: 10px; overflow: hidden;">
          <iframe src="${finalUrl}" width="100%" height="100%" style="border: none;"></iframe>
        </div>
        <p style="font-size: 10px; color: gray; margin-top: 10px;">Make sure the Drive file is set to "Anyone with the link".</p>
      `,
      width: 800,
      showCloseButton: true,
      confirmButtonColor: '#D4AF37',
      confirmButtonText: 'CLOSE',
    });
  };

  if (isLoading)
    return (
      <div className="p-10 text-center font-black animate-pulse uppercase">
        Syncing with server...
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-[35px] border border-base-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="table w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-[10px] uppercase tracking-widest border-none text-center">
              <th className="text-left pl-8">Guest & Verification</th>
              <th>Payment Status</th>
              <th>Allocation</th>
              <th className="text-right pr-8 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {allBookings.map((item) => (
              <tr
                key={item.booking_id}
                className="bg-gray-50/50 hover:bg-white transition-all group"
              >
                {/* ১. গেস্ট ইনফো ও ডকুমেন্ট */}
                <td className="rounded-l-[25px] border-none p-4 pl-8">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => viewDoc(item.document_url, item.name)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 border-dashed ${item.document_url ? 'bg-secondary/10 border-secondary/50 text-secondary' : 'bg-gray-100 border-gray-300 text-gray-300'}`}
                    >
                      <FaFileAlt size={18} />
                    </button>
                    <div>
                      <p className="font-black text-neutral text-sm leading-none mb-1">
                        {item.name}
                      </p>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                        Room: {item.room_no}
                      </span>
                    </div>
                  </div>
                </td>

                {/* ২. পেমেন্ট স্ট্যাটাস */}
                <td className="border-none text-center">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${item.payment_status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}
                  >
                    {item.payment_status}
                  </span>
                </td>

                {/* ৩. পারমিশন স্ট্যাটাস */}
                <td className="border-none text-center">
                  {item.is_permitted ? (
                    <span className="flex items-center justify-center gap-1 text-green-600 text-[10px] font-black uppercase">
                      <FaCheckCircle /> Allowed
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1 text-orange-500 text-[10px] font-black uppercase">
                      <FaHourglassHalf className="animate-spin-slow" /> Pending
                      Admin
                    </span>
                  )}
                </td>

                {/* ৪. অ্যাকশন বাটন */}
                <td className="rounded-r-[25px] border-none text-right pr-8">
                  {!item.is_permitted && item.payment_status === 'paid' ? (
                    <button
                      onClick={() => allowMutation.mutate(item.booking_id)}
                      disabled={allowMutation.isLoading}
                      className="btn btn-sm btn-secondary rounded-xl text-[10px] font-black uppercase px-6 hover:scale-105 transition-transform"
                    >
                      {allowMutation.isLoading ? 'Allowing...' : 'Permit Now'}
                    </button>
                  ) : (
                    <span className="text-[10px] font-black text-gray-300 uppercase italic">
                      {item.is_permitted ? 'Success ✅' : 'Waiting for Paid'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
