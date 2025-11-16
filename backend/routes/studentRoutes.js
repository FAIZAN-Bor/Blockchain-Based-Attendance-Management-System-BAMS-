const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');

// Create student
router.post('/', StudentController.createStudent);

// Get all students (with optional filters)
router.get('/', StudentController.getAllStudents);

// Search students
router.get('/search', StudentController.searchStudents);

// Get student's attendance ledger (blockchain)
router.get('/:id/ledger', StudentController.getStudentLedger);

// Get single student
router.get('/:id', StudentController.getStudent);

// Update student
router.put('/:id', StudentController.updateStudent);

// Delete student
router.delete('/:id', StudentController.deleteStudent);

module.exports = router;
