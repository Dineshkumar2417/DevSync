import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // This prevents two people from using the same email
    },
    password: { 
        type: String, 
        required: true 
    }
}, { timestamps: true }); // This adds "Created At" and "Updated At" automatically

const User = mongoose.model('User', userSchema);
export default User;