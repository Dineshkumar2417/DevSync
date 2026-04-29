import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Layout, Code, User, LogOut, Plus, X, Upload, Menu, Edit3,
  CheckCircle2, BarChart3, Image as ImageIcon, Github, ExternalLink, Loader2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [projectData, setProjectData] = useState({ 
    title: '', description: '', githubUrl: '', liveUrl: '',
    status: 'Completed', category: 'Fullstack'
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const fetchData = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId) return navigate('/login');

    try {
      const [userRes, projectRes] = await Promise.all([
        axios.get(`${API_URL}/auth/user/${userId}`),
        axios.get(`${API_URL}/projects/${userId}`)
      ]);
      
      if (userRes.data) {
        setUserData(userRes.data.user || userRes.data);
      }
      
      const projectList = Array.isArray(projectRes.data) ? projectRes.data : (projectRes.data.projects || []);
      setProjects(projectList);
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setTimeout(() => setIsInitialLoad(false), 800);
    }
  };

  useEffect(() => { fetchData(); }, [location.key]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userId = localStorage.getItem('userId');
    try {
      await axios.post(`${API_URL}/projects/add`, { ...projectData, owner: userId });
      setIsModalOpen(false);
      setProjectData({ title: '', description: '', githubUrl: '', liveUrl: '', status: 'Completed', category: 'Fullstack' });
      fetchData(); 
    } catch (error) { 
        alert("Save failed. Use simple JSON for now."); 
    } finally {
        setIsSubmitting(false);
    }
  };

  const statusData = useMemo(() => {
    const counts = { 'To-Do': 0, 'In Progress': 0, 'Completed': 0 };
    projects.forEach(p => { if(counts[p.status] !== undefined) counts[p.status]++; });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [projects]);

  const categoryData = useMemo(() => {
    const counts = { 'Fullstack': 0, 'Frontend': 0, 'Backend': 0 };
    projects.forEach(p => { if(counts[p.category] !== undefined) counts[p.category]++; });
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [projects]);

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  if (isInitialLoad) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
      <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px]">Syncing...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-300 font-sans relative">
      {/* SIDEBAR RESTORED */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-[#020617]/95 p-6 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 mb-10 text-white font-black italic text-2xl uppercase">
          <Code size={28} className="text-blue-600" /> DevSync
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold"><Layout size={20}/> Overview</button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all"><User size={20}/> Profile</button>
        </nav>
        <button onClick={() => {localStorage.clear(); navigate('/login')}} className="p-4 text-slate-500 hover:text-red-500 flex items-center gap-2 transition-colors"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-10 w-full animate-in fade-in duration-1000">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl text-white"><Menu size={24} /></button>
            <div>
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  HI, {userData?.name ? userData.name.toUpperCase() : "DINESH"}!
              </h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Developer Workspace</p>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-white text-black font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-2xl active:scale-95">
            <Plus size={20}/> New Project
          </button>
        </header>

        {/* CHARTS RESTORED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 h-[350px]">
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-500" /> Project Status</h4>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '15px' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 h-[350px]">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-2"><BarChart3 size={18} className="text-purple-500" /> Tech Stack</h4>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '15px' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PROJECTS GRID RESTORED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? projects.map((p) => (
            <div key={p._id} className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden group flex flex-col shadow-xl relative transition-all hover:scale-[1.02]">
              <div className="h-48 bg-slate-950/40 flex items-center justify-center border-b border-white/5">
                <ImageIcon size={48} className="text-slate-800" />
              </div>
              <div className="p-8 grow flex flex-col">
                <span className="text-[9px] px-2 py-1 bg-blue-500/10 text-blue-500 rounded font-bold uppercase w-fit mb-4">{p.status}</span>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight uppercase italic">{p.title}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{p.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="bg-white/5 text-center py-3 rounded-xl text-[10px] font-bold border border-white/5 hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"><Github size={14}/> Code</a>
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="bg-blue-600 text-white text-center py-3 rounded-xl text-[10px] font-bold shadow-lg hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-2"><ExternalLink size={14}/> Demo</a>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem]">
              <p className="text-slate-600 uppercase font-black italic tracking-widest text-sm">No Projects Linked</p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL RESTORED */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8 text-white">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">New Project</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={32} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input type="text" required placeholder="Project Title" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-blue-500/50" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none h-24 text-sm" value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="url" placeholder="GitHub Link" className="bg-slate-950 border border-white/5 text-white p-4 rounded-2xl text-xs outline-none" value={projectData.githubUrl} onChange={(e) => setProjectData({...projectData, githubUrl: e.target.value})} />
                <input type="url" placeholder="Demo Link" className="bg-slate-950 border border-white/5 text-white p-4 rounded-2xl text-xs outline-none" value={projectData.liveUrl} onChange={(e) => setProjectData({...projectData, liveUrl: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl mt-4 uppercase text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;