import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, Code, User, LogOut, ArrowLeft, Mail, MapPin, 
  Edit3, Check, X, Menu, Loader2, Briefcase, Github, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RadarArea } from 'recharts';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [userProjects, setUserProjects] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
  const userId = localStorage.getItem('userId');

  const fetchProfileData = async () => {
    if (!userId) return navigate('/login');
    try {
      const [userRes, projectRes] = await Promise.all([
        axios.get(`${API_URL}/auth/user/${userId}`),
        axios.get(`${API_URL}/projects/${userId}`)
      ]);
      
      setUserData(userRes.data);
      setUserProjects(projectRes.data);
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`${API_URL}/auth/user/${userId}`, { name: userData.name });
      setIsEditing(false);
      fetchProfileData();
    } catch (err) {
      alert("Update failed.");
    }
  };

  const skillData = [
    { subject: 'Frontend', A: 120 },
    { subject: 'Backend', A: 98 },
    { subject: 'Database', A: 86 },
    { subject: 'Logic', A: 99 },
    { subject: 'UX', A: 85 },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[10px]">Loading Profile</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-300 font-sans relative">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-[#020617]/95 backdrop-blur-xl p-6 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 mb-10 text-white italic font-black text-2xl uppercase">
          <Code size={28} className="text-blue-600" /> DevSync
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-all"><Layout size={20}/> Overview</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20"><User size={20}/> My Profile</button>
        </nav>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 text-slate-500 mt-auto border-t border-white/5 pt-4 transition-colors hover:text-red-500"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <header className="flex justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl text-white active:scale-90 transition-transform"><Menu size={24} /></button>
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-white uppercase text-[10px] font-bold tracking-widest transition-colors"><ArrowLeft size={16} /> Back</button>
          </div>
          <button 
            onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl ${isEditing ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            {isEditing ? <><Check size={16}/> Save</> : <><Edit3 size={16}/> Edit Profile</>}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* USER CARD */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 text-center relative overflow-hidden group">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white italic shadow-2xl transition-transform group-hover:scale-105 duration-500">
                {userData?.name?.charAt(0) || "D"}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <input className="w-full bg-slate-950 border border-white/10 p-4 rounded-2xl text-white text-center text-sm outline-none focus:border-blue-500 transition-all" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} placeholder="Edit Name" />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{userData?.name}</h2>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2 italic">Professional Developer</p>
                  <div className="mt-6 flex flex-col gap-3 text-left border-t border-white/5 pt-6">
                    <div className="flex items-center gap-3 text-xs text-slate-400"><Mail size={14} className="text-blue-500"/> {userData?.email}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-400"><MapPin size={14} className="text-blue-500"/> Mohali, India</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SKILLS RADAR */}
          <div className="lg:col-span-8">
            <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-6 md:p-10 h-full transition-all hover:bg-white/[0.05]">
               <h3 className="text-2xl font-black text-white uppercase italic mb-8 flex items-center gap-3"><Code className="text-blue-500" /> Technical Radar</h3>
               <div className="h-[350px] md:h-[400px]">
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

        {/* PROJECT SECTION - NEW RENDERING CARDS */}
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <Briefcase className="text-blue-500" /> My Workspace ({userProjects.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userProjects.length > 0 ? userProjects.map((project, idx) => (
              <div key={project._id} 
                   style={{ animationDelay: `${idx * 100}ms` }}
                   className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden group flex flex-col shadow-xl relative transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/30 animate-in fade-in zoom-in-95">
                <div className="h-44 bg-slate-950/40 flex items-center justify-center border-b border-white/5 overflow-hidden">
                  {project.thumbnail ? <img src={project.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <ImageIcon size={40} className="text-slate-800" />}
                </div>
                <div className="p-8 grow flex flex-col">
                  <div className="flex gap-2 mb-4">
                    <span className="text-[9px] px-2 py-1 bg-amber-500/10 text-amber-500 rounded font-bold uppercase tracking-widest">{project.status}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors">{project.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{project.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="bg-white/5 text-center py-3 rounded-xl text-[10px] font-bold border border-white/5 transition-all hover:bg-white/10 active:scale-95 flex items-center justify-center gap-2"><Github size={14}/> Code</a>
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="bg-blue-600 text-white text-center py-3 rounded-xl text-[10px] font-bold shadow-lg hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-2"><ExternalLink size={14}/> Demo</a>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                <p className="text-slate-600 uppercase font-black italic tracking-widest text-sm">No active projects to display</p>
                <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-500 font-bold uppercase text-[10px] hover:underline">Go to Dashboard to add some</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;