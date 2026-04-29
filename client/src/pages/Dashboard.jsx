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
  const [editingId, setEditingId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [imageFile, setImageFile] = useState(null);
  const [projectData, setProjectData] = useState({ 
    title: '', description: '', githubUrl: '', liveUrl: '',
    status: 'To-Do', category: 'Fullstack'
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const fetchData = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) return navigate('/login');

    try {
      const ts = new Date().getTime();
      const [userRes, projectRes] = await Promise.all([
        axios.get(`${API_URL}/auth/user/${userId}?v=${ts}`),
        axios.get(`${API_URL}/projects/${userId}?v=${ts}`)
      ]);

      if (userRes.data) setUserData(userRes.data);
      setProjects(Array.isArray(projectRes.data) ? projectRes.data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setTimeout(() => setIsInitialLoad(false), 800);
    }
  };

  useEffect(() => { fetchData(); }, [location.key]);

  const handleEditClick = (project) => {
    setEditingId(project._id);
    setProjectData({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      status: project.status || 'To-Do',
      category: project.category || 'Fullstack'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userId = localStorage.getItem('userId');
    try {
      if (editingId) {
        await axios.put(`${API_URL}/projects/update/${editingId}`, projectData);
      } else {
        const formData = new FormData();
        Object.keys(projectData).forEach(key => formData.append(key, projectData[key]));
        formData.append('owner', userId); // Backend matches 'owner'
        if (imageFile) formData.append('thumbnail', imageFile);

        await axios.post(`${API_URL}/projects/add`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setImageFile(null);
      setProjectData({ title: '', description: '', githubUrl: '', liveUrl: '', status: 'To-Do', category: 'Fullstack' });
      fetchData(); 
    } catch (error) { 
        alert("Server Sync Failed."); 
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
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
      <p className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[10px]">Syncing...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-300 relative">
      <aside className="w-64 border-r border-white/5 bg-[#020617] p-6 hidden lg:flex flex-col fixed inset-y-0">
        <div className="flex items-center gap-3 mb-10 text-white font-black italic text-2xl uppercase">
          <Code size={28} className="text-blue-600" /> DevSync
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold"><Layout size={20}/> Overview</button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all"><User size={20}/> Profile</button>
        </nav>
        <button onClick={() => {localStorage.clear(); navigate('/login')}} className="p-4 text-slate-500 hover:text-red-500 flex items-center gap-2"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 lg:ml-64 p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                {userData?.name ? `Hi, ${userData.name.split(' ')[0]}!` : "Dashboard"}
            </h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Total Projects: {projects.length}</p>
          </div>
          <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="bg-white text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2 active:scale-95 transition-all">
            <Plus size={20}/> New Project
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? projects.map((p) => (
            <div key={p._id} className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden group flex flex-col relative transition-all hover:scale-[1.02]">
              <button onClick={() => handleEditClick(p)} className="absolute top-4 right-4 z-10 p-3 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"><Edit3 size={16} /></button>
              <div className="h-44 bg-slate-950/40 flex items-center justify-center border-b border-white/5">
                {p.thumbnail ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={40} className="text-slate-800" />}
              </div>
              <div className="p-8 flex flex-col h-full">
                <span className="text-[9px] px-2 py-1 bg-blue-500/10 text-blue-500 rounded font-bold uppercase w-fit mb-3">{p.status}</span>
                <h3 className="text-xl font-bold text-white mb-2 uppercase italic">{p.title}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{p.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="bg-white/5 text-center py-3 rounded-xl text-[10px] font-bold border border-white/5 hover:bg-white/10"><Github size={14} className="inline mr-1"/> Code</a>
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="bg-blue-600 text-white text-center py-3 rounded-xl text-[10px] font-bold shadow-lg hover:bg-blue-500"><ExternalLink size={14} className="inline mr-1"/> Demo</a>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-slate-600 uppercase font-black italic tracking-widest text-sm">No Projects found in Atlas.</p>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8 text-white">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingId ? "Update" : "New"} Project</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={32} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {!editingId && <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-xs text-slate-500" />}
              <input type="text" required placeholder="Title" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl h-24" value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="url" placeholder="GitHub Link" className="bg-slate-950 border border-white/5 text-white p-4 rounded-2xl text-xs" value={projectData.githubUrl} onChange={(e) => setProjectData({...projectData, githubUrl: e.target.value})} />
                <input type="url" placeholder="Live Demo Link" className="bg-slate-950 border border-white/5 text-white p-4 rounded-2xl text-xs" value={projectData.liveUrl} onChange={(e) => setProjectData({...projectData, liveUrl: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase text-xs flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? "Save Changes" : "Create Project")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;