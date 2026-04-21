import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/Project.js'; // Using lowercase 'p' for consistency

const app = express();

// --- MIDDLEWARES ---
// Allows your React app (Port 5173) to talk to this Server (Port 5001)
app.use(cors()); 
// Allows the server to understand JSON data sent from the frontend
app.use(express.json()); 

// --- MONGODB CONNECTION ---
const MONGO_URL = "mongodb://127.0.0.1:27017/devsync_db";

mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ MongoDB is Connected! Database is ready."))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// --- GLOBAL ERROR HANDLER ---
// If any of your routes crash, this keeps the server from dying
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong on the server!" });
});

// --- SERVER START ---
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server is breathing at: http://localhost:${PORT}`);
    console.log(`📡 Ready to receive requests from Frontend`);
});