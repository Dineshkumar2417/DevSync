import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Layout, Code, User, LogOut, Plus, X, Upload, Menu, Edit3,
  CheckCircle2, BarChart3, Image as ImageIcon, Github, ExternalLink
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
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const [projectData, setProjectData] = useState({ 
    title: '', description: '', githubUrl: '', liveUrl: '',
    status: 'To-Do', category: 'Fullstack'
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const fetchData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return navigate('/login');

    try {
      const [userRes, projectRes] = await Promise.all([
        axios.get(`${API_URL}/auth/user/${userId}`),
        axios.get(`${API_URL}/projects/${userId}`)
      ]);
      setUserData(userRes.data);
      setProjects(projectRes.data);
      setLoading(false);
    } catch (error) { 
      console.error(error);
      setLoading(false);
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
    const userId = localStorage.getItem('userId');
    try {
      if (editingId) {
        // UPDATE PROJECT - Sending JSON
        await axios.put(`${API_URL}/projects/update/${editingId}`, projectData);
      } else {
        // CREATE PROJECT - Sending FormData for Image
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
        alert("Action failed. Ensure backend routes /projects/add and /projects/update/:id are ready."); 
    }
  };

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

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black uppercase italic">Syncing...</div>;

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-300 relative">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-[#020617] p-6 flex flex-col transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 mb-10 text-white italic font-black text-2xl uppercase">
          <Code size={28} className="text-blue-600" /> DevSync
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold"><Layout size={20}/> Overview</button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all"><User size={20}/> My Profile</button>
        </nav>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 text-slate-500 mt-auto border-t border-white/5 pt-4"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-10 w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl text-white"><Menu size={24} /></button>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic">{userData ? `Hi, ${userData.name.split(' ')[0]}!` : "Dashboard"}</h2>
          </div>
          <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="w-full md:w-auto bg-white text-slate-950 font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2">
            <Plus size={20}/> New Project
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-6 h-[350px]">
            <h4 className="text-white font-bold mb-6 text-xs uppercase flex items-center gap-2"><CheckCircle2 size={16} /> Status</h4>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-6 h-[350px]">
            <h4 className="text-white font-bold mb-6 text-xs uppercase flex items-center gap-2"><BarChart3 size={16} /> Stack</h4>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={categoryData}><XAxis dataKey="name" hide /><Bar dataKey="count" fill="#3b82f6" radius={[10, 10, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project._id} className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden group relative">
              <button onClick={() => handleEditClick(project)} className="absolute top-4 right-4 p-3 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"><Edit3 size={16} /></button>
              <div className="h-48 bg-slate-950/40 flex items-center justify-center">
                {project.thumbnail ? <img src={project.thumbnail} className="w-full h-full object-cover" alt="" /> : <ImageIcon size={48} className="text-slate-800" />}
              </div>
              <div className="p-8 flex flex-col h-full">
                <div className="flex gap-2 mb-4">
                  <span className="text-[9px] px-2 py-1 bg-blue-500/10 text-blue-500 rounded font-bold uppercase">{project.status}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{project.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                   <a href={project.githubUrl} target="_blank" rel="noreferrer" className="bg-white/5 text-center py-3 rounded-xl text-[10px] font-bold">Code</a>
                   <a href={project.liveUrl} target="_blank" rel="noreferrer" className="bg-blue-600 text-center py-3 rounded-xl text-[10px] font-bold text-white">Demo</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8 text-white">
              <h3 className="text-2xl font-black uppercase italic">{editingId ? "Update" : "New"} Project</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={32} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {!editingId && <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-xs text-slate-500" />}
              <input type="text" required placeholder="Title" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none h-24" value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-slate-950 border border-white/5 text-slate-400 p-4 rounded-2xl" value={projectData.status} onChange={(e) => setProjectData({...projectData, status: e.target.value})}>
                    <option value="To-Do">To-Do</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option>
                </select>
                <select className="bg-slate-950 border border-white/5 text-slate-400 p-4 rounded-2xl" value={projectData.category} onChange={(e) => setProjectData({...projectData, category: e.target.value})}>
                    <option value="Fullstack">Fullstack</option><option value="Frontend">Frontend</option><option value="Backend">Backend</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl mt-4 uppercase text-xs">{editingId ? "Save Changes" : "Create Project"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;