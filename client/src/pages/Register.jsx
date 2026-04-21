import { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    // We send 'formData' which contains { name, email, password }
    const response = await axios.post('http://localhost:5001/api/auth/register', formData);
    
    // If successful, show the success message from your controller
    alert(response.data.message); 
  } catch (error) {
    // This logs the REAL error to the browser console (F12)
    console.error("Error details:", error.response?.data);
    alert(error.response?.data?.message || "Registration Failed");
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"></div>
      
      <div className="relative z-10 w-full max-w-md p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl mx-4">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Join <span className="text-blue-500">DevSync</span></h1>
          <p className="text-slate-400 font-medium">Start your journey today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Dinesh Kumar"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="name@example.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95">
            Create Account <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;