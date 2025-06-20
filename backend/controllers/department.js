const Department = require('../models/depatment');

// Create department
exports.createDepartment = async (req, res) => {
    try {
        const { nom, description } = req.body;
        
        const department = await Department.create({
            nom,
            description
        });
        
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
        .sort({ createdAt: -1 });
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single department
exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update department
exports.updateDepartment = async (req, res) => {
    try {
        const { nom, description } = req.body;
        
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { nom, description },
            { new: true }
        );

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};