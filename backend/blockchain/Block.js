const crypto = require('crypto');

class Block {
  constructor(index, timestamp, transactions, prevHash = '', nonce = 0) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  /**
   * Calculate SHA-256 hash of the block
   * Includes: timestamp, transactions, prevHash, nonce
   */
  calculateHash() {
    const data = 
      this.timestamp + 
      JSON.stringify(this.transactions) + 
      this.prevHash + 
      this.nonce;
    
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Proof of Work - Mine block until hash starts with '0000'
   */
  mineBlock(difficulty = 4) {
    const target = '0'.repeat(difficulty);
    
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    
    console.log(`Block mined: ${this.hash}`);
  }
}

module.exports = Block;
