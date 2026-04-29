import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, User, Code, MapPin, Mail, Briefcase, GraduationCap, 
  Edit3, Github, Globe, Radar, ChevronRight, Loader2, LogOut, ArrowLeft
} from 'lucide-react';
import { Radar as RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadarComposed, ResponsiveContainer, RechartsRadar = RadarChart } from 'recharts';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return navigate('/login');

      try {
        const [uRes, pRes] = await Promise.all([
          axios.get(`${API_URL}/auth/user/${userId}`),
          axios.get(`${API_URL}/projects/${userId}`)
        ]);
        setUserData(uRes.data.user || uRes.data);
        setProjects(Array.isArray(pRes.data) ? pRes.data : []);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Skill Radar Data
  const skillData = [
    { subject: 'Frontend', A: 90, fullMark: 100 },
    { subject: 'Backend', A: 85, fullMark: 100 },
    { subject: 'Database', A: 80, fullMark: 100 },
    { subject: 'Python', A: 75, fullMark: 100 },
    { subject: 'Logic', A: 95, fullMark: 100 },
    { subject: 'DevOps', A: 60, fullMark: 100 },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
      <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px]">Loading Profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pb-20">
      {/* Header / Nav */}
      <nav className="p-6 flex justify-between items-center border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> <span className="font-bold uppercase text-[10px] tracking-widest">Back to DevSync</span>
        </button>
        <div className="flex items-center gap-3 text-white font-black italic text-xl uppercase">
          <Code size={24} className="text-blue-600" /> Profile
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Identity Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
              <div className="relative">
                <div className="w-32 h-32 bg-slate-800 rounded-[2.5rem] mx-auto mb-6 border-4 border-[#020617] flex items-center justify-center overflow-hidden">
                  <User size={60} className="text-slate-600" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
                  {userData?.name || "Dinesh Kumar"}
                </h2>
                <p className="text-blue-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-6">MERN Stack Developer</p>
                
                <div className="space-y-3 text-sm text-slate-400 mb-8">
                  <div className="flex items-center justify-center gap-2"><MapPin size={16} /> Chandigarh, India</div>
                  <div className="flex items-center justify-center gap-2"><Mail size={16} /> {userData?.email || "dev@dinesh.com"}</div>
                </div>

                <button onClick={() => setIsEditModalOpen(true)} className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-95">
                  <Edit3 size={18} /> Edit Profile
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-3xl">
                <p className="text-3xl font-black text-white italic">{projects.length}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase">Projects</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-3xl">
                <p className="text-3xl font-black text-white italic">10+</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase">Skills</p>
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Bio */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Skill Radar */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[3.5rem] p-8 h-[400px] relative">
               <h4 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <Radar size={20} className="text-blue-500" /> Tech Proficiency
               </h4>
               <ResponsiveContainer width="100%" height="90%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                  <RadarComposed name="Dinesh" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                </RadarChart>
               </ResponsiveContainer>
            </div>

            {/* Experience & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-8">
                <h4 className="text-white font-black uppercase italic tracking-widest text-sm mb-6 flex items-center gap-2">
                  <GraduationCap size={20} className="text-purple-500" /> Education
                </h4>
                <div className="space-y-6">
                  <div className="border-l-2 border-purple-500/30 pl-4">
                    <p className="text-white font-bold uppercase text-xs">Punjabi University Patiala</p>
                    <p className="text-slate-500 text-xs mt-1">BA (CS & Economics) | 2024</p>
                  </div>
                  <div className="border-l-2 border-blue-500/30 pl-4">
                    <p className="text-white font-bold uppercase text-xs">Data Science & ML</p>
                    <p className="text-slate-500 text-xs mt-1">Advanced Course | Currently Enrolled</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-8">
                <h4 className="text-white font-black uppercase italic tracking-widest text-sm mb-6 flex items-center gap-2">
                  <Briefcase size={20} className="text-emerald-500" /> Experience
                </h4>
                <div className="space-y-6">
                  <div className="border-l-2 border-emerald-500/30 pl-4">
                    <p className="text-white font-bold uppercase text-xs">MERN Developer</p>
                    <p className="text-slate-500 text-xs mt-1">Freelance / Personal Projects</p>
                  </div>
                  <div className="border-l-2 border-slate-500/30 pl-4">
                    <p className="text-white font-bold uppercase text-xs">Technical Support</p>
                    <p className="text-slate-500 text-xs mt-1">Interviewing at Teleperformance</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;