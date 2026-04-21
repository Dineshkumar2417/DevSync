import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    githubUrl: { type: String },
    liveUrl: { type: String },
    status: { type: String, default: 'To-Do' },
    priority: { type: String, default: 'Medium' },
    category: { type: String, default: 'Fullstack' },
    tags: [String],
    thumbnail: { type: String, default: '' }, // NEW: Stores Cloudinary URL
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);