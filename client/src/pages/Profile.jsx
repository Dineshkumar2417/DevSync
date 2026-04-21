import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, ArrowLeft, ShieldCheck, Edit3, Check, X, Lock } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const userId = localStorage.getItem('userId');

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/auth/user/${userId}`);
      setUserData(res.data);
      setNewName(res.data.name);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleUpdate = async (field) => {
    try {
      const data = field === 'name' ? { name: newName } : { password: newPassword };
      await axios.put(`http://localhost:5001/api/auth/user/${userId}`, data);
      
      setIsEditing(false);
      setIsChangingPassword(false);
      setNewPassword("");
      fetchUser();
      alert(`${field === 'name' ? 'Name' : 'Password'} updated successfully!`);
    } catch (error) {
      alert("Update failed");
    }
  };

  if (!userData) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-300">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 font-medium">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 blur-[100px] rounded-full"></div>

        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-900/20">
            <User className="text-white" size={48} />
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-slate-950 border border-blue-500 text-white text-3xl font-bold px-4 py-2 rounded-xl outline-none text-center w-full" />
              <button onClick={() => handleUpdate('name')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"><Check size={24} /></button>
              <button onClick={() => setIsEditing(false)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><X size={24} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-white tracking-tight">{userData.name}</h1>
              <button onClick={() => setIsEditing(true)} className="text-slate-600 hover:text-blue-500 transition-colors"><Edit3 size={20} /></button>
            </div>
          )}
          <p className="text-blue-500 font-bold mt-2 uppercase tracking-widest text-xs">Verified Developer</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-5 bg-slate-950/40 rounded-3xl border border-slate-800/50">
            <Mail className="text-slate-500" size={24} />
            <div className="text-left flex-grow">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Email Address</p>
              <p className="text-white font-medium">{userData.email}</p>
            </div>
          </div>

          {/* PASSWORD SECTION */}
          <div className="p-5 bg-slate-950/40 rounded-3xl border border-slate-800/50">
            <div className="flex items-center gap-4">
              <Lock className="text-slate-500" size={24} />
              <div className="text-left flex-grow">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Security</p>
                <p className="text-white font-medium">Password Hidden</p>
              </div>
              <button onClick={() => setIsChangingPassword(!isChangingPassword)} className="text-xs font-bold text-blue-500 hover:underline">
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            
            {isChangingPassword && (
              <div className="mt-4 flex gap-2">
                <input 
                  type="password" placeholder="Enter new password" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-grow bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button onClick={() => handleUpdate('password')} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-500 transition-all">Save</button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 p-5 bg-slate-950/40 rounded-3xl border border-slate-800/50">
            <Calendar className="text-slate-500" size={24} />
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Member Since</p>
              <p className="text-white font-medium">{new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;