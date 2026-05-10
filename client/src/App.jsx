import { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicPortfolio from './pages/PublicPortfolio'; // Added this

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark'); 
    }
  }, []);

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            fontSize: '12px',
            fontWeight: 'bold',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        {/* 🔥 Public Route */}
        <Route path="/portfolio/:userId" element={<PublicPortfolio />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;