import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Layout, Code, User, LogOut, Plus, X, Trash2, Edit3, Sun, Moon,
  CheckCircle2, Image as ImageIcon, Github, ExternalLink, Loader2, Radar, Upload, Menu, Share2 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 🔥 THEME PERSISTENCE: Memory se mode uthayega
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? false : true;
  });

  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [projectData, setProjectData] = useState({ 
    title: '', description: '', githubUrl: '', liveUrl: '',
    status: 'Completed', category: 'Fullstack'
  });

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

  // 🔥 PUBLIC LINK COPY FUNCTION
  const copyPortfolioLink = () => {
    const publicLink = `${window.location.origin}/portfolio/${userId}`;
    navigator.clipboard.writeText(publicLink);
    toast.success("Public Portfolio Link Copied! 🚀", {
      style: { borderRadius: '15px', background: isDarkMode ? '#1e293b' : '#fff', color: isDarkMode ? '#fff' : '#1e293b' }
    });
    setIsSidebarOpen(false); // Mobile par sidebar band kar dega copy ke baad
  };

  const fetchData = useCallback(async () => {
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
  }, [API_URL, navigate, userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

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
    const loadToast = toast.loading(editingProjectId ? "Updating..." : "Deploying...");
    
    try {
      const payload = { ...projectData, owner: userId, userId: userId };
      let dataToSend;
      let headersConfig = {};

      if (imageFile) {
        dataToSend = new FormData();
        Object.keys(payload).forEach(key => dataToSend.append(key, payload[key]));
        dataToSend.append('thumbnail', imageFile);
        headersConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
      } else {
        dataToSend = payload;
        headersConfig = { headers: { 'Content-Type': 'application/json' } };
      }

      if (editingProjectId) {
        await axios.put(`${API_URL}/projects/${editingProjectId}`, dataToSend, headersConfig);
        toast.success("Project Updated!", { id: loadToast });
      } else {
        await axios.post(`${API_URL}/projects/add`, dataToSend, headersConfig);
        toast.success("Project Live! 🎉", { id: loadToast });
      }

      setIsModalOpen(false);
      setEditingProjectId(null);
      setImageFile(null);
      setProjectData({ title: '', description: '', githubUrl: '', liveUrl: '', status: 'Completed', category: 'Fullstack' });
      fetchData(); 
    } catch (error) { 
      const errorMsg = error.response?.data?.message || "Operation Failed";
      toast.error(errorMsg, { id: loadToast });
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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
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

      {/* SIDEBAR */}
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
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={24} /></button>
        </div>
        
        <nav className="flex-1 space-y-3">
          <button onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-blue-600 text-white font-bold transition-all shadow-lg shadow-blue-500/20 italic uppercase text-[11px] tracking-widest">
            <Layout size={20}/> Overview
          </button>
          
          <button onClick={() => { setIsSidebarOpen(false); navigate('/profile'); }} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all font-bold italic uppercase text-[11px] tracking-widest">
            <User size={20}/> Profile
          </button>

          {/* 🔥 NEW: PUBLIC PORTFOLIO SHARE BUTTON */}
          <button 
            onClick={copyPortfolioLink} 
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-blue-600/5 dark:bg-blue-600/10 text-blue-600 border border-blue-600/20 font-black italic tracking-widest text-[11px] uppercase hover:bg-blue-600/20 transition-all"
          >
            <Share2 size={20}/> Public Link
          </button>
          
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 font-bold italic uppercase text-[11px] tracking-widest">
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

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12 w-full animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 mt-12 lg:mt-0">
          <div>
            <h2 className="text-4xl md:text-5xl font-black dark:text-white text-slate-900 uppercase italic tracking-tighter">
              HI, {userData?.name ? userData.name.split(' ')[0].toUpperCase() : "DINESH"}!
            </h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 italic opacity-60">Dev Environment v2.0</p>
          </div>
          <button onClick={() => { setEditingProjectId(null); setIsModalOpen(true); }} className="w-full md:w-auto bg-blue-600 dark:bg-white text-white dark:text-black font-black px-10 py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 shadow-2xl shadow-blue-500/25 uppercase text-xs tracking-widest italic">
            <Plus size={20}/> New Project
          </button>
        </header>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 h-[380px] shadow-sm">
            <h4 className="dark:text-white text-slate-900 font-black mb-8 text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 opacity-70">
              <CheckCircle2 size={18} className="text-blue-500" /> Status
            </h4>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={statusData} innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                  {statusData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', border: 'none', borderRadius: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="hidden lg:flex bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 h-[380px] items-center justify-center italic text-slate-400 dark:text-slate-600 text-[11px] uppercase font-black tracking-[0.3em] shadow-sm text-center">
            Dinesh Kumar &bull; Full Stack Portfolio
          </div>
        </div>

        {/* PROJECTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {projects.map((p) => (
            <div key={p._id} className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3rem] overflow-hidden group flex flex-col shadow-2xl transition-all duration-500 hover:scale-[1.03] relative">
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10 translate-y-2 group-hover:translate-y-0">
                <button onClick={() => handleEditClick(p)} className="p-3 bg-white/10 backdrop-blur-md text-blue-500 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-xl"><Edit3 size={16} /></button>
                <button onClick={() => handleDelete(p._id)} className="p-3 bg-white/10 backdrop-blur-md text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl"><Trash2 size={16} /></button>
              </div>
              <div className="h-56 bg-slate-100 dark:bg-slate-950/60 flex items-center justify-center border-b border-slate-200 dark:border-white/5 overflow-hidden">
                {p.thumbnail ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <ImageIcon size={48} className="text-slate-300 dark:text-slate-800 opacity-20" />}
              </div>
              <div className="p-10 grow flex flex-col">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 italic">{p.status}</span>
                <h3 className="text-2xl font-black dark:text-white text-slate-900 mb-3 uppercase italic tracking-tighter">{p.title}</h3>
                <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">{p.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-auto font-mono">
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="bg-slate-100 dark:bg-white/5 text-center py-4 rounded-2xl text-[11px] font-black border border-slate-200 dark:border-white/5 hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest italic">Code</a>
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="bg-blue-600 text-white text-center py-4 rounded-2xl shadow-xl hover:opacity-90 transition-all uppercase tracking-widest italic">Demo</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-xl rounded-[4rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 relative">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black dark:text-white text-slate-900 uppercase italic tracking-tighter">{editingProjectId ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:rotate-90 transition-transform"><X size={32} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="relative group border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-blue-500/50 rounded-[2.5rem] p-10 text-center transition-all cursor-pointer">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setImageFile(e.target.files[0])} />
                <Upload size={32} className="text-blue-500 mx-auto mb-4" />
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">{imageFile ? imageFile.name : 'Update Thumbnail'}</p>
              </div>
              <input type="text" required placeholder="Project Title" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 dark:text-white p-5 rounded-2xl outline-none font-black italic tracking-widest uppercase text-[11px]" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} />
              <textarea placeholder="Tell us about the project..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 dark:text-white p-5 rounded-2xl outline-none h-32 text-sm font-medium" value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="url" placeholder="GitHub Repository URL" className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 dark:text-white p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest italic" value={projectData.githubUrl} onChange={(e) => setProjectData({...projectData, githubUrl: e.target.value})} />
                <input type="url" placeholder="Live Deployment URL" className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 dark:text-white p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest italic" value={projectData.liveUrl} onChange={(e) => setProjectData({...projectData, liveUrl: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 dark:bg-white text-white dark:text-black font-black py-6 rounded-[2rem] shadow-2xl mt-6 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all italic">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingProjectId ? "Update Changes" : "Deploy Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;