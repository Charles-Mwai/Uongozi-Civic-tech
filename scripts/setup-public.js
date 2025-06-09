import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

// Files to move to public directory
const filesToMove = [
    'index.html',
    'script.js',
    'styles.css'
];

async function setupPublic() {
    console.log('🚀 Setting up public directory...');
    
    try {
        // Ensure public directory exists
        await fs.mkdir(publicDir, { recursive: true });
        
        // Move files to public directory
        for (const file of filesToMove) {
            const source = path.join(rootDir, file);
            const target = path.join(publicDir, file);
            
            try {
                await fs.rename(source, target);
                console.log(`✅ Moved: ${file} to public/`);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.warn(`⚠️  File not found: ${file}`);
                } else {
                    throw error;
                }
            }
        }
        
        console.log('✨ Public directory setup complete!');
        console.log('You can now access the application at http://localhost:3000');
        
    } catch (error) {
        console.error('❌ Error setting up public directory:', error);
        process.exit(1);
    }
}

setupPublic();
