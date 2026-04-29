import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, Code, User, LogOut, ArrowLeft, Mail, MapPin, 
  Edit3, Check, X, Menu 
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RadarArea } from 'recharts';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '', location: 'Mohali, India' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/user/${userId}`);
        setUserData(res.data);
      } catch (err) { console.error("Error fetching user:", err); }
    };
    if (userId) fetchUser();
  }, [userId, API_URL]);

  const handleUpdateProfile = async () => {
    try {
      // Hits your backend PUT route
      await axios.put(`${API_URL}/auth/user/update/${userId}`, userData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) { 
      console.error(err);
      alert("Update failed. Make sure your backend route /auth/user/update/:id is ready."); 
    }
  };

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

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-[#020617]/95 backdrop-blur-xl p-6 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Code size={24} /></div>
            <span className="text-2xl font-bold tracking-tight uppercase tracking-widest">DevSync</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={24}/></button>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-medium"><Layout size={20}/> Overview</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold"><User size={20}/> My Profile</button>
        </nav>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 mt-auto border-t border-white/5 pt-4 font-bold text-sm transition-colors"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-10 w-full">
        <header className="flex justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-white"><Menu size={24} /></button>
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-white uppercase text-[10px] font-bold tracking-widest"><ArrowLeft size={16} /> Back</button>
          </div>
          <button 
            onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl ${isEditing ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            {isEditing ? <><Check size={16}/> Save Changes</> : <><Edit3 size={16}/> Edit Profile</>}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 text-center relative overflow-hidden">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white italic shadow-2xl">
                {userData?.name?.charAt(0) || "D"}
              </div>
              
              {isEditing ? (
                <div className="space-y-3 relative z-10">
                  <input className="w-full bg-slate-950 border border-white/10 p-3 rounded-xl text-white text-center text-sm outline-none focus:border-blue-500" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} placeholder="Name" />
                  <input className="w-full bg-slate-950 border border-white/10 p-3 rounded-xl text-white text-center text-sm outline-none focus:border-blue-500" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} placeholder="Email" />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{userData?.name || "Developer"}</h2>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">{userData?.email || "No email set"}</p>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-6 md:p-10 h-full">
               <h3 className="text-2xl font-black text-white uppercase italic mb-6">Technical Skillset</h3>
               <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                    <RadarArea name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
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