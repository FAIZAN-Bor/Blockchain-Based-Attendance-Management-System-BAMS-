const blockchainManager = require('../blockchain/BlockchainManager');

class ClassController {
  // Create new class
  static createClass(req, res) {
    try {
      const { id, name, departmentId, semester, section } = req.body;
      
      if (!id || !name || !departmentId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      const blockchain = blockchainManager.createClass({ 
        id, 
        name, 
        departmentId, 
        semester, 
        section 
      });
      
      res.status(201).json({
        success: true,
        message: 'Class created successfully',
        data: {
          id,
          name,
          departmentId,
          semester,
          section,
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

  // Get all classes (optionally filter by department)
  static getAllClasses(req, res) {
    try {
      const { departmentId } = req.query;
      const classes = blockchainManager.getAllClasses(departmentId);
      
      res.status(200).json({
        success: true,
        count: classes.length,
        data: classes
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get single class
  static getClass(req, res) {
    try {
      const { id } = req.params;
      const chain = blockchainManager.getClass(id);
      
      if (!chain) {
        return res.status(404).json({ 
          success: false, 
          message: 'Class not found' 
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

  // Update class
  static updateClass(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const chain = blockchainManager.updateClass(id, updates);
      const state = chain.getLatestState();
      
      res.status(200).json({
        success: true,
        message: 'Class updated successfully',
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

  // Delete class
  static deleteClass(req, res) {
    try {
      const { id } = req.params;
      
      const chain = blockchainManager.deleteClass(id);
      
      res.status(200).json({
        success: true,
        message: 'Class marked as deleted',
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

  // Search classes
  static searchClasses(req, res) {
    try {
      const { query, departmentId } = req.query;
      
      if (!query) {
        return res.status(400).json({ 
          success: false, 
          message: 'Search query required' 
        });
      }

      const results = blockchainManager.searchClasses(query, departmentId);
      
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
}

module.exports = ClassController;
