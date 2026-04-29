import express from 'express';
import Project from '../models/Project.js';
const router = express.Router();

// 1. CREATE PROJECT
router.post('/add', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: "Creation failed" });
    }
});

// 2. UPDATE PROJECT
router.put('/update/:id', async (req, res) => {
    try {
        const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

// 3. GET PROJECTS BY USER ID (YE JAROORI THA RENDERING KE LIYE)
router.get('/:userId', async (req, res) => {
    try {
        // Dhyaan de: Database mein field name 'owner' hai ya 'ownerId', wahi yaha likhna
        const projects = await Project.find({ owner: req.params.userId });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: "Fetching failed" });
    }
});

export default router;