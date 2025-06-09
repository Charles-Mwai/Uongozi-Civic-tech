import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Additional files to remove
const itemsToRemove = [
    'scripts/test-db-connection-simple.js',
    'scripts/test-db-connection.js',
    'scripts/test-db-connection.ts',
    'scripts/test-db.js',
    'scripts/test-db.mjs',
    'scripts/verify-db.cjs',
    'build.js',
    'windsurf_deployment.yaml'
];

async function cleanRemaining() {
    console.log('🚀 Starting final cleanup...');
    
    for (const item of itemsToRemove) {
        const fullPath = path.join(rootDir, item);
        try {
            await fs.rm(fullPath, { force: true });
            console.log(`✅ Removed: ${item}`);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error(`❌ Error removing ${item}:`, error.message);
            }
        }
    }
    
    console.log('✨ Final cleanup completed!');
}

cleanRemaining().catch(console.error);
