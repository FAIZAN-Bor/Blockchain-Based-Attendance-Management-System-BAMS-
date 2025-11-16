const blockchainManager = require('../blockchain/BlockchainManager');

class StudentController {
  // Create new student
  static createStudent(req, res) {
    try {
      const { id, name, rollNumber, departmentId, classId, email } = req.body;
      
      if (!id || !name || !rollNumber || !departmentId || !classId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      const blockchain = blockchainManager.createStudent({ 
        id, 
        name, 
        rollNumber, 
        departmentId, 
        classId,
        email 
      });
      
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: {
          id,
          name,
          rollNumber,
          departmentId,
          classId,
          email,
          chainStats: blockchain.getChainStats()
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get all students (optionally filter by class or department)
  static getAllStudents(req, res) {
    try {
      const { classId, departmentId } = req.query;
      const students = blockchainManager.getAllStudents(classId, departmentId);
      
      res.status(200).json({
        success: true,
        count: students.length,
        data: students
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get single student
  static getStudent(req, res) {
    try {
      const { id } = req.params;
      const chain = blockchainManager.getStudent(id);
      
      if (!chain) {
        return res.status(404).json({ 
          success: false, 
          message: 'Student not found' 
        });
      }

      const state = chain.getLatestState();
      
      res.status(200).json({
        success: true,
        data: {
          id,
          ...state,
          chainStats: chain.getChainStats(),
          blocks: chain.getAllBlocks()
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Update student
  static updateStudent(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const chain = blockchainManager.updateStudent(id, updates);
      const state = chain.getLatestState();
      
      res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: {
          id,
          ...state,
          chainStats: chain.getChainStats()
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Delete student
  static deleteStudent(req, res) {
    try {
      const { id } = req.params;
      
      const chain = blockchainManager.deleteStudent(id);
      
      res.status(200).json({
        success: true,
        message: 'Student marked as deleted',
        data: {
          id,
          chainStats: chain.getChainStats()
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Search students
  static searchStudents(req, res) {
    try {
      const { query, classId, departmentId } = req.query;
      
      if (!query) {
        return res.status(400).json({ 
          success: false, 
          message: 'Search query required' 
        });
      }

      const results = blockchainManager.searchStudents(query, classId, departmentId);
      
      res.status(200).json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get student's attendance ledger (blockchain)
  static getStudentLedger(req, res) {
    try {
      const { id } = req.params;
      const attendance = blockchainManager.getStudentAttendance(id);
      const chain = blockchainManager.getStudent(id);
      
      if (!chain) {
        return res.status(404).json({ 
          success: false, 
          message: 'Student not found' 
        });
      }

      res.status(200).json({
        success: true,
        studentId: id,
        totalRecords: attendance.length,
        chainStats: chain.getChainStats(),
        attendance: attendance
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = StudentController;
