import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, Code, User, LogOut, Plus, X, Github, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [projectData, setProjectData] = useState({ 
    title: '', description: '', githubUrl: '', liveUrl: '',
    status: 'Completed', category: 'Fullstack'
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const fetchData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return navigate('/login');
    try {
      const [uRes, pRes] = await Promise.all([
        axios.get(`${API_URL}/auth/user/${userId}`),
        axios.get(`${API_URL}/projects/${userId}`)
      ]);
      setUserData(uRes.data.user || uRes.data);
      setProjects(Array.isArray(pRes.data) ? pRes.data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userId = localStorage.getItem('userId');
    
    try {
      // Direct JSON object - No FormData, No Multer issues
      const payload = { ...projectData, owner: userId };
      await axios.post(`${API_URL}/projects/add`, payload);
      
      setIsModalOpen(false);
      setProjectData({ title: '', description: '', githubUrl: '', liveUrl: '', status: 'Completed', category: 'Fullstack' });
      fetchData();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Check Backend Console"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-bold">SYNCING...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex">
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black text-white italic uppercase">Hi, {userData?.name?.split(' ')[0] || "Dinesh"}!</h2>
          <button onClick={() => setIsModalOpen(true)} className="bg-white text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2 shadow-2xl active:scale-95 transition-all">
            <Plus size={20}/> New Project
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div key={p._id} className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 flex flex-col shadow-xl">
              <span className="text-[9px] px-2 py-1 bg-blue-500/10 text-blue-500 rounded font-bold uppercase w-fit mb-4">{p.status}</span>
              <h3 className="text-2xl font-bold text-white mb-2 italic uppercase">{p.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{p.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <a href={p.githubUrl} target="_blank" rel="noreferrer" className="bg-white/5 text-center py-3 rounded-xl text-[10px] font-bold border border-white/5">CODE</a>
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="bg-blue-600 text-white text-center py-3 rounded-xl text-[10px] font-bold shadow-lg">DEMO</a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8 text-white">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">New Project</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={32} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input type="text" required placeholder="Title" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full bg-slate-950 border border-white/5 text-white p-4 rounded-2xl outline-none h-24 text-sm" value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="url" placeholder="GitHub" className="bg-slate-950 border border-white/5 text-white p-4 rounded-2xl text-xs outline-none" value={projectData.githubUrl} onChange={(e) => setProjectData({...projectData, githubUrl: e.target.value})} />
                <input type="url" placeholder="Demo" className="bg-slate-950 border border-white/5 text-white p-4 rounded-2xl text-xs outline-none" value={projectData.liveUrl} onChange={(e) => setProjectData({...projectData, liveUrl: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;