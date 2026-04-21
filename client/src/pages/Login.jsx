import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; // 1. Keep this
import axios from 'axios';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    // 2. CRITICAL FIX: Define your state variables here
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Debugging: This will show you exactly what is being sent in the console
        console.log("Attempting login with:", { email, password });

        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', { 
                email, 
                password 
            });

            if (response.status === 200) {
                // Success! Move to Dashboard
                localStorage.setItem('userId', response.data.user.id);
                navigate('/dashboard'); 
            }

        } catch (error) {
            console.error("Login Error:", error.response?.data?.message);
            alert(error.response?.data?.message || "Login Failed. Check your credentials.");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden">
            
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-md p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl mx-4">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2">DevSync</h1>
                    <p className="text-slate-400 font-medium">Unlock your productivity</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="email" 
                                value={email} // Connect state to input
                                className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="test@gmail.com"
                                onChange={(e) => setEmail(e.target.value)} // Use the setter function
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="password" 
                                value={password} // Connect state to input
                                className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="••••••"
                                onChange={(e) => setPassword(e.target.value)} // Use the setter function
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                        Sign In <ArrowRight size={20} />
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500 text-sm">
                    Don't have an account? 
                    <Link to="/register" className="ml-2 text-blue-400 font-bold hover:text-blue-300 transition-colors cursor-pointer">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;