import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { motion } from 'framer-motion';
import { FaWallet, FaHourglassHalf, FaUsers, FaHome, FaChartLine, FaArrowUp } from 'react-icons/fa';

const AdminStats = () => {
  const axiosSecure = useAxiosSecure();
  // ১. ফিল্টার স্টেট (Default: all)
  const [range, setRange] = useState('all');

  // ২. ডাটা ফেচিং (Query Key-তে range দিলে ফিল্টার চেঞ্জ হলেই অটো রি-ফেচ হবে)
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-overall-stats', range], 
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin-stats?range=${range}`);
      return res.data.data;
    }
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Intelligence...</p>
      </div>
    </div>
  );

  // Chart Data: রেসপন্স অনুযায়ী ডাইনামিক ডাটা
  const revenueData = [
    { name: 'Today', amount: parseFloat(stats.revenue.today_earning) },
    { name: 'Week', amount: parseFloat(stats.revenue.this_week_earning) },
    { name: 'Month', amount: parseFloat(stats.revenue.this_month_earning) },
    { name: 'Total', amount: parseFloat(stats.revenue.total_earning) },
  ];

  const branchData = stats.inventory.byBranch.map(item => ({
    name: item.branch,
    value: parseInt(item.branch_room_count)
  }));

  const COLORS = ['#6366f1', '#f43f5e', '#22c55e', '#eab308'];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen font-sans">
      {/* Header with Live Status */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-neutral uppercase leading-none">
            Business <span className="text-primary italic">Intelligence</span>
          </h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
            Monitoring Performance: <span className="text-neutral">{range.replace('-', ' ')}</span>
          </p>
        </div>
        
        {/* Real Time Filter Select Box */}
        <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-[9px] font-black uppercase text-gray-400">Live Data Feed</span>
            </div>
            <select 
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-neutral text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest outline-none border-none cursor-pointer hover:bg-primary transition-all shadow-lg"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
        </div>
      </div>

      {/* Top 4 Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Revenue', value: stats.revenue.total_earning, icon: <FaWallet />, color: 'bg-indigo-600', trend: 'Actual' },
          { label: 'Upcoming Potential', value: stats.upcoming.upcoming_potential_earning, icon: <FaHourglassHalf />, color: 'bg-rose-500', trend: 'Projected' },
          { label: 'Active Guests', value: stats.users.active_users, icon: <FaUsers />, color: 'bg-emerald-500', trend: 'Live' },
          { label: 'Total Rooms', value: stats.inventory.total_rooms, icon: <FaHome />, color: 'bg-amber-500', trend: 'Inventory' }
        ].map((item, i) => (
          <motion.div 
            custom={i} initial="hidden" animate="visible" variants={cardVariants}
            key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 relative overflow-hidden group"
          >
            <div className={`absolute -right-4 -top-4 w-20 h-20 ${item.color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-4 rounded-2xl ${item.color} text-white shadow-lg`}>{item.icon}</div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.trend}</span>
            </div>
            <div className="mt-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</h3>
              <p className="text-3xl font-black text-neutral mt-1">
                {typeof item.value === 'string' && !isNaN(item.value) ? `৳${parseFloat(item.value).toLocaleString()}` : item.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-100 border border-gray-50"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <FaChartLine className="text-primary"/> Revenue Distribution
            </h3>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Dynamic Visualization</span>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#9ca3af', textTransform: 'uppercase'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                  formatter={(value) => [`৳${value}`, 'Amount']}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Branch Distribution Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-100 border border-gray-50 flex flex-col items-center justify-center"
        >
          <h3 className="text-xl font-black uppercase tracking-tighter mb-8 w-full text-left">Branch Inventory</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={branchData}
                  cx="50%" cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {branchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontWeight: '800', textTransform: 'uppercase', fontSize: '9px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* Analytical Footer Alert */}
      <div className="mt-8 bg-neutral text-white p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-gray-300">
          <div className="flex items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <FaArrowUp className="text-primary text-2xl animate-bounce"/>
              </div>
              <div>
                  <h4 className="font-black text-xl uppercase tracking-tight">Growth Opportunity</h4>
                  <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">
                    {stats.upcoming.upcoming_guest_count} Pending approval. Potential cashflow: 
                    <span className="text-primary ml-1">৳{parseFloat(stats.upcoming.upcoming_potential_earning).toLocaleString()}</span>
                  </p>
              </div>
          </div>
          <button className="w-full md:w-auto bg-primary hover:bg-white hover:text-primary transition-all text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em]">
              Review & Approve
          </button>
      </div>
    </div>
  );
};

export default AdminStats;