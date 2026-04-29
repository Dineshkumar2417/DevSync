import express from 'express';
import Project from '../models/Project.js';
const router = express.Router();

// 1. GET PROJECTS
router.get('/:userId', async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.params.userId });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: "Fetching failed" });
    }
});

// 2. ADD PROJECT (JSON BYPASS - NO MULTER NEEDED)
router.post('/add', async (req, res) => {
    console.log("Incoming Data:", req.body); // Terminal mein check karna
    try {
        const { title, description, githubUrl, liveUrl, status, category, owner } = req.body;
        
        if (!title || !owner) {
            return res.status(400).json({ message: "Title and Owner ID are required" });
        }

        const newProject = new Project({
            title,
            description,
            githubUrl,
            liveUrl,
            status: status || 'Completed',
            category: category || 'Fullstack',
            owner // Ye Dinesh Kumar ki ID honi chahiye
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ message: "Database save failed" });
    }
});

export default router;