const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function generateFavicon() {
  try {
    const publicDir = path.join(__dirname, 'public');
    
    // Create favicon.ico
    const iconSizes = [16, 32, 48, 64];
    const canvas = createCanvas(64, 64);
    const ctx = canvas.getContext('2d');
    
    // Simple favicon with the letter 'U' in a circle
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('U', 32, 32);
    
    const faviconPath = path.join(publicDir, 'favicon.ico');
    const favicon32Path = path.join(publicDir, 'favicon-32x32.png');
    const favicon16Path = path.join(publicDir, 'favicon-16x16.png');
    const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');
    const siteWebmanifestPath = path.join(publicDir, 'site.webmanifest');
    
    // Save favicon.ico
    const ico = require('@fiahfy/ico-convert');
    const pngBuffer = canvas.toBuffer('image/png');
    const icoBuffer = await ico.convert([pngBuffer]);
    fs.writeFileSync(faviconPath, icoBuffer);
    
    // Save other sizes
    const saveImage = (width, height, outputPath) => {
      const sizeCanvas = createCanvas(width, height);
      const sizeCtx = sizeCanvas.getContext('2d');
      sizeCtx.fillStyle = '#4CAF50';
      sizeCtx.beginPath();
      sizeCtx.arc(width/2, height/2, Math.min(width, height)/2 - 2, 0, Math.PI * 2);
      sizeCtx.fill();
      
      sizeCtx.fillStyle = '#FFFFFF';
      sizeCtx.font = `bold ${Math.floor(width/2)}px Arial`;
      sizeCtx.textAlign = 'center';
      sizeCtx.textBaseline = 'middle';
      sizeCtx.fillText('U', width/2, height/2);
      
      const buffer = sizeCanvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);
    };
    
    saveImage(32, 32, favicon32Path);
    saveImage(16, 16, favicon16Path);
    saveImage(180, 180, appleTouchIconPath);
    
    // Create site.webmanifest
    const manifest = {
      "name": "Uongozi Civic Tech",
      "short_name": "Uongozi",
      "icons": [
        {
          "src": "/favicon-32x32.png",
          "sizes": "32x32",
          "type": "image/png"
        },
        {
          "src": "/favicon-16x16.png",
          "sizes": "16x16",
          "type": "image/png"
        },
        {
          "src": "/apple-touch-icon.png",
          "sizes": "180x180",
          "type": "image/png"
        }
      ],
      "theme_color": "#4CAF50",
      "background_color": "#ffffff",
      "display": "standalone"
    };
    
    fs.writeFileSync(siteWebmanifestPath, JSON.stringify(manifest, null, 2));
    
    console.log('Favicon files generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon();
