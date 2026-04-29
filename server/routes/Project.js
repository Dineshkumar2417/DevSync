import express from 'express';
import Project from '../models/Project.js';
const router = express.Router();

// 1. GET PROJECTS (Jo abhi chal raha hai)
router.get('/:userId', async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.params.userId });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: "Fetching failed" });
    }
});

// 2. ADD PROJECT (Fix for 500 Error)
router.post('/add', async (req, res) => {
    try {
        // Agar aap image upload nahi kar rahe toh simple body save hogi
        const newProject = new Project({
            ...req.body,
            owner: req.body.owner // Ensure owner field is mapped correctly
        });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        console.error("Add Project Error:", err);
        res.status(500).json({ message: "Backend failed to save project" });
    }
});

export default router;