const TokenGenerator = require('uuid-token-generator');

const token = new TokenGenerator(); // Default is a 128-bit token encoded in base58

module.exports = token;