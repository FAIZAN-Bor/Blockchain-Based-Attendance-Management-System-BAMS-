const express = require('express');
const router = express.Router();
const BlockchainController = require('../controllers/blockchainController');

// Validate all chains
router.get('/validate', BlockchainController.validateChains);

// Get blockchain explorer data
router.get('/explorer', BlockchainController.getExplorer);

// Get system statistics
router.get('/stats', BlockchainController.getSystemStats);

// Get specific blockchain
router.get('/:type/:id', BlockchainController.getBlockchain);

// Get specific block from a chain
router.get('/:type/:id/block/:blockIndex', BlockchainController.getBlock);

module.exports = router;
