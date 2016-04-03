var path = require('path');

module.exports = {
    entry: "./scripts/main.js",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.js"
    }
};