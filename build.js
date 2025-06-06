const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Starting build process ===');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
const imagesDir = path.join(publicDir, 'images');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate default OG image if it doesn't exist
const ogImagePath = path.join(imagesDir, 'og-default.jpg');
if (!fs.existsSync(ogImagePath)) {
  console.log('Generating default OG image...');
  try {
    require('./generate-og-image.js');
    console.log('OG image generated successfully');
  } catch (error) {
    console.warn('Warning: Failed to generate default OG image', error.message);
  }
}

console.log('=== Build completed successfully ===');
