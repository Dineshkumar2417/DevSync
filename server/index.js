import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns'; // Added for DNS resolution fix

// 1. DNS Fix: Overrides local ISP blocks for MongoDB Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config(); 

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/Project.js';
// import aiRoutes from './routes/ai.js'; // Re-enable this later if you want AI back

const app = express();

app.use(cors()); 
app.use(express.json()); 

// 2. Health Check Route (Required for Render deployment)
app.get("/", (req, res) => {
    res.send("DevSync Backend is Live and Breathing!");
});

// 3. Database Connection
const MONGO_URL = process.env.MONGO_URI;

// We remove the hardcoded localhost fallback to ensure we know if the .env is working
mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ MongoDB is Connected to Atlas!"))
    .catch((err) => {
        console.log("❌ MongoDB Connection Error Details:");
        console.log(err);
    });

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/ai', aiRoutes); // Re-enable this later if needed

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server is breathing at: http://localhost:${PORT}`);
});