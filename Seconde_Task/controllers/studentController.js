// controllers/studentController.js
const Student = require('../models/Student');

// @desc Get all students and handle search
// @route GET /students
exports.getStudents = async (req, res) => {
  try {
    const { search } = req.query; // Get search term from query

    let students;
    if (search) {
      // Create a search query using the indexed fields
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive
      students = await Student.find({
        $or: [{ name: searchRegex }, { studentId: searchRegex }],
      }).sort({ name: 1 }); // Sort alphabetically

      // Validation Step: Use .explain() to verify index usage in a separate MongoDB shell/tool:
      /*
      db.students.find({
          $or: [{ name: /search_term/i }, { studentId: /search_term/i }]
      }).explain("executionStats")
      // Check that "winningPlan" uses the "studentId_1_name_1" index.
      */

    } else {
      // No search term, get all students
      students = await Student.find().sort({ name: 1 });
    }

    res.render('students/index', { students, search });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// --- CRUD Operations ---

// @desc Display form to create a new student
// @route GET /students/new
exports.newStudentForm = (req, res) => {
  res.render('students/new');
};

// @desc Create a student
// @route POST /students
exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.redirect('/students');
  } catch (error) {
    // Handle validation errors (e.g., studentId not unique)
    console.error(error);
    res.render('students/new', { error: error.message });
  }
};

// @desc Get single student details
// @route GET /students/:id
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');
    res.render('students/show', { student });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// @desc Display form to edit a student
// @route GET /students/:id/edit
exports.editStudentForm = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');
    res.render('students/edit', { student });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// @desc Update a student
// @route POST /students/:id
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).send('Student not found');
    res.redirect(`/students/${student._id}`);
  } catch (error) {
    console.error(error);
    const student = await Student.findById(req.params.id);
    res.render('students/edit', { student, error: error.message });
  }
};

// @desc Delete a student
// @route POST /students/:id/delete
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).send('Student not found');
    res.redirect('/students');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};