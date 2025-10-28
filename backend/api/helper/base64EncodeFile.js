const fs = require('fs');

function base64EncodeFile(filePath) {
    const data = fs.readFileSync(filePath);   // Buffer
    return data.toString('base64');           // Convert to Base64 string
}

module.exports = { base64EncodeFile };
