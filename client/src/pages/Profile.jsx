import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, ArrowLeft, Loader2, Camera, MapPin, Briefcase } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        return navigate('/login');
      }

      try {
        const res = await axios.get(`${API_URL}/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setUserData(res.data);
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, API_URL]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px]">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase text-xs tracking-widest">Back to Dashboard</span>
        </button>

        <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          {/* Profile Header/Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-900 relative">
            <div className="absolute -bottom-12 left-10">
              <div className="w-24 h-24 bg-slate-900 rounded-[2rem] border-4 border-[#020617] flex items-center justify-center text-white shadow-xl relative group">
                <User size={40} />
                <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Camera size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  {userData?.name || "Developer"}
                </h1>
                <p className="text-blue-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Full Stack Developer</p>
              </div>
              <button className="bg-white text-slate-950 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-tighter hover:bg-blue-50 transition-all active:scale-95">
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Info Card 1: Account Details */}
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4">
                <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Shield size={16} className="text-blue-500" /> Account Security
                </h3>
                <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <Mail className="text-slate-500" size={18} />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-600 tracking-tight">Email Address</p>
                    <p className="text-sm text-white font-medium">{userData?.email || "Not Available"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <User className="text-slate-500" size={18} />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-600 tracking-tight">User ID</p>
                    <p className="text-[10px] text-slate-400 font-mono break-all">{userData?._id || "---"}</p>
                  </div>
                </div>
              </div>

              {/* Info Card 2: Professional Details */}
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4">
                <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Briefcase size={16} className="text-purple-500" /> Professional Info
                </h3>
                <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <MapPin className="text-slate-500" size={18} />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-600 tracking-tight">Location</p>
                    <p className="text-sm text-white font-medium">India</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-600 tracking-tight">Account Status</p>
                    <p className="text-sm text-white font-medium">Verified Developer</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 p-6 border border-blue-500/10 bg-blue-500/5 rounded-[2rem] text-center">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Workspace linked to: <span className="text-blue-400">{userData?.email}</span>
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;