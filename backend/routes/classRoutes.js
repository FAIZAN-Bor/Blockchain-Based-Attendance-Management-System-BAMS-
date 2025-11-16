const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');

// Create class
router.post('/', ClassController.createClass);

// Get all classes (with optional department filter)
router.get('/', ClassController.getAllClasses);

// Search classes
router.get('/search', ClassController.searchClasses);

// Get single class
router.get('/:id', ClassController.getClass);

// Update class
router.put('/:id', ClassController.updateClass);

// Delete class
router.delete('/:id', ClassController.deleteClass);

module.exports = router;
