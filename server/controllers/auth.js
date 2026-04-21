import User from '../models/User.js';
import bcrypt from 'bcrypt';

// --- REGISTER LOGIC ---
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists! Try logging in." });
        }

        // 2. HASH THE PASSWORD (Security Step)
        // This turns "123456" into a long, unbreakable string
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and Save the new user with the HASHED password
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword // Save the scrambled version
        });

        await newUser.save();

        res.status(201).json({ message: "Account created successfully! You can now login." });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
};

// --- LOGIN LOGIC ---
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        // 2. COMPARE THE PASSWORDS (Bcrypt Step)
        // We compare the typed password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials. Check your password." });
        }

        // 3. Success!
        res.status(200).json({ 
            message: `Welcome back, ${user.name}!`,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Something went wrong on the server." });
    }
};