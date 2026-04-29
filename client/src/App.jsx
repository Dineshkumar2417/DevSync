import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} /> {/* New Route */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;