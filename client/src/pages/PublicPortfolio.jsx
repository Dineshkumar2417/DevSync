import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Github, ExternalLink, Code, Mail, MapPin, Loader2, Sun, Moon } from 'lucide-react';

const PublicPortfolio = () => {
    const { userId } = useParams();
    const [projects, setProjects] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 🔥 THEME LOGIC
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'light' ? false : true;
    });

    const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                const [uRes, pRes] = await Promise.all([
                    axios.get(`${API_URL}/auth/user/${userId}`),
                    axios.get(`${API_URL}/projects/public/${userId}`)
                ]);
                setUserData(uRes.data.user || uRes.data);
                setProjects(pRes.data);
            } catch (err) {
                console.error("Public Fetch error");
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
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-300 transition-colors duration-300 pb-20">
            {/* Nav with Theme Toggle */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="font-black italic text-2xl uppercase dark:text-white">DevSync</div>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                    {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-600" />}
                </button>
            </nav>

            {/* Hero Section */}
            <header className="py-16 px-6 text-center">
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
            <main className="max-w-7xl mx-auto px-6 mt-16">
                <h2 className="text-xl font-black dark:text-white text-slate-900 uppercase italic mb-12 flex items-center gap-3 opacity-70">
                    <Code className="text-blue-500" /> My Creations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {projects.map((p) => (
                        <div key={p._id} className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3rem] overflow-hidden group hover:scale-[1.03] transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <div className="h-56 overflow-hidden border-b border-slate-100 dark:border-white/5">
                                <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-10">
                                <h3 className="text-2xl font-black dark:text-white text-slate-900 mb-3 uppercase italic tracking-tighter">{p.title}</h3>
                                <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">{p.description}</p>
                                <div className="grid grid-cols-2 gap-4 font-black text-[11px] tracking-widest">
                                    <a href={p.githubUrl} target="_blank" className="bg-slate-100 dark:bg-white/5 text-center py-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all uppercase border border-slate-200 dark:border-white/5 dark:text-white text-slate-900">Code</a>
                                    <a href={p.liveUrl} target="_blank" className="bg-blue-600 text-white text-center py-4 rounded-2xl shadow-xl hover:opacity-90 transition-all uppercase">Live Demo</a>
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