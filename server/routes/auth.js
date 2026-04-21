import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs'; // Bcrypt import karna mat bhulna

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// GET user details
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "User not found" });
    }
});

// UPDATE user details (Name & Password)
router.put('/user/:id', async (req, res) => {
    try {
        const { name, password } = req.body;
        const updateData = {};
        
        if (name) updateData.name = name;
        
        // Agar naya password aaya hai, toh use hash karo
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true }
        ).select('-password');
        
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
});

export default router;