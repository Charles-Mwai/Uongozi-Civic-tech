import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Files and directories to remove
const itemsToRemove = [
    // Redundant database files
    'migrations',
    'DATABASE.md',
    
    // Build artifacts
    'dist',
    'build',
    '.next',
    
    // Redundant scripts
    'build.sh',
    'scripts/apply-migration.js',
    'scripts/check-db.js',
    'scripts/check-db.mjs',
    'scripts/check-db-structure.cjs',
    'scripts/check-migrations-simple.cjs',
    'scripts/db-schema.mjs',
    'scripts/db-test.js',
    'scripts/list-tables.js',
    'scripts/list-tables-summary.js',
    'scripts/reset-db.cjs',
    'scripts/run-neon-migrations.cjs',
    'scripts/setup-db.mjs',
    'scripts/simple-db-check.cjs',
    'scripts/simple-list-tables.js',
    'scripts/simple-migrate.cjs',
    'scripts/test-all.js',
    'scripts/test-connection.cjs',
    'scripts/test-connection.js',
    'scripts/test-connection-simple.ts',
    'scripts/test-db-connection-full.js',
    'scripts/test-with-logging.js',
    
    // Generated files
    'favicon-config.json',
    'generate-favicon.js',
    'generate-og-image.js',
    'netlify/functions/og-image.js'
];

// Files to keep but clean up content
const filesToClean = {
    'package.json': async (content) => {
        const pkg = JSON.parse(content);
        
        // Clean up scripts
        const scriptsToKeep = [
            'test',
            'build',
            'build:functions',
            'start',
            'dev',
            'dev:admin',
            'deploy',
            'db:generate',
            'db:migrate',
            'db:check',
            'db:reset',
            'db:studio'
        ];
        
        const cleanedScripts = {};
        for (const script of scriptsToKeep) {
            if (pkg.scripts && pkg.scripts[script]) {
                cleanedScripts[script] = pkg.scripts[script];
            }
        }
        pkg.scripts = cleanedScripts;
        
        // Clean up dependencies
        const depsToKeep = [
            '@neondatabase/serverless',
            '@netlify/functions',
            '@netlify/neon',
            'drizzle-orm',
            'drizzle-kit',
            'dotenv',
            'typescript',
            'tsx',
            'http-server',
            'netlify-cli'
        ];
        
        pkg.dependencies = filterObject(pkg.dependencies, depsToKeep);
        pkg.devDependencies = filterObject(pkg.devDependencies, [
            ...depsToKeep,
            '@types/node',
            '@types/pg',
            'eslint',
            'eslint-config-next'
        ]);
        
        return JSON.stringify(pkg, null, 2);
    }
};

function filterObject(obj, keysToKeep) {
    if (!obj) return {};
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => keysToKeep.includes(key))
    );
}

async function cleanProject() {
    console.log('🚀 Starting project cleanup...');
    
    // Remove files and directories
    for (const item of itemsToRemove) {
        const fullPath = path.join(rootDir, item);
        try {
            await fs.rm(fullPath, { recursive: true, force: true });
            console.log(`✅ Removed: ${item}`);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error(`❌ Error removing ${item}:`, error.message);
            }
        }
    }
    
    // Clean up files
    for (const [filePath, cleanFn] of Object.entries(filesToClean)) {
        const fullPath = path.join(rootDir, filePath);
        try {
            const content = await fs.readFile(fullPath, 'utf-8');
            const cleanedContent = await cleanFn(content);
            await fs.writeFile(fullPath, cleanedContent);
            console.log(`✅ Cleaned: ${filePath}`);
        } catch (error) {
            console.error(`❌ Error cleaning ${filePath}:`, error.message);
        }
    }
    
    console.log('✨ Project cleanup completed!');
    console.log('Next steps:');
    console.log('1. Run `npm install` to update dependencies');
    console.log('2. Run `npm run dev` to start the development server');
}

cleanProject().catch(console.error);
