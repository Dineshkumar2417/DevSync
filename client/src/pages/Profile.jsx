import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, Code, User, LogOut, ArrowLeft, Mail, MapPin, 
  Briefcase, ShieldCheck, Menu, X 
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/user/${userId}`);
        setUserData(res.data);
      } catch (err) { console.error(err); }
    };
    if (userId) fetchUser();
  }, [userId]);

  // Sample data for your Skill Radar
  const skillData = [
    { subject: 'Frontend', A: 120, fullMark: 150 },
    { subject: 'Backend', A: 98, fullMark: 150 },
    { subject: 'Database', A: 86, fullMark: 150 },
    { subject: 'Logic', A: 99, fullMark: 150 },
    { subject: 'UX', A: 85, fullMark: 150 },
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-300 font-sans relative">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR - Responsive Logic */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-[#020617]/95 backdrop-blur-xl p-6 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10 text-white px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Code size={24} /></div>
            <span className="text-2xl font-bold tracking-tight uppercase">DevSync</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={24}/></button>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-medium"><Layout size={20}/> Overview</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-900/20"><User size={20}/> My Profile</button>
        </nav>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 mt-auto border-t border-white/5 pt-4 font-bold text-sm transition-colors"><LogOut size={18} /> Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 w-full">
        
        {/* HEADER */}
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-white">
            <Menu size={24} />
          </button>
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </header>

        {/* PROFILE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN: User Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/20 to-transparent"></div>
              <div className="relative">
                <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto mb-6 border-4 border-[#020617] overflow-hidden shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white italic">
                    {userData?.name?.charAt(0)}
                  </div>
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic">{userData?.name || "Developer"}</h2>
                <p className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2 mb-8">Fullstack Developer</p>
                
                <div className="space-y-4 text-left border-t border-white/5 pt-8">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><Mail size={18} /></div>
                    <div><p className="text-[10px] uppercase text-slate-600 font-bold">Email</p><p className="text-white truncate max-w-[180px]">{userData?.email}</p></div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><MapPin size={18} /></div>
                    <div><p className="text-[10px] uppercase text-slate-600 font-bold">Location</p><p className="text-white">Mohali, India</p></div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8">
               <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Quick Stats</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-2xl font-black text-white italic">08</p>
                    <p className="text-[8px] uppercase font-bold text-slate-600 mt-1">Projects</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-2xl font-black text-blue-500 italic">04</p>
                    <p className="text-[8px] uppercase font-bold text-slate-600 mt-1">Deployed</p>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Skill Analysis */}
          <div className="lg:col-span-8">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-6 md:p-10 h-full">
              <div className="mb-10">
                <h3 className="text-3xl font-black text-white uppercase italic">Skill Radar</h3>
                <p className="text-slate-500 text-sm mt-2">Visualizing your technical growth based on project history</p>
              </div>

              <div className="h-[300px] md:h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;