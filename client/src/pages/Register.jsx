import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Code } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  // This line pulls the URL from Vercel settings
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Using template literals `${}` to inject the live URL
      await axios.post(`${API_URL}/auth/register`, formData);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-10 relative">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <Code size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Join DevSync</h2>
          <p className="text-slate-500 text-sm font-medium mt-2">Start your journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-500" size={18} />
            <input type="text" placeholder="FULL NAME" required className="w-full bg-slate-950 border border-white/5 text-white p-4 pl-12 rounded-2xl outline-none focus:border-blue-500/50 transition-all" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-500" size={18} />
            <input type="email" placeholder="EMAIL" required className="w-full bg-slate-950 border border-white/5 text-white p-4 pl-12 rounded-2xl outline-none focus:border-blue-500/50 transition-all" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-500" size={18} />
            <input type="password" placeholder="PASSWORD" required className="w-full bg-slate-950 border border-white/5 text-white p-4 pl-12 rounded-2xl outline-none focus:border-blue-500/50 transition-all" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 group mt-6">
            Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500 font-medium uppercase tracking-widest">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;