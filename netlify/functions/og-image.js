const { createCanvas } = require('canvas');

// Default values
const WIDTH = 1200;
const HEIGHT = 630; // Standard Open Graph image size
const FONT_FAMILY = 'Arial, sans-serif';

async function generateImage(params) {
    const { name, score, total, percentage } = params;
    
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
    ctx.fillText(`${percentage}%`, WIDTH / 2, HEIGHT / 2);
    
    // User and score details
    ctx.font = `30px ${FONT_FAMILY}`;
    ctx.fillText(`${name}'s Civic Knowledge Score`, WIDTH / 2, HEIGHT / 2 + 100);
    ctx.fillText(`Scored ${score} out of ${total}`, WIDTH / 2, HEIGHT / 2 + 150);
    
    // Website URL
    ctx.font = `20px ${FONT_FAMILY}`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('uongozi-civic.tech', WIDTH / 2, HEIGHT - 50);
    
    return canvas.toBuffer('image/png');
}

// Netlify Function handler
exports.handler = async (event, context) => {
    try {
        const { name = 'User', score = 0, total = 10, percentage } = event.queryStringParameters || {};
        
        // Calculate percentage if not provided
        const scoreNum = parseInt(score) || 0;
        const totalNum = parseInt(total) || 10;
        const percentageNum = percentage ? parseInt(percentage) : Math.round((scoreNum / totalNum) * 100);
        
        const image = await generateImage({
            name: decodeURIComponent(name),
            score: scoreNum,
            total: totalNum,
            percentage: percentageNum
        });
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
            },
            body: image.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error) {
        console.error('Error generating image:', error);
        return {
            statusCode: 500,
            body: 'Error generating image'
        };
    }
};
