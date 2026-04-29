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
      const [userRes, projectRes] = await Promise.all([
        axios.get(`${API_URL}/auth/user/${userId}`),
        axios.get(`${API_URL}/projects/${userId}`)
      ]);
      if (userRes.data) setUserData(userRes.data);
      const data = projectRes.data;
      setProjects(Array.isArray(data) ? data : (data.projects || []));
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
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      status: project.status,
      category: project.category
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
        formData.append('ownerId', userId);
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
        alert("Action failed. Check Backend."); 
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

  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Workspace</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-300 font-sans relative">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-[#020617]/95 p-6 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 mb-10 text-white font-black text-2xl italic uppercase">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Code size={24} /></div>
          DevSync
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"><Layout size={20}/> Overview</button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 active:scale-95 transition-all"><User size={20}/> My Profile</button>
        </nav>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 text-slate-500 mt-auto border-t border-white/5 pt-4 transition-colors hover:text-red-500"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-10 w-full animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl text-white"><Menu size={24} /></button>
            <div>
              {/* RESTORED: Dynamic User Name Greeting */}
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  {userData ? `Hi, ${userData.name.split(' ')[0]}!` : "Dashboard"}
              </h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Developer Workspace</p>
            </div>
          </div>
          <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="w-full md:w-auto bg-white text-slate-950 font-black px-8 py-4 rounded-[1.5rem] flex items-center justify-center gap-2 shadow-2xl active:scale-95">
            <Plus size={20}/> New Project
          </button>
        </header>

        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 h-[350px]">
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-500" /> Status</h4>
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
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-2"><BarChart3 size={18} className="text-purple-500" /> Stack Analysis</h4>
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

        {/* PROJECT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? projects.map((project, idx) => (
            <div key={project._id} 
                 style={{ animationDelay: `${idx * 100}ms` }}
                 className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden group flex flex-col shadow-xl relative transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/30 animate-in fade-in zoom-in-95">
              <button onClick={() => handleEditClick(project)} className="absolute top-4 right-4 z-10 p-3 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 active:scale-95"><Edit3 size={16} /></button>
              <div className="h-48 bg-slate-950/40 flex items-center justify-center border-b border-white/5 overflow-hidden">
                {project.thumbnail ? <img src={project.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <ImageIcon size={48} className="text-slate-800" />}
              </div>
              <div className="p-8 grow flex flex-col">
                <div className="flex gap-2 mb-4">
                  <span className="text-[9px] px-2 py-1 bg-amber-500/10 text-amber-500 rounded font-bold uppercase tracking-widest">{project.status}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{project.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="bg-white/5 text-center py-3 rounded-xl text-[11px] font-bold border border-white/5 transition-all hover:bg-white/10 active:scale-95 flex items-center justify-center gap-2"><Github size={14}/> Code</a>
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="bg-blue-600 text-white text-center py-3 rounded-xl text-[11px] font-bold shadow-lg hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-2"><ExternalLink size={14}/> Demo</a>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem]">
              <p className="text-slate-600 uppercase font-black italic tracking-[0.3em] text-sm">No Projects Linked to this Profile</p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[3rem] p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8 text-white">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingId ? "Update Project" : "New Project"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-transform hover:rotate-90"><X size={32} /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {!editingId && (
                <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-white/5 bg-white/5 hover:border-blue-500/50 rounded-[2rem] p-6 transition-all">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setImageFile(e.target.files[0])} />
                  <Upload size={24} className="text-blue-500 mb-2" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase text-center">{imageFile ? imageFile.name : 'Upload Thumbnail'}</p>
                </div>
              )}

              <input type="text" required placeholder="Project Title" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none h-24 text-sm focus:border-blue-500/50 transition-all" value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-slate-950 border border-white/5 text-slate-400 p-4 rounded-2xl text-xs font-bold" value={projectData.status} onChange={(e) => setProjectData({...projectData, status: e.target.value})}>
                    <option value="To-Do">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <select className="bg-slate-950 border border-white/5 text-slate-400 p-4 rounded-2xl text-xs font-bold" value={projectData.category} onChange={(e) => setProjectData({...projectData, category: e.target.value})}>
                    <option value="Fullstack">Fullstack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                </select>
              </div>

              {/* RESTORED: GitHub and Live Demo Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="url" placeholder="GitHub Link" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-xs" value={projectData.githubUrl} onChange={(e) => setProjectData({...projectData, githubUrl: e.target.value})} />
                <input type="url" placeholder="Live Demo Link" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-xs" value={projectData.liveUrl} onChange={(e) => setProjectData({...projectData, liveUrl: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl shadow-xl mt-4 uppercase text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Syncing...</> : (editingId ? "Update Project" : "Create Project")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;