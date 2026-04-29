import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Layout, Code, User, LogOut, Plus, Box, X, Upload, Menu,
  CheckCircle2, Clock, BarChart3, Image as ImageIcon, Github, ExternalLink
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [imageFile, setImageFile] = useState(null);
  const [projectData, setProjectData] = useState({ 
    title: '', description: '', githubUrl: '', liveUrl: '',
    status: 'To-Do', priority: 'Medium', tags: '', category: 'Fullstack'
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (!userId) return;
    try {
      const userRes = await axios.get(`${API_URL}/auth/user/${userId}`);
      setUserData(userRes.data);
      const projectRes = await axios.get(`${API_URL}/projects/${userId}`);
      setProjects(projectRes.data);
      setLoading(false);
    } catch (error) { 
      console.error(error); 
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (!userId || !token) navigate('/login'); 
    else fetchData(); 
  }, [userId, token, location.key]);

  const statusData = useMemo(() => {
    const counts = { 'To-Do': 0, 'In Progress': 0, 'Completed': 0 };
    projects.forEach(p => counts[p.status]++);
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [projects]);

  const categoryData = useMemo(() => {
    const counts = { 'Fullstack': 0, 'Frontend': 0, 'Backend': 0 };
    projects.forEach(p => counts[p.category]++);
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [projects]);

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(projectData).forEach(key => formData.append(key, projectData[key]));
      formData.append('ownerId', userId);
      if (imageFile) formData.append('thumbnail', imageFile);

      await axios.post(`${API_URL}/projects/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsModalOpen(false);
      setImageFile(null);
      setProjectData({ title: '', description: '', githubUrl: '', liveUrl: '', status: 'To-Do', priority: 'Medium', tags: '', category: 'Fullstack' });
      fetchData(); 
    } catch (error) { alert("Project creation failed."); }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black italic text-2xl uppercase italic">Syncing...</div>;

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-300 font-sans relative">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - Responsive classes added */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-[#020617]/95 backdrop-blur-xl p-6 flex flex-col 
        transition-transform duration-300 lg:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between lg:justify-start gap-3 mb-10 text-white px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Code size={24} /></div>
            <span className="text-2xl font-bold tracking-tight uppercase">DevSync</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={24}/></button>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-900/20"><Layout size={20}/> Overview</button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-medium"><User size={20}/> My Profile</button>
        </nav>
        
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 mt-auto border-t border-white/5 pt-4 font-bold text-sm transition-colors"><LogOut size={18} /> Logout</button>
      </aside>

      {/* MAIN CONTENT - Dynamic margin added */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 w-full overflow-x-hidden">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            {/* HAMBURGER MENU BUTTON */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-white"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                  {userData ? `Hi, ${userData.name.split(' ')[0]}!` : "Dashboard"}
              </h2>
              <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px]">Developer Workspace</p>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-white text-slate-950 font-black px-8 py-4 rounded-[1.5rem] flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-95 shadow-2xl shadow-blue-500/10">
            <Plus size={20}/> New Project
          </button>
        </header>

        {/* ANALYTICS SECTION - Stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 h-[350px]">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-500" /> Project Status</h4>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '10px' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 h-[350px]">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-2"><BarChart3 size={18} className="text-purple-500" /> Stack Analysis</h4>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '10px' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PROJECT GRID - Responsive columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project) => (
            <div key={project._id} className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] group flex flex-col shadow-xl">
              <div className="h-48 bg-slate-950/40 flex items-center justify-center border-b border-white/5 overflow-hidden">
                {project.thumbnail ? <img src={project.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <ImageIcon size={48} className="text-slate-800" />}
              </div>
              <div className="p-6 md:p-8 grow flex flex-col">
                <div className="flex gap-2 mb-4">
                  <span className="text-[9px] px-2 py-1 bg-amber-500/10 text-amber-500 rounded font-bold uppercase tracking-widest">{project.status}</span>
                  <span className="text-[9px] px-2 py-1 bg-purple-500/10 text-purple-500 rounded font-bold uppercase tracking-widest">{project.category}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <p className="text-slate-500 text-sm mb-6 grow line-clamp-2 leading-relaxed">{project.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-white/5 text-slate-300 rounded-[1.2rem] text-[11px] font-bold hover:bg-white/10 transition-all border border-white/5 text-center"><Github size={14}/> Code</a>
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-[1.2rem] text-[11px] font-bold hover:bg-blue-500 transition-all shadow-lg text-center"><ExternalLink size={14}/> Demo</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL - Now full screen on mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-0 md:p-4">
          <div className="bg-slate-900 border-x border-t md:border border-white/10 w-full max-w-lg rounded-t-[3rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-screen md:max-h-[90vh]">
            <div className="flex justify-between items-center mb-8 text-white">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight">New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X size={32} /></button>
            </div>
            {/* Form code remains functionally the same but fits mobile better */}
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-white/5 bg-white/5 rounded-[2rem] p-6">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setImageFile(e.target.files[0])} />
                <Upload size={24} className="text-blue-500 mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase text-center">{imageFile ? imageFile.name : 'Upload Thumbnail'}</p>
              </div>
              <input type="text" required placeholder="Project Title" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none h-24" value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select className="bg-slate-950 border border-white/5 text-slate-400 p-4 rounded-2xl" value={projectData.status} onChange={(e) => setProjectData({...projectData, status: e.target.value})}>
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <select className="bg-slate-950 border border-white/5 text-slate-400 p-4 rounded-2xl" value={projectData.category} onChange={(e) => setProjectData({...projectData, category: e.target.value})}>
                  <option value="Fullstack">Fullstack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="url" placeholder="GitHub Link" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none" value={projectData.githubUrl} onChange={(e) => setProjectData({...projectData, githubUrl: e.target.value})} />
                <input type="url" placeholder="Live Demo" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none" value={projectData.liveUrl} onChange={(e) => setProjectData({...projectData, liveUrl: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl mt-4">Save Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;