import express from 'express';
import Project from '../models/Project.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// 🔥 CLOUDINARY CONFIGURATION 🔥
// Inhe apne dashboard se replace kar lo
cloudinary.config({ 
  cloud_name: 'dlgxcysrt', 
  api_key: 'APNI_API_KEY_YAHAN_DALO', 
  api_secret: 'APNA_API_SECRET_YAHAN_DALO' 
});

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'devsync_projects',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

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

// 2. ADD PROJECT (With Cloudinary Image)
router.post('/add', upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, description, githubUrl, liveUrl, status, category, owner } = req.body;
        
        // Agar image aayi hai toh Cloudinary ka secure URL milega
        const imageUrl = req.file ? req.file.path : "";

        const newProject = new Project({
            title,
            description,
            githubUrl,
            liveUrl,
            status: status || 'Completed',
            category: category || 'Fullstack',
            owner,
            thumbnail: imageUrl // Ab asli Cloudinary link database mein jayega
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        console.error("Cloudinary Save Error:", err);
        res.status(500).json({ message: "Upload failed" });
    }
});

// 3. EDIT PROJECT
router.put('/:projectId', upload.single('thumbnail'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.thumbnail = req.file.path;
        }

        const project = await Project.findByIdAndUpdate(req.params.projectId, updateData, { new: true });
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

// 4. DELETE PROJECT
router.delete('/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.projectId);
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

export default router;