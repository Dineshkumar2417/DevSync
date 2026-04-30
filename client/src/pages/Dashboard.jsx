import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Layout, Code, User, LogOut, Plus, X, Menu, Trash2, Upload,
  CheckCircle2, BarChart3, Image as ImageIcon, Github, ExternalLink, Loader2, Radar
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [imageFile, setImageFile] = useState(null); // For Thumbnail
  const [projectData, setProjectData] = useState({ 
    title: '', description: '', githubUrl: '', liveUrl: '',
    status: 'Completed', category: 'Fullstack'
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const fetchData = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return navigate('/login');
    try {
      const [userRes, projectRes] = await Promise.all([
        axios.get(`${API_URL}/auth/user/${userId}`),
        axios.get(`${API_URL}/projects/${userId}`)
      ]);
      setUserData(userRes.data.user || userRes.data);
      setProjects(Array.isArray(projectRes.data) ? projectRes.data : []);
    } catch (error) {
      console.error("Sync error");
    } finally {
      setIsInitialLoad(false);
    }
  }, [API_URL, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;
    const deleteToast = toast.loading("Removing...");
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`);
      toast.success("Deleted", { id: deleteToast });
      fetchData();
    } catch (error) {
      toast.error("Failed", { id: deleteToast });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userId = localStorage.getItem('userId');
    const loadToast = toast.loading("Uploading Project...");
    
    try {
      // Using FormData to handle Image + Data
      const formData = new FormData();
      Object.keys(projectData).forEach(key => formData.append(key, projectData[key]));
      formData.append('owner', userId);
      if (imageFile) formData.append('thumbnail', imageFile);

      await axios.post(`${API_URL}/projects/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Project Live!", { id: loadToast });
      setIsModalOpen(false);
      setImageFile(null);
      setProjectData({ title: '', description: '', githubUrl: '', liveUrl: '', status: 'Completed', category: 'Fullstack' });
      fetchData(); 
    } catch (error) { 
        toast.error("Check Backend Multer", { id: loadToast });
    } finally {
        setIsSubmitting(false);
    }
  };

  const statusData = useMemo(() => {
    const counts = { 'To-Do': 0, 'In Progress': 0, 'Completed': 0 };
    projects.forEach(p => { if(counts[p.status] !== undefined) counts[p.status]++; });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [projects]);

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  if (isInitialLoad) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-300 font-sans relative overflow-x-hidden">
      
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-[#020617] p-6 flex flex-col transition-all lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 mb-10 text-white font-black italic text-2xl uppercase">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Code size={24} /></div>
          DevSync
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold"><Layout size={20}/> Overview</button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all"><User size={20}/> Profile</button>
        </nav>
        <button onClick={() => {localStorage.clear(); toast.success("Logout"); navigate('/login')}} className="p-4 text-slate-500 hover:text-red-500 flex items-center gap-2 mt-auto border-t border-white/5 pt-6"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-10 w-full animate-in fade-in duration-700">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                {userData?.name ? `HI, ${userData.name.toUpperCase()}!` : "DASHBOARD"}
            </h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Live Workspace</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-white text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-blue-50 transition-all active:scale-90 shadow-xl">
            <Plus size={20}/> New Project
          </button>
        </header>

        {/* Analytic Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 h-[350px]">
            <h4 className="text-white font-bold mb-6 text-[10px] uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Statistics</h4>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '15px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 h-[350px] flex items-center justify-center italic text-slate-600 text-[10px] uppercase font-bold tracking-widest">
            Performance Engine Ready
          </div>
        </div>

        {/* PROJECTS GRID - CARDS MADE LARGER (md:grid-cols-2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((p) => (
            <div key={p._id} className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden group flex flex-col shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/30 relative">
              
              <button onClick={() => handleDelete(p._id)} className="absolute top-6 right-6 p-2 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10">
                <Trash2 size={18} />
              </button>

              <div className="h-64 bg-slate-950/60 flex items-center justify-center border-b border-white/5">
                {p.thumbnail ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={60} className="text-slate-800" />}
              </div>
              <div className="p-10 grow flex flex-col">
                <span className="text-[10px] px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg font-bold uppercase w-fit mb-4">{p.status}</span>
                <h3 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tighter">{p.title}</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">{p.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="bg-white/5 text-center py-4 rounded-2xl text-[11px] font-black border border-white/5 hover:bg-white/10 transition-all">GITHUB</a>
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="bg-blue-600 text-white text-center py-4 rounded-2xl text-[11px] font-black shadow-lg hover:bg-blue-500 transition-all">LIVE DEMO</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL - WITH THUMBNAIL UPLOAD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">New Project</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={32} className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Thumbnail Input Added */}
              <div className="relative group border-2 border-dashed border-white/5 bg-white/5 hover:border-blue-500/50 rounded-[2rem] p-6 text-center transition-all cursor-pointer">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setImageFile(e.target.files[0])} />
                <Upload size={24} className="text-blue-500 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">{imageFile ? imageFile.name : 'Upload Project Thumbnail'}</p>
              </div>

              <input type="text" required placeholder="Title" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-blue-500/50" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none h-24 text-sm" value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="url" placeholder="GitHub" className="bg-slate-950 border border-white/5 text-white p-4 rounded-2xl text-xs" value={projectData.githubUrl} onChange={(e) => setProjectData({...projectData, githubUrl: e.target.value})} />
                <input type="url" placeholder="Demo" className="bg-slate-950 border border-white/5 text-white p-4 rounded-2xl text-xs" value={projectData.liveUrl} onChange={(e) => setProjectData({...projectData, liveUrl: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl mt-4 uppercase text-xs flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-700">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deploy Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;