import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import { Wallet, Calendar, ShieldCheck, TrendingUp, Crown, Zap, Menu } from 'lucide-react';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';

const UserStat = () => {
  const [stats, setStats] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get('/stats/my-stats')
      .then(res => setStats(res.data.data))
      .catch(err => console.error("Stats fetch error:", err));
  }, [axiosSecure]);

  const GOLD = '#D4AF37';
  const NAVY = '#1E40AF';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-10 bg-[#F9FAFB] min-h-screen font-sans"
    >
      {/* 1. Header Section - Responsive Flex */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-primary/10 pb-6 sm:pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Crown className="text-primary" size={18} />
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-secondary/60">Elite Member Panel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary uppercase tracking-tighter">
            System <span className="text-primary">Intelligence</span>
          </h1>
        </div>
        
        <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-4 bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-primary/20">
            <div className="flex items-center gap-3">
                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500 animate-ping"></div>
                <p className="text-xs sm:text-sm font-black text-secondary tracking-widest uppercase">
                {stats?.doc_status || "Checking..."}
                </p>
            </div>
            <div className="lg:hidden text-primary">
                <Menu size={20} />
            </div>
        </div>
      </div>

      {/* 2. Stat Cards - Responsive Grid (1 col on mobile, 3 on md+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {[
          { label: 'Total Capital Spent', value: `৳${stats?.total_spent || 0}`, icon: <Wallet /> },
          { label: 'Verified Bookings', value: stats?.total_bookings || 0, icon: <Calendar /> },
          { label: 'Identity Trust', value: stats?.doc_status || 'N/A', icon: <ShieldCheck /> }
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className={`group bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-primary/10 shadow-md hover:shadow-xl transition-all ${i === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-lg shrink-0">
                {item.icon}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-secondary tracking-tighter truncate">
                    {item.value}
                </h3>
                <p className="text-[9px] sm:text-[10px] font-bold text-neutral/40 uppercase tracking-[0.1em]">{item.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Central Hub - Responsive Stack (1 col on mobile, 3 cols grid on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Luxury Area Chart Card */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-primary/5">
          <h3 className="text-[10px] sm:text-xs font-black text-secondary uppercase tracking-[0.2em] mb-6 sm:mb-10 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Velocity Analytics
          </h3>

          <div className="h-[250px] sm:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.booking_trend || []}>
                <defs>
                  <linearGradient id="luxuryGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 10}} width={25} />
                <Tooltip contentStyle={{ backgroundColor: NAVY, border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="count" stroke={GOLD} strokeWidth={4} fill="url(#luxuryGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segmented Progress Card */}
        <div className="bg-secondary p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl text-white flex flex-col justify-between overflow-hidden relative min-h-[300px]">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
          
          <div className="space-y-6 relative z-10">
            <h3 className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-[0.2em]">Verification Protocol</h3>
            
            <div className="py-4 sm:py-8 space-y-6">
               <div className="flex gap-1 h-8 sm:h-10">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm ${i < (stats?.doc_status === 'Verified' ? 10 : 5) ? 'bg-primary shadow-[0_0_8px_#D4AF37]' : 'bg-white/10'}`}
                    ></div>
                  ))}
               </div>
               
               <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none">{stats?.doc_status || 'N/A'}</p>
                    <p className="text-[8px] sm:text-[10px] font-bold text-primary uppercase mt-1">Trust Level: High-End</p>
                  </div>
                  <Zap className="text-primary fill-primary animate-pulse hidden sm:block" />
               </div>
            </div>
          </div>

          <div className="space-y-3 relative z-10 mt-4">
             <button className="w-full py-3 sm:py-4 bg-primary text-black font-black uppercase text-[10px] sm:text-xs tracking-widest rounded-xl hover:bg-yellow-500 transition-all">
                Manage Documents
             </button>
             <p className="text-[8px] text-center opacity-40 font-bold uppercase tracking-widest">Secured by Royal Protocol</p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default UserStat;