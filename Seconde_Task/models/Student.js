// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    studentId: { // Use this for indexing and search
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    major: {
        type: String,
        required: true,
    },
    enrollmentDate: {
        type: Date,
        default: Date.now,
    },
});

// IMPORTANT: Create the MongoDB Index for Search
// This index is crucial for the search feature performance.
studentSchema.index({ studentId: 1, name: 1 }); // Compound index for search on ID and Name

module.exports = mongoose.model('Student', studentSchema);