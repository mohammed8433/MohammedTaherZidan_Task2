// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/auth'); // Import auth middleware

// Apply authentication middleware to all student routes
router.use(protect); 

// @GET /students - List all students and handle search
router.get('/', studentController.getStudents);

// @GET /students/new - Display Create Form
router.get('/new', studentController.newStudentForm);

// @POST /students - Handle form submission for Create
router.post('/', studentController.createStudent);

// @GET /students/:id - Display Single Student Details (Read One)
router.get('/:id', studentController.getStudent);

// @GET /students/:id/edit - Display Edit Form
router.get('/:id/edit', studentController.editStudentForm);

// @POST /students/:id - Handle form submission for Update
router.post('/:id', studentController.updateStudent);

// @POST /students/:id/delete - Handle Delete
router.post('/:id/delete', studentController.deleteStudent);

module.exports = router;