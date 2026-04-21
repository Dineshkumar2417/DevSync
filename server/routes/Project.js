import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Project from '../models/Project.js';

const router = express.Router();

// 1. Cloudinary Config
cloudinary.config({ 
  cloud_name: 'your_cloud_name', 
  api_key: 'your_api_key', 
  api_secret: 'your_api_secret' 
});

// 2. Multer Memory Storage (Temporary hold)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 3. ADD PROJECT WITH IMAGE
router.post('/add', upload.single('thumbnail'), async (req, res) => {
    try {
        let imageUrl = "";

        // If an image was uploaded, send it to Cloudinary
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const result = await cloudinary.uploader.upload(dataURI, {
                resource_type: "auto",
            });
            imageUrl = result.secure_url;
        }

        const newProject = new Project({
            ...req.body,
            thumbnail: imageUrl,
            owner: req.body.ownerId
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Upload failed" });
    }
});

// 4. GET USER PROJECTS
router.get('/:userId', async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.params.userId });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects" });
    }
});

export default router;