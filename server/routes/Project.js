import express from 'express';
import Project from '../models/Project.js';
import multer from 'multer';

const router = express.Router();

// Multer Setup (Memory storage use kar rahe hain taaki image handling asaan ho)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 1. GET PROJECTS
router.get('/:userId', async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.params.userId });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: "Fetching failed" });
    }
});

// 2. ADD PROJECT (Ab Multer image aur text dono handle karega)
router.post('/add', upload.single('thumbnail'), async (req, res) => {
    console.log("Incoming Body:", req.body); 
    
    try {
        const { title, description, githubUrl, liveUrl, status, category, owner } = req.body;
        
        if (!title || !owner) {
            return res.status(400).json({ message: "Title and Owner ID are required" });
        }

        // Agar image aayi hai toh hum abhi ke liye placeholder link ya buffer use kar sakte hain
        // Note: Production mein Cloudinary use karna chahiye, abhi hum image link manually ya default rakh rahe hain
        const thumbnail = req.file ? "https://via.placeholder.com/400x200?text=Project+Image" : "";

        const newProject = new Project({
            title,
            description,
            githubUrl,
            liveUrl,
            status: status || 'Completed',
            category: category || 'Fullstack',
            owner,
            thumbnail: thumbnail // Model mein thumbnail field honi chahiye
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ message: "Database save failed" });
    }
});

// 3. EDIT/UPDATE PROJECT (Jo 404 aa raha tha, wo isse fix hoga)
router.put('/:projectId', upload.single('thumbnail'), async (req, res) => {
    try {
        const updatedData = { ...req.body };
        const project = await Project.findByIdAndUpdate(req.params.projectId, updatedData, { new: true });
        
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

// DELETE PROJECT
router.delete('/:projectId', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

export default router;