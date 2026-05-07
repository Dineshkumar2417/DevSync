import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  User, Code, MapPin, Mail, Briefcase, GraduationCap, 
  Edit3, Loader2, ArrowLeft, X, Check, Menu, Layout, Sun, Moon, LogOut
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '', bio: 'MERN Stack Developer' });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 🔥 THEME PERSISTENCE LOGIC
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? false : true;
  });

  const [editData, setEditData] = useState({ name: '', bio: '' });

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
  const userId = localStorage.getItem('userId');

  // Theme apply karne wala effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const fetchData = useCallback(async () => {
    if (!userId) return navigate('/login');
    try {
      const [uRes, pRes] = await Promise.all([
        axios.get(`${API_URL}/auth/user/${userId}`),
        axios.get(`${API_URL}/projects/${userId}`)
      ]);
      const user = uRes.data.user || uRes.data;
      setUserData(user);
      setEditData({ name: user.name, bio: user.bio || 'MERN Stack Developer' });
      setProjects(Array.isArray(pRes.data) ? pRes.data : []);
    } catch (err) {
      console.error("Profile Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, navigate, userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const loadToast = toast.loading("Updating Profile...");
    try {
      await axios.put(`${API_URL}/auth/user/${userId}`, editData);
      setUserData({ ...userData, ...editData });
      setIsEditModalOpen(false);
      toast.success("Profile Updated!", { id: loadToast });
    } catch (err) {
      toast.error("Update failed", { id: loadToast });
    } finally {
      setIsUpdating(false);
    }
  };

  const skillData = [
    { subject: 'Frontend', A: 90 },
    { subject: 'Backend', A: 85 },
    { subject: 'Database', A: 80 },
    { subject: 'Python', A: 75 },
    { subject: 'Logic', A: 95 },
  ];

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#020617] flex items-center justify-center transition-colors">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex text-slate-900 dark:text-slate-300 transition-colors relative overflow-x-hidden">
      
      {/* MOBILE HAMBURGER BUTTON */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-blue-600 text-white rounded-2xl shadow-xl active:scale-95 transition-all"
      >
        <Menu size={20} />
      </button>

      {/* SIDEBAR (Synced with Dashboard) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 dark:border-white/5 
        bg-white dark:bg-[#020617] p-8 flex flex-col transition-all duration-300 ease-in-out
        lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 dark:text-white font-black italic text-2xl uppercase">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Code size={24} className="text-white" /></div>
            DevSync
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-3">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all font-bold">
            <Layout size={20}/> Overview
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-blue-600 text-white font-bold transition-all shadow-lg shadow-blue-500/20">
            <User size={20}/> Profile
          </button>
          
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 font-bold">
            {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>

        <button onClick={() => {localStorage.clear(); toast.success("Logout"); navigate('/login')}} className="p-5 text-slate-500 hover:text-red-500 flex items-center gap-3 mt-auto border-t border-slate-200 dark:border-white/5 pt-8 transition-colors font-black uppercase text-[10px] tracking-widest">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12 w-full animate-in fade-in duration-700">
        <header className="mb-12 mt-12 lg:mt-0 flex justify-between items-center">
          <h2 className="text-4xl font-black dark:text-white text-slate-900 uppercase italic tracking-tighter">My Profile</h2>
          <button onClick={() => navigate('/dashboard')} className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all uppercase text-[10px] font-black tracking-widest">
             <ArrowLeft size={16} /> Dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Profile Card */}
          <div className="xl:col-span-1 space-y-8">
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3.5rem] p-10 text-center relative overflow-hidden shadow-sm">
              <div className="w-36 h-36 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[3rem] mx-auto mb-8 flex items-center justify-center text-5xl font-black text-white italic shadow-2xl">
                {userData?.name?.charAt(0) || "D"}
              </div>
              <h2 className="text-3xl font-black dark:text-white text-slate-900 uppercase italic tracking-tighter mb-2">{userData?.name}</h2>
              <p className="text-blue-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-8">{userData.bio || 'MERN Stack Developer'}</p>
              
              <div className="space-y-4 text-sm text-slate-500 mb-10 text-left border-t border-slate-200 dark:border-white/5 pt-8">
                <div className="flex items-center gap-4"><Mail size={18} className="text-blue-500" /> {userData?.email}</div>
                <div className="flex items-center gap-4"><MapPin size={18} className="text-blue-500" /> Chandigarh, India</div>
              </div>

              <button onClick={() => setIsEditModalOpen(true)} className="w-full py-5 bg-blue-600 dark:bg-white text-white dark:text-black font-black rounded-3xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-blue-500/20">
                <Edit3 size={18} /> Edit Profile
              </button>
            </div>

            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 flex justify-around shadow-sm">
              <div className="text-center">
                <p className="text-4xl font-black dark:text-white text-slate-900 italic">{projects.length}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Projects</p>
              </div>
              <div className="w-[1px] bg-slate-200 dark:bg-white/5 h-full" />
              <div className="text-center">
                <p className="text-4xl font-black dark:text-white text-slate-900 italic">MERN</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Stack</p>
              </div>
            </div>
          </div>

          {/* Stats & Charts Area */}
          <div className="xl:col-span-2 space-y-10">
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3.5rem] p-10 h-[450px] shadow-sm relative overflow-hidden">
                <h4 className="dark:text-white text-slate-900 font-black uppercase italic tracking-widest text-xs mb-8 flex items-center gap-3 opacity-60">
                  <Code size={20} className="text-blue-500" /> Tech Radar
                </h4>
                <ResponsiveContainer width="100%" height="85%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid stroke={isDarkMode ? "#1e293b" : "#e2e8f0"} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? '#64748b' : '#475569', fontSize: 12, fontWeight: '900' }} />
                    <Radar name="Dinesh" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 shadow-sm">
                <h4 className="dark:text-white text-slate-900 font-black uppercase italic tracking-widest text-xs mb-8 flex items-center gap-3 opacity-60">
                  <GraduationCap size={22} className="text-purple-500" /> Education
                </h4>
                <div className="border-l-4 border-purple-500/20 pl-6 py-2">
                  <p className="dark:text-white text-slate-900 font-black text-sm uppercase">BA (CS & Economics)</p>
                  <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-wider">Punjabi University Patiala | 2024</p>
                </div>
              </div>
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 shadow-sm">
                <h4 className="dark:text-white text-slate-900 font-black uppercase italic tracking-widest text-xs mb-8 flex items-center gap-3 opacity-60">
                  <Briefcase size={22} className="text-emerald-500" /> Training
                </h4>
                <div className="border-l-4 border-emerald-500/20 pl-6 py-2">
                  <p className="dark:text-white text-slate-900 font-black text-sm uppercase">Data Science & ML</p>
                  <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-wider">MERN Stack Expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-[4rem] p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black dark:text-white text-slate-900 uppercase italic tracking-tighter">Edit Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:rotate-90 transition-transform"><X size={32} /></button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 dark:text-white p-5 rounded-2xl outline-none focus:border-blue-500 font-bold" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Professional Bio</label>
                <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 dark:text-white p-5 rounded-2xl outline-none focus:border-blue-500 font-bold" value={editData.bio} onChange={(e) => setEditData({...editData, bio: e.target.value})} />
              </div>
              <button type="submit" disabled={isUpdating} className="w-full bg-blue-600 dark:bg-white text-white dark:text-black font-black py-6 rounded-[2rem] shadow-2xl uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check size={20} /> Save Changes</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;