const express = require('express');
const router = express.Router();
const DepartmentController = require('../controllers/departmentController');

// Create department
router.post('/', DepartmentController.createDepartment);

// Get all departments
router.get('/', DepartmentController.getAllDepartments);

// Search departments
router.get('/search', DepartmentController.searchDepartments);

// Get single department
router.get('/:id', DepartmentController.getDepartment);

// Update department
router.put('/:id', DepartmentController.updateDepartment);

// Delete department
router.delete('/:id', DepartmentController.deleteDepartment);

module.exports = router;
