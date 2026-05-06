import express from 'express';
import Project from '../models/Project.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

cloudinary.config({ 
  cloud_name: 'dlgxcysrt', 
  api_key: '481515562155775', 
  api_secret: '**********' 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'devsync_projects',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

router.get('/:userId', async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.params.userId });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: "Fetching failed" });
    }
});

router.post('/add', upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, description, githubUrl, liveUrl, status, category, owner } = req.body;
        
        // 🔥 YAHAN HAI ASLI LINK 🔥
        const imageUrl = req.file ? req.file.path : "";

        const newProject = new Project({
            title,
            description,
            githubUrl,
            liveUrl,
            status: status || 'Completed',
            category: category || 'Fullstack',
            owner,
            thumbnail: imageUrl 
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
});

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

router.delete('/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.projectId);
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

export default router;