const fs = require('fs');
const { Blob } = require('buffer'); // Node 18+ built-in

function fileToBlob(filePath, mimeType = 'application/octet-stream') {
    // Read file from disk
    const buffer = fs.readFileSync(filePath);
    // Create a Blob from the buffer
    return new Blob([buffer], { type: mimeType });
}

module.exports = {fileToBlob};


