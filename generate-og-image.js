const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create public/images directory if it doesn't exist
const dir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Default values
const WIDTH = 1200;
const HEIGHT = 630; // Standard Open Graph image size
const FONT_FAMILY = 'Arial, sans-serif';

// Create canvas
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// Fill background with gradient
const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
gradient.addColorStop(0, '#3498db');
gradient.addColorStop(1, '#2c3e50');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Add decorative elements
ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(
        Math.random() * WIDTH,
        Math.random() * HEIGHT,
        Math.random() * 5 + 5,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Add text
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Title
ctx.fillStyle = '#ffffff';
ctx.font = `bold 60px ${FONT_FAMILY}`;
ctx.fillText('Uongozi Civic Tech', WIDTH / 2, 150);

// Score
ctx.font = `bold 100px ${FONT_FAMILY}`;
ctx.fillText('Test Your', WIDTH / 2, HEIGHT / 2 - 50);
ctx.fillText('Knowledge!', WIDTH / 2, HEIGHT / 2 + 50);

// Website URL
ctx.font = `20px ${FONT_FAMILY}`;
ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
ctx.fillText('uongozi-civic.tech', WIDTH / 2, HEIGHT - 50);

// Save the image
const out = fs.createWriteStream(path.join(dir, 'og-default.jpg'));
const stream = canvas.createJPEGStream({
    quality: 0.8,
    chromaSubsampling: false
});
stream.pipe(out);

out.on('finish', () => console.log('Default Open Graph image created at public/images/og-default.jpg'));
