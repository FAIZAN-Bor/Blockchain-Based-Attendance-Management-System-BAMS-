const Block = require('./Block');

class Blockchain {
  constructor(type, parentHash = null, metadata = {}) {
    this.type = type; // 'department', 'class', 'student'
    this.chain = [];
    this.metadata = metadata;
    this.createGenesisBlock(parentHash);
  }

  /**
   * Create genesis block
   * For department: prevHash is '0'
   * For class: prevHash is parent department's latest hash
   * For student: prevHash is parent class's latest hash
   */
  createGenesisBlock(parentHash) {
    const genesisTransaction = {
      type: 'genesis',
      chainType: this.type,
      metadata: this.metadata,
      timestamp: Date.now()
    };
    
    const genesisBlock = new Block(
      0,
      Date.now(),
      [genesisTransaction],
      parentHash || '0'
    );
    
    genesisBlock.mineBlock();
    this.chain.push(genesisBlock);
  }

  /**
   * Get the latest block in the chain
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Add a new block to the chain
   */
  addBlock(transactions) {
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      transactions,
      this.getLatestBlock().hash
    );
    
    newBlock.mineBlock();
    this.chain.push(newBlock);
    return newBlock;
  }

  /**
   * Validate the entire blockchain
   * Check:
   * 1. Each block's hash is correctly calculated
   * 2. Each block's prevHash matches previous block's hash
   * 3. PoW is valid (hash starts with '0000')
   */
  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Recalculate hash
      const recalculatedHash = currentBlock.calculateHash();
      if (currentBlock.hash !== recalculatedHash) {
        console.log(`Invalid hash at block ${i}`);
        return false;
      }

      // Check if prevHash matches
      if (currentBlock.prevHash !== previousBlock.hash) {
        console.log(`Invalid prevHash at block ${i}`);
        return false;
      }

      // Check PoW (must start with 0000)
      if (!currentBlock.hash.startsWith('0000')) {
        console.log(`Invalid PoW at block ${i}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get all blocks in the chain
   */
  getAllBlocks() {
    return this.chain;
  }

  /**
   * Get chain statistics
   */
  getChainStats() {
    return {
      type: this.type,
      length: this.chain.length,
      metadata: this.metadata,
      latestHash: this.getLatestBlock().hash,
      isValid: this.isValid()
    };
  }

  /**
   * Find the latest active state by iterating through blocks
   * Used for CRUD - newer blocks override older ones
   */
  getLatestState() {
    let state = { ...this.metadata };
    
    for (let i = 1; i < this.chain.length; i++) {
      const block = this.chain[i];
      const transactions = block.transactions;
      
      for (const tx of transactions) {
        if (tx.status === 'deleted') {
          state.deleted = true;
          state.deletedAt = tx.timestamp;
        } else if (tx.type === 'update') {
          state = { ...state, ...tx.updates };
          state.updatedAt = tx.timestamp;
        }
      }
    }
    
    return state;
  }
}

module.exports = Blockchain;
