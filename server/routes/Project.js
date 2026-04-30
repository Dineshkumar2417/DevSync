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

// DELETE PROJECT
router.delete('/:projectId', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err });
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