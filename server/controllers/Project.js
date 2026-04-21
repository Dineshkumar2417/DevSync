import Project from '../models/Project.js';

// Get all projects for a specific user
export const getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.params.userId });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects" });
    }
};

// Create a new project
export const createProject = async (req, res) => {
    try {
        const { title, description, ownerId } = req.body;
        const newProject = new Project({ 
            title, 
            description, 
            owner: ownerId 
        });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: "Error creating project" });
    }
};

// DELETE a project by ID
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: "Project deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting project" });
    }
};