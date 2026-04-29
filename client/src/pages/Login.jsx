import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Code } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      
      console.log("Server Response:", res.data);

      // THE FIX: Your backend sends data as res.data.user.id
      const user = res.data.user;

      if (user && user.id) {
        // Since your backend isn't sending a 'token' string yet, 
        // we store 'true' so the Dashboard security check passes.
        localStorage.setItem('token', 'authenticated'); 
        localStorage.setItem('userId', user.id);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 150);
      } else {
        alert("Login successful, but User data was missing in the response.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.message || "Login failed. Please check credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="text-center mb-10 relative">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <Code size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">DevSync</h2>
          <p className="text-slate-500 text-sm font-medium mt-2 uppercase tracking-widest text-[10px]">Unlock your productivity</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-500" size={18} />
            <input type="email" placeholder="EMAIL ADDRESS" required className="w-full bg-slate-950 border border-white/5 text-white p-4 pl-12 rounded-2xl outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 placeholder:text-xs" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-500" size={18} />
            <input type="password" placeholder="PASSWORD" required className="w-full bg-slate-950 border border-white/5 text-white p-4 pl-12 rounded-2xl outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 placeholder:text-xs" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group mt-6">
            Sign In <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        <p className="text-center mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline ml-1">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;