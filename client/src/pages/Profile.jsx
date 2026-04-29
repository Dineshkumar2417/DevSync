import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, User, Code, Mail, MapPin, Briefcase, ChevronLeft } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`http://localhost:5001/api/auth/user/${userId}`);
        setUserData(userRes.data);
        const projRes = await axios.get(`http://localhost:5001/api/projects/${userId}`);
        setProjects(projRes.data);
      } catch (err) { console.error(err); }
    };
    if (userId) fetchData();
  }, [userId]);

  // SKILLS RADAR LOGIC
  const radarData = useMemo(() => {
    const skills = { Frontend: 0, Backend: 0, Database: 0, Logic: 0, UI_UX: 0 };
    projects.forEach(p => {
      if (p.category === 'Frontend') skills.Frontend += 20;
      if (p.category === 'Backend') skills.Backend += 20;
      if (p.category === 'Fullstack') { skills.Frontend += 10; skills.Backend += 10; }
      skills.Database += 15; // Assuming every project has a DB
      skills.Logic += 10;
    });
    return Object.keys(skills).map(key => ({ subject: key, A: Math.min(skills[key], 100) }));
  }, [projects]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-10">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 font-bold uppercase text-xs tracking-widest"
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-10">
        {/* LEFT COLUMN: BIO CARD */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-5xl font-black shadow-xl">
              {userData?.name?.[0]}
            </div>
            <h1 className="text-3xl font-black text-white mb-2">{userData?.name}</h1>
            <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-6">Fullstack Developer</p>
            
            <div className="space-y-4 text-sm text-slate-400 border-t border-white/5 pt-6 text-left">
              <div className="flex items-center gap-3"><Mail size={16}/> {userData?.email}</div>
              <div className="flex items-center gap-3"><Briefcase size={16}/> MERN Specialist</div>
              <div className="flex items-center gap-3"><MapPin size={16}/> Mohali, India</div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Code size={18}/> Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl"><p className="text-2xl font-black text-white">{projects.length}</p><p className="text-[10px] uppercase font-bold text-slate-500">Projects</p></div>
              <div className="p-4 bg-white/5 rounded-2xl"><p className="text-2xl font-black text-white">0</p><p className="text-[10px] uppercase font-bold text-slate-500">Solved</p></div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RADAR CHART */}
        <div className="col-span-8">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 h-full flex flex-col items-center justify-center min-h-[500px]">
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Skill Radar</h2>
            <p className="text-slate-500 text-sm mb-10">Visualizing your technical growth based on project history</p>
            
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
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
  );
};

export default Profile;