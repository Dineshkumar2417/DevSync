import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Code, Mail, MapPin, Loader2, Sun, Moon } from 'lucide-react';

const PublicPortfolio = () => {
    const { userId } = useParams();
    const [projects, setProjects] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'light' ? false : true);

    const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                // 🔥 ERROR FIX: ID ko clean kiya taaki error na aaye
                const cleanId = userId.trim().replace(/[^a-zA-Z0-9]/g, "");
                
                const [uRes, pRes] = await Promise.all([
                    axios.get(`${API_URL}/auth/user/${cleanId}`),
                    axios.get(`${API_URL}/projects/public/${cleanId}`)
                ]);
                setUserData(uRes.data.user || uRes.data);
                setProjects(pRes.data);
            } catch (err) { 
                console.error("Error fetching data"); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchPublicData();
    }, [userId, API_URL]);

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-[#020617] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#020617] text-slate-300' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 pb-20`}>
            {/* Header / Hero Section */}
            <header className="py-20 px-6 text-center max-w-5xl mx-auto">
                <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-5xl font-black text-white italic shadow-2xl">
                    {userData?.name?.charAt(0)}
                </div>
                <h1 className="text-5xl md:text-7xl font-black dark:text-white text-slate-900 uppercase italic tracking-tighter mb-4">
                    {userData?.name}
                </h1>
                <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-xs mb-8 italic">Full Stack Developer & Data Scientist</p>
                <div className="flex justify-center gap-8 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    <span className="flex items-center gap-2"><MapPin size={16} className="text-blue-500" /> Chandigarh</span>
                    <span className="flex items-center gap-2"><Mail size={16} className="text-blue-500" /> {userData?.email}</span>
                </div>
            </header>

            {/* Projects Grid */}
            <main className="max-w-7xl mx-auto px-6">
                <h2 className="text-xl font-black dark:text-white text-slate-900 uppercase italic mb-12 flex items-center gap-3 opacity-70">
                    <Code className="text-blue-500" /> My Creations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {projects.map((p) => (
                        <div key={p._id} className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3rem] overflow-hidden group shadow-xl">
                            <div className="h-56 overflow-hidden">
                                <img src={p.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-10">
                                <h3 className="text-2xl font-black dark:text-white text-slate-900 mb-3 uppercase italic tracking-tighter">{p.title}</h3>
                                <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed">{p.description}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <a href={p.githubUrl} target="_blank" className="bg-slate-100 dark:bg-white/5 text-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Code</a>
                                    <a href={p.liveUrl} target="_blank" className="bg-blue-600 text-white text-center py-4 rounded-2xl shadow-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">Demo</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PublicPortfolio;