import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2, Code, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double clicks

    setLoading(true);
    const loginToast = toast.loading("Authenticating Dinesh...");

    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      
      // Instant Storage for speed
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      
      toast.success("Welcome back!", { id: loginToast });
      
      // Pre-fetching ke liye turant redirect
      navigate('/dashboard'); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Check credentials.";
      toast.error(errorMsg, { id: loginToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Glows for that 'Tagda' look */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/20 mb-4 group hover:rotate-12 transition-transform">
            <Code size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">DevSync</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Dinesh's Creative Hub</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-950/50 border border-white/5 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-white/5 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-white/5 uppercase text-xs tracking-widest"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn size={18} /> Sign In <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">Don't have an account? 
              <Link to="/register" className="text-blue-500 font-bold ml-2 hover:underline">Register Now</Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-700 text-[10px] mt-8 font-bold uppercase tracking-[0.2em]">
          Secure Access &bull; 2026 devsync cloud
        </p>
      </div>
    </div>
  );
};

export default Login;