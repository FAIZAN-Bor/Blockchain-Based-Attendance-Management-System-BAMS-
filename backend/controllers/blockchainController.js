const blockchainManager = require('../blockchain/BlockchainManager');

class BlockchainController {
  // Validate all blockchain chains
  static validateChains(req, res) {
    try {
      const validation = blockchainManager.validateAllChains();
      
      res.status(200).json({
        success: true,
        message: validation.overallValid 
          ? 'All chains are valid' 
          : 'Some chains are invalid',
        data: validation
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get blockchain explorer data
  static getExplorer(req, res) {
    try {
      const { type } = req.query; // 'department', 'class', 'student', or 'all'
      
      let explorerData;
      
      switch(type) {
        case 'department':
          explorerData = { departments: blockchainManager.getDepartmentExplorerData() };
          break;
        case 'class':
          explorerData = { classes: blockchainManager.getClassExplorerData() };
          break;
        case 'student':
          explorerData = { students: blockchainManager.getStudentExplorerData() };
          break;
        default:
          explorerData = blockchainManager.getBlockchainExplorer();
      }
      
      res.status(200).json({
        success: true,
        data: explorerData
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get specific blockchain by ID
  static getBlockchain(req, res) {
    try {
      const { type, id } = req.params;
      
      let chain;
      
      switch(type) {
        case 'department':
          chain = blockchainManager.getDepartment(id);
          break;
        case 'class':
          chain = blockchainManager.getClass(id);
          break;
        case 'student':
          chain = blockchainManager.getStudent(id);
          break;
        default:
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid chain type' 
          });
      }
      
      if (!chain) {
        return res.status(404).json({ 
          success: false, 
          message: 'Chain not found' 
        });
      }

      res.status(200).json({
        success: true,
        data: {
          type,
          id,
          metadata: chain.metadata,
          blocks: chain.getAllBlocks(),
          stats: chain.getChainStats(),
          isValid: chain.isValid()
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get system statistics
  static getSystemStats(req, res) {
    try {
      const stats = blockchainManager.getSystemStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get specific block from a chain
  static getBlock(req, res) {
    try {
      const { type, id, blockIndex } = req.params;
      
      let chain;
      
      switch(type) {
        case 'department':
          chain = blockchainManager.getDepartment(id);
          break;
        case 'class':
          chain = blockchainManager.getClass(id);
          break;
        case 'student':
          chain = blockchainManager.getStudent(id);
          break;
        default:
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid chain type' 
          });
      }
      
      if (!chain) {
        return res.status(404).json({ 
          success: false, 
          message: 'Chain not found' 
        });
      }

      const blocks = chain.getAllBlocks();
      const block = blocks[parseInt(blockIndex)];
      
      if (!block) {
        return res.status(404).json({ 
          success: false, 
          message: 'Block not found' 
        });
      }

      res.status(200).json({
        success: true,
        data: block
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = BlockchainController;
