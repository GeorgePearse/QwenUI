const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@images': path.resolve(__dirname, 'images')
    }
  }
};