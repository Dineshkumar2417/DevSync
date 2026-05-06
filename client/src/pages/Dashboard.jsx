import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Layout, Code, User, LogOut, Plus, X, Trash2, Edit3, Sun, Moon,
  CheckCircle2, Image as ImageIcon, Github, ExternalLink, Loader2, Radar, Upload
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit Mode States
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [projectData, setProjectData] = useState({ 
    title: '', description: '', githubUrl: '', liveUrl: '',
    status: 'Completed', category: 'Fullstack'
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  // Theme Toggle Logic
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  // EDIT HANDLER: Modal khulega purane data ke saath
  const handleEditClick = (project) => {
    setEditingProjectId(project._id);
    setProjectData({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      status: project.status,
      category: project.category || 'Fullstack'
    });
    setIsModalOpen(true);
  };

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
    const loadToast = toast.loading(editingProjectId ? "Updating..." : "Deploying...");
    
    try {
      const formData = new FormData();
      Object.keys(projectData).forEach(key => formData.append(key, projectData[key]));
      formData.append('owner', userId);
      if (imageFile) formData.append('thumbnail', imageFile);

      if (editingProjectId) {
        await axios.put(`${API_URL}/projects/${editingProjectId}`, formData);
        toast.success("Project Updated!", { id: loadToast });
      } else {
        await axios.post(`${API_URL}/projects/add`, formData);
        toast.success("Project Live!", { id: loadToast });
      }

      setIsModalOpen(false);
      setEditingProjectId(null);
      setImageFile(null);
      setProjectData({ title: '', description: '', githubUrl: '', liveUrl: '', status: 'Completed', category: 'Fullstack' });
      fetchData(); 
    } catch (error) { 
        toast.error("Operation Failed", { id: loadToast });
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
    <div className="min-h-screen bg-[#020617] dark:bg-[#020617] flex items-center justify-center transition-colors">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex text-slate-900 dark:text-slate-300 transition-colors relative overflow-x-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#020617] p-6 flex flex-col transition-all lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 mb-10 dark:text-white font-black italic text-2xl uppercase">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Code size={24} className="text-white" /></div>
          DevSync
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold transition-all"><Layout size={20}/> Overview</button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"><User size={20}/> Profile</button>
          
          {/* Theme Toggle Button */}
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500">
            {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>

        <button onClick={() => {localStorage.clear(); toast.success("Logout"); navigate('/login')}} className="p-4 text-slate-500 hover:text-red-500 flex items-center gap-2 mt-auto border-t border-slate-200 dark:border-white/5 pt-6 transition-colors font-bold uppercase text-xs">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-10 w-full animate-in fade-in duration-700">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black dark:text-white text-slate-900 uppercase italic tracking-tighter">
                HI, {userData?.name ? userData.name.split(' ')[0].toUpperCase() : "DINESH"}!
            </h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1 italic">Dev Environment v2.0</p>
          </div>
          <button onClick={() => { setEditingProjectId(null); setIsModalOpen(true); }} className="bg-blue-600 dark:bg-white text-white dark:text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-blue-500/20 dark:shadow-none">
            <Plus size={20}/> New Project
          </button>
        </header>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 h-[350px] shadow-sm">
            <h4 className="dark:text-white text-slate-900 font-bold mb-6 text-[10px] uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Project Status</h4>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', border: 'none', borderRadius: '15px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 h-[350px] flex items-center justify-center italic text-slate-400 dark:text-slate-600 text-[10px] uppercase font-bold tracking-widest shadow-sm">
            Dinesh Kumar &bull; Full Stack Portfolio
          </div>
        </div>

        {/* PROJECTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div key={p._id} className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden group flex flex-col shadow-xl transition-all duration-500 hover:scale-[1.02] relative">
              
              {/* Action Buttons (Edit/Delete) */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                <button onClick={() => handleEditClick(p)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(p._id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="h-44 bg-slate-100 dark:bg-slate-950/60 flex items-center justify-center border-b border-slate-200 dark:border-white/5">
                {p.thumbnail ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={40} className="text-slate-300 dark:text-slate-800" />}
              </div>
              <div className="p-8 grow flex flex-col">
                <span className="text-[9px] px-2 py-1 bg-blue-500/10 text-blue-500 rounded font-bold uppercase w-fit mb-4">{p.status}</span>
                <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2 uppercase italic tracking-tight">{p.title}</h3>
                <p className="text-slate-500 text-xs mb-6 line-clamp-2 leading-relaxed">{p.description}</p>
                <div className="grid grid-cols-2 gap-3 mt-auto font-mono italic">
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="bg-slate-100 dark:bg-white/5 text-center py-3 rounded-xl text-[10px] font-bold border border-slate-200 dark:border-white/5 hover:bg-blue-50 dark:hover:bg-white/10 transition-all">CODE</a>
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="bg-blue-600 text-white text-center py-3 rounded-xl text-[10px] font-bold shadow-lg hover:opacity-90 transition-all">DEMO</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL (New & Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black dark:text-white text-slate-900 uppercase italic tracking-tighter">
                {editingProjectId ? 'Edit Project' : 'New Project'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X size={32} className="text-slate-400 hover:rotate-90 transition-transform" /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="relative group border-2 border-dashed border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:border-blue-500/50 rounded-[2rem] p-6 text-center transition-all cursor-pointer">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setImageFile(e.target.files[0])} />
                <Upload size={24} className="text-blue-500 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">{imageFile ? imageFile.name : 'Update Thumbnail'}</p>
              </div>

              <input type="text" required placeholder="Title" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 dark:text-white p-4 rounded-2xl outline-none focus:border-blue-500/50" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 dark:text-white p-4 rounded-2xl outline-none h-24 text-sm focus:border-blue-500/50" value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="url" placeholder="GitHub" className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 dark:text-white p-4 rounded-2xl text-xs" value={projectData.githubUrl} onChange={(e) => setProjectData({...projectData, githubUrl: e.target.value})} />
                <input type="url" placeholder="Demo" className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 dark:text-white p-4 rounded-2xl text-xs" value={projectData.liveUrl} onChange={(e) => setProjectData({...projectData, liveUrl: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl shadow-xl mt-4 uppercase text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingProjectId ? "Update Changes" : "Deploy Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;