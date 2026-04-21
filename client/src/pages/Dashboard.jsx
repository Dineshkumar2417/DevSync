import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Layout, Code, Folder, Settings, LogOut, Plus, X, Box, 
  Trash2, Search, User, Github, ExternalLink, CheckCircle2, 
  Clock, BarChart3, Image as ImageIcon, Upload 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // States for the Project Data and the Image File
  const [imageFile, setImageFile] = useState(null);
  const [projectData, setProjectData] = useState({ 
    title: '', description: '', githubUrl: '', liveUrl: '',
    status: 'To-Do', priority: 'Medium', tags: '', category: 'Fullstack'
  });

  const userId = localStorage.getItem('userId');

  const fetchData = async () => {
    if (!userId) return;
    try {
      const userRes = await axios.get(`http://localhost:5001/api/auth/user/${userId}`);
      setUserData(userRes.data);
      const projectRes = await axios.get(`http://localhost:5001/api/projects/${userId}`);
      setProjects(projectRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!userId) { navigate('/login'); } else { fetchData(); }
  }, [userId, location.key]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      // Use FormData for Image + Text
      const formData = new FormData();
      formData.append('title', projectData.title);
      formData.append('description', projectData.description);
      formData.append('githubUrl', projectData.githubUrl);
      formData.append('liveUrl', projectData.liveUrl);
      formData.append('status', projectData.status);
      formData.append('priority', projectData.priority);
      formData.append('category', projectData.category);
      formData.append('tags', projectData.tags); // Will be split on backend
      formData.append('ownerId', userId);
      
      if (imageFile) {
        formData.append('thumbnail', imageFile);
      }

      await axios.post('http://localhost:5001/api/projects/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsModalOpen(false);
      setImageFile(null);
      setProjectData({ 
        title: '', description: '', githubUrl: '', liveUrl: '', 
        status: 'To-Do', priority: 'Medium', tags: '', category: 'Fullstack' 
      });
      fetchData(); 
    } catch (error) {
      alert("Project creation failed. Check your Server/Cloudinary config!");
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm("Delete this project?")) {
      try {
        await axios.delete(`http://localhost:5001/api/projects/${projectId}`);
        fetchData(); 
      } catch (error) { alert("Failed to delete."); }
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- STATS ---
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'Completed').length,
    active: projects.filter(p => p.status === 'In Progress').length
  };
  const overallProgress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const getProgressInfo = (status) => {
    if (status === 'Completed') return { width: '100%', color: 'bg-emerald-500' };
    if (status === 'In Progress') return { width: '60%', color: 'bg-amber-500' };
    return { width: '15%', color: 'bg-blue-600' };
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-300 font-sans relative">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-md p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-10 px-2 text-white">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Code size={24} /></div>
          <span className="text-2xl font-bold tracking-tight">DevSync</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white shadow-md font-bold transition-all"><Layout size={20}/> Overview</button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-medium"><User size={20}/> My Profile</button>

          <div className="mt-10 p-5 bg-slate-900/80 border border-slate-800 rounded-[2rem]">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Health</span>
                <span className="text-xs font-bold text-blue-500">{overallProgress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>
        </nav>

        <button onClick={() => { localStorage.removeItem('userId'); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 mt-auto border-t border-slate-800 pt-4 font-bold text-sm transition-colors"><LogOut size={18} /> Logout</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Hi, {userData?.name.split(' ')[0]}!</h2>
            <p className="text-slate-500 font-medium tracking-wide">Workspace Health: <span className="text-blue-500 font-bold">{overallProgress}%</span></p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-white text-slate-950 font-black px-8 py-4 rounded-[1.5rem] flex items-center gap-2 hover:bg-blue-50 transition-all active:scale-95 shadow-2xl shadow-blue-500/10"><Plus size={20}/> New Project</button>
        </header>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total', val: stats.total, icon: <Box size={28}/>, color: 'text-blue-500', bg: 'bg-blue-600/10' },
            { label: 'Done', val: stats.completed, icon: <CheckCircle2 size={28}/>, color: 'text-emerald-500', bg: 'bg-emerald-600/10' },
            { label: 'Active', val: stats.active, icon: <Clock size={28}/>, color: 'text-amber-500', bg: 'bg-amber-600/10' },
            { label: 'Health', val: `${overallProgress}%`, icon: <BarChart3 size={28}/>, color: 'text-purple-500', bg: 'bg-purple-600/10' }
          ].map((s, i) => (
            <div key={i} className="p-6 bg-slate-900/40 border border-slate-800/50 rounded-[2rem] flex items-center gap-4">
               <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
               <div><p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{s.label}</p><p className="text-3xl font-black text-white">{s.val}</p></div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input type="text" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3 rounded-[1.2rem] outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
        </div>

        {/* PROJECT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const prog = getProgressInfo(project.status);
            return (
              <div key={project._id} className="bg-slate-900 border border-slate-800/60 rounded-[2.5rem] hover:border-blue-500/40 transition-all group overflow-hidden flex flex-col shadow-xl">
                
                {/* Thumbnail Display */}
                <div className="h-48 w-full bg-slate-950 relative overflow-hidden">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt="preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-800 bg-slate-900/50">
                        <ImageIcon size={48} />
                    </div>
                  )}
                  <button onClick={() => handleDelete(project._id)} className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-xl hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                </div>

                <div className="p-8 flex flex-col grow">
                    <div className="flex gap-2 mb-4">
                        <span className={`text-[9px] px-2 py-1 rounded-md font-bold uppercase ${project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {project.status}
                        </span>
                        <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded-md font-bold uppercase">
                            {project.category}
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project?.title}</h3>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags?.map((tag, i) => (
                            <span key={i} className="text-[8px] bg-slate-950 text-slate-500 px-2 py-0.5 rounded-md border border-slate-800">#{tag}</span>
                        ))}
                    </div>

                    <p className="text-slate-500 text-sm mb-6 grow line-clamp-2 leading-relaxed">{project?.description}</p>
                    
                    {/* Card Progress */}
                    <div className="mb-6">
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${prog.color}`} style={{ width: prog.width }}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {project?.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-slate-800 text-slate-300 rounded-[1.2rem] text-[11px] font-bold hover:bg-slate-700 transition-all"><Github size={14}/> Code</a>}
                        {project?.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-[1.2rem] text-[11px] font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"><ExternalLink size={14}/> Demo</a>}
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL WITH IMAGE UPLOAD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-10 text-white">
              <h3 className="text-3xl font-black tracking-tight">Project Config</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform duration-300"><X size={32} /></button>
            </div>
            
            <form onSubmit={handleCreateProject} className="space-y-5">
              
              {/* IMAGE INPUT BOX */}
              <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-slate-800 bg-slate-950 hover:border-blue-500/50 rounded-[2rem] p-8 transition-all">
                <input 
                    type="file" accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {imageFile ? imageFile.name : 'Drop Thumbnail Here'}
                    </p>
                </div>
              </div>

              <input type="text" required placeholder="Project Name" className="w-full bg-slate-950 border border-slate-800 text-white p-5 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <select className="w-full bg-slate-950 border border-slate-800 text-slate-400 p-4 rounded-[1.2rem] outline-none" value={projectData.status} onChange={(e) => setProjectData({...projectData, status: e.target.value})}>
                    <option value="To-Do">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <select className="w-full bg-slate-950 border border-slate-800 text-slate-400 p-4 rounded-[1.2rem] outline-none" value={projectData.category} onChange={(e) => setProjectData({...projectData, category: e.target.value})}>
                    <option value="Fullstack">Fullstack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                </select>
              </div>

              <input type="text" placeholder="Tags (React, Node, etc.)" className="w-full bg-slate-950 border border-slate-800 text-white p-4 rounded-[1.2rem] outline-none" value={projectData.tags} onChange={(e) => setProjectData({...projectData, tags: e.target.value})} />

              <div className="grid grid-cols-2 gap-4">
                <input type="url" placeholder="GitHub URL" className="w-full bg-slate-950 border border-slate-800 text-white p-4 rounded-[1.2rem] outline-none" value={projectData.githubUrl} onChange={(e) => setProjectData({...projectData, githubUrl: e.target.value})} />
                <input type="url" placeholder="Live URL" className="w-full bg-slate-950 border border-slate-800 text-white p-4 rounded-[1.2rem] outline-none" value={projectData.liveUrl} onChange={(e) => setProjectData({...projectData, liveUrl: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-white text-slate-950 font-black py-5 rounded-[1.5rem] shadow-xl hover:bg-blue-50 transition-all mt-6 text-lg">Deploy Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;