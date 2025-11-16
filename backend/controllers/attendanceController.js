const blockchainManager = require('../blockchain/BlockchainManager');

class AttendanceController {
  // Mark attendance for a student
  static markAttendance(req, res) {
    try {
      const { studentId, status } = req.body;
      
      if (!studentId || !status) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      if (!['present', 'absent', 'leave'].includes(status.toLowerCase())) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid status. Must be: present, absent, or leave' 
        });
      }

      const transaction = blockchainManager.markAttendance(
        studentId, 
        status.toLowerCase()
      );
      
      res.status(201).json({
        success: true,
        message: 'Attendance marked successfully',
        data: transaction
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Mark attendance for multiple students
  static markBulkAttendance(req, res) {
    try {
      const { attendanceList } = req.body;
      
      if (!Array.isArray(attendanceList) || attendanceList.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'attendanceList must be a non-empty array' 
        });
      }

      const results = [];
      const errors = [];

      attendanceList.forEach(item => {
        try {
          const transaction = blockchainManager.markAttendance(
            item.studentId, 
            item.status.toLowerCase()
          );
          results.push(transaction);
        } catch (error) {
          errors.push({
            studentId: item.studentId,
            error: error.message
          });
        }
      });
      
      res.status(201).json({
        success: true,
        message: `Attendance marked for ${results.length} students`,
        data: results,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get today's attendance for class or department
  static getTodayAttendance(req, res) {
    try {
      const { classId, departmentId } = req.query;
      
      const attendance = blockchainManager.getTodayAttendance(classId, departmentId);
      
      res.status(200).json({
        success: true,
        date: new Date().toISOString().split('T')[0],
        count: attendance.length,
        data: attendance
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get student's complete attendance history
  static getStudentAttendance(req, res) {
    try {
      const { studentId } = req.params;
      
      const attendance = blockchainManager.getStudentAttendance(studentId);
      
      // Calculate statistics
      const stats = {
        total: attendance.length,
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        leave: attendance.filter(a => a.status === 'leave').length
      };
      
      stats.percentage = stats.total > 0 
        ? ((stats.present / stats.total) * 100).toFixed(2) 
        : 0;
      
      res.status(200).json({
        success: true,
        studentId,
        statistics: stats,
        data: attendance
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get attendance summary for a class
  static getClassAttendanceSummary(req, res) {
    try {
      const { classId } = req.params;
      
      const students = blockchainManager.getAllStudents(classId);
      const summary = students.map(student => {
        const attendance = blockchainManager.getStudentAttendance(student.id);
        
        const stats = {
          total: attendance.length,
          present: attendance.filter(a => a.status === 'present').length,
          absent: attendance.filter(a => a.status === 'absent').length,
          leave: attendance.filter(a => a.status === 'leave').length
        };
        
        stats.percentage = stats.total > 0 
          ? ((stats.present / stats.total) * 100).toFixed(2) 
          : 0;
        
        return {
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          statistics: stats
        };
      });
      
      res.status(200).json({
        success: true,
        classId,
        totalStudents: students.length,
        data: summary
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get attendance summary for a department
  static getDepartmentAttendanceSummary(req, res) {
    try {
      const { departmentId } = req.params;
      
      const students = blockchainManager.getAllStudents(null, departmentId);
      const summary = students.map(student => {
        const attendance = blockchainManager.getStudentAttendance(student.id);
        
        const stats = {
          total: attendance.length,
          present: attendance.filter(a => a.status === 'present').length,
          absent: attendance.filter(a => a.status === 'absent').length,
          leave: attendance.filter(a => a.status === 'leave').length
        };
        
        stats.percentage = stats.total > 0 
          ? ((stats.present / stats.total) * 100).toFixed(2) 
          : 0;
        
        return {
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          classId: student.classId,
          statistics: stats
        };
      });
      
      res.status(200).json({
        success: true,
        departmentId,
        totalStudents: students.length,
        data: summary
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = AttendanceController;
