const blockchainManager = require('../blockchain/BlockchainManager');

class DepartmentController {
  // Create new department
  static createDepartment(req, res) {
    try {
      const { id, name, code } = req.body;
      
      if (!id || !name || !code) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      const blockchain = blockchainManager.createDepartment({ id, name, code });
      
      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: {
          id,
          name,
          code,
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

  // Get all departments
  static getAllDepartments(req, res) {
    try {
      const departments = blockchainManager.getAllDepartments();
      
      res.status(200).json({
        success: true,
        count: departments.length,
        data: departments
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get single department
  static getDepartment(req, res) {
    try {
      const { id } = req.params;
      const chain = blockchainManager.getDepartment(id);
      
      if (!chain) {
        return res.status(404).json({ 
          success: false, 
          message: 'Department not found' 
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

  // Update department (adds new block)
  static updateDepartment(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const chain = blockchainManager.updateDepartment(id, updates);
      const state = chain.getLatestState();
      
      res.status(200).json({
        success: true,
        message: 'Department updated successfully',
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

  // Delete department (adds delete block)
  static deleteDepartment(req, res) {
    try {
      const { id } = req.params;
      
      const chain = blockchainManager.deleteDepartment(id);
      
      res.status(200).json({
        success: true,
        message: 'Department marked as deleted',
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

  // Search departments
  static searchDepartments(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ 
          success: false, 
          message: 'Search query required' 
        });
      }

      const results = blockchainManager.searchDepartments(query);
      
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

module.exports = DepartmentController;
