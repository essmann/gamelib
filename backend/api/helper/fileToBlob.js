const fs = require('fs');


function fileToBlob(filePath) {
    
    const buffer = fs.readFileSync(filePath); // returns a Buffer
    return buffer;
}



module.exports = {fileToBlob};


