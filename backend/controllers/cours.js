const Cours = require('../models/cours');


// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const { title, class: classId, author } = req.body;

        const courseData = {
            title,
            class: classId,
            author
        };
        console.log('FILES:', req.files);


        // Handle file uploads
        if (req.files && req.files['attachement']) {
            courseData.attachement = req.files['attachement'][0].filename;
        }

        const course = await Cours.create(courseData);
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Cours.find()
            .sort({ createdAt: -1 })
            .populate('class')
            .populate('author', 'nom prenom');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// get by class     
exports.getCoursesByClass = async (req, res) => {
    try {
        const classId = req.params.classId;
        const courses = await Cours.find({ class: classId }).populate('author', 'fullname');
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this class' });
        }
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Get course by ID author (formateur)     
exports.getCoursesByAuthor = async (req, res) => {
    try {
        const authorId = req.params.authorId;
        const courses = await Cours.find({ author: authorId }).populate('class');
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this user' });
        }
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Cours.findById(req.params.id).populate('class').populate('author', 'nom prenom');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update course    
exports.updateCourse = async (req, res) => {
    try {
        const { title, class: classId, author } = req.body;
        const updateData = { title, class: classId, author };

        // Handle file uploads
        if (req.files) {
            if (req.files['attachement']) {
                updateData.attachement = req.files['attachement'][0].filename;
            }
        }

        const course = await Cours.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Delete course    
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Cours.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   