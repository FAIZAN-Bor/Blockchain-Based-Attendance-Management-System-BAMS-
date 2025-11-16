const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/attendanceController');

// Mark attendance for single student
router.post('/mark', AttendanceController.markAttendance);

// Mark attendance for multiple students
router.post('/mark-bulk', AttendanceController.markBulkAttendance);

// Get today's attendance (with optional filters)
router.get('/today', AttendanceController.getTodayAttendance);

// Get student's attendance history
router.get('/student/:studentId', AttendanceController.getStudentAttendance);

// Get class attendance summary
router.get('/class/:classId/summary', AttendanceController.getClassAttendanceSummary);

// Get department attendance summary
router.get('/department/:departmentId/summary', AttendanceController.getDepartmentAttendanceSummary);

module.exports = router;
