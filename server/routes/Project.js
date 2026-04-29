import express from 'express';
import Project from '../models/Project.js';
const router = express.Router();

// 1. CREATE PROJECT (Matches /api/projects/add)
router.post('/add', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: "Creation failed" });
    }
});

// 2. UPDATE PROJECT (Matches /api/projects/update/:id)
router.put('/update/:id', async (req, res) => {
    try {
        const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

export default router;