#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Blob } = require('buffer');

async function main() {
    const [,, inputPath, outputPath] = process.argv;

    if (!inputPath) {
        console.error('Usage: node img-to-blob.js <input-image> [output-file]');
        process.exit(1);
    }

    const absolutePath = path.resolve(inputPath);
    if (!fs.existsSync(absolutePath)) {
        console.error('File does not exist:', absolutePath);
        process.exit(1);
    }

    const buffer = fs.readFileSync(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();
    let mimeType = 'application/octet-stream';

    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.webp') mimeType = 'image/webp';

    const blob = new Blob([buffer], { type: mimeType });

    console.log('Blob created:');
    console.log('Size:', blob.size, 'bytes');
    console.log('Type:', blob.type);

    if (outputPath) {
        const outBuffer = Buffer.from(await blob.arrayBuffer());
        fs.writeFileSync(path.resolve(outputPath), outBuffer);
        console.log('Saved blob to:', outputPath);
    }
}

main();
