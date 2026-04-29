import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  User, Code, MapPin, Mail, Briefcase, GraduationCap, 
  Edit3, Loader2, ArrowLeft, X, Check, Camera
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '', bio: 'MERN Stack Developer' });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Edit Form State
  const [editData, setEditData] = useState({ name: '', bio: '' });

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
  const userId = localStorage.getItem('userId');

  const fetchData = async () => {
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
  };

  useEffect(() => { fetchData(); }, []);

  // UPDATE LOGIC (EDIT BUTTON FIX)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.put(`${API_URL}/auth/user/${userId}`, editData);
      setUserData({ ...userData, ...editData });
      setIsEditModalOpen(false);
      alert("Profile updated in MongoDB!");
    } catch (err) {
      alert("Update failed. Check backend route.");
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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pb-10">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#020617]/80 backdrop-blur-md z-50">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="font-black italic text-xl uppercase text-white tracking-tighter">My Profile</div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 text-center relative overflow-hidden group">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white italic shadow-2xl">
              {userData?.name?.charAt(0) || "D"}
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{userData?.name}</h2>
            <p className="text-blue-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-6">{editData.bio}</p>
            
            <div className="space-y-3 text-sm text-slate-500 mb-8 text-left border-t border-white/5 pt-6">
              <div className="flex items-center gap-3"><Mail size={16} className="text-blue-500" /> {userData?.email}</div>
              <div className="flex items-center gap-3"><MapPin size={16} className="text-blue-500" /> Chandigarh, India</div>
            </div>

            <button onClick={() => setIsEditModalOpen(true)} className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-white/5">
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 flex justify-around">
            <div className="text-center">
              <p className="text-3xl font-black text-white italic">{projects.length}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Projects</p>
            </div>
            <div className="w-[1px] bg-white/5 h-full" />
            <div className="text-center">
              <p className="text-3xl font-black text-white italic">MERN</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Stack</p>
            </div>
          </div>
        </div>

        {/* Skills & Bio */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-[3.5rem] p-8 h-[400px]">
             <h4 className="text-white font-black uppercase italic tracking-widest text-sm mb-8 flex items-center gap-2"><Code size={18} className="text-blue-500" /> Tech Radar</h4>
             <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                <Radar name="Dinesh" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.5} />
              </RadarChart>
             </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8">
              <h4 className="text-white font-black uppercase italic tracking-widest text-sm mb-6 flex items-center gap-2"><GraduationCap size={20} className="text-purple-500" /> Education</h4>
              <div className="space-y-4">
                <div className="border-l-2 border-purple-500/20 pl-4 py-1">
                  <p className="text-white font-bold text-xs uppercase">BA (CS & Economics)</p>
                  <p className="text-slate-500 text-[10px] mt-1 font-bold">Punjabi University Patiala | 2024</p>
                </div>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8">
              <h4 className="text-white font-black uppercase italic tracking-widest text-sm mb-6 flex items-center gap-2"><Briefcase size={20} className="text-emerald-500" /> Training</h4>
              <div className="border-l-2 border-emerald-500/20 pl-4 py-1">
                <p className="text-white font-bold text-xs uppercase">Data Science & ML</p>
                <p className="text-slate-500 text-[10px] mt-1 font-bold">Currently Enrolled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL (FIXED) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Edit Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-white transition-transform hover:rotate-90"><X size={32} /></button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                <input type="text" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-blue-500 transition-all" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Professional Bio</label>
                <input type="text" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-blue-500 transition-all" value={editData.bio} onChange={(e) => setEditData({...editData, bio: e.target.value})} />
              </div>
              <button type="submit" disabled={isUpdating} className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl uppercase text-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50">
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check size={18} /> Update Profile</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;