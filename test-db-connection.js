import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    // Get the database URL from environment variables
    let dbUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
    
    if (!dbUrl) {
      console.error('❌ Error: DATABASE_URL or NETLIFY_DATABASE_URL environment variable is not set');
      process.exit(1);
    }

    // Log the database URL (masking the password for security)
    const url = new URL(dbUrl);
    const maskedUrl = `${url.protocol}//${url.username}:*****@${url.hostname}${url.pathname}`;
    console.log(`🔗 Connecting to database: ${maskedUrl}`);

    // Create a connection pool
    const sql = neon(dbUrl);
    
    // Test the connection with a simple query
    console.log('🔍 Testing connection...');
    const versionResult = await sql`SELECT version()`;
    console.log('✅ Database connection successful!');
    console.log('📊 Database version:', versionResult);
    
    // List tables
    console.log('\n📋 Listing tables in the database...');
    const tables = await sql`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('\n📂 Tables in the database:');
    if (tables && tables.length > 0) {
      tables.forEach((table, index) => {
        console.log(`  ${index + 1}. ${table.table_name} (${table.table_type})`);
      });
    } else {
      console.log('  No tables found in the database.');
    }
    
    // Check if the required tables exist
    const requiredTables = ['user_scores', 'quizzes', 'questions', 'question_options', 'question_responses'];
    const existingTables = tables.map(t => t.table_name);
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));
    
    if (missingTables.length > 0) {
      console.log('\n⚠️  The following required tables are missing:');
      missingTables.forEach(table => console.log(`  - ${table}`));
      console.log('\n💡 Run the database migrations to create the required tables.');
    } else {
      console.log('\n✅ All required tables exist in the database.');
    }
    
  } catch (error) {
    console.error('\n❌ Error connecting to the database:');
    
    if (error.code) {
      console.error(`  Code: ${error.code}`);
    }
    
    if (error.message) {
      console.error(`  Message: ${error.message}`);
    }
    
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack.split('\n').slice(0, 3).join('\n'));
    }
    
    console.error('\n💡 Troubleshooting tips:');
    console.error('  1. Check if the database URL in .env.local is correct');
    console.error('  2. Verify that the database server is running and accessible');
    console.error('  3. Check if the database user has the correct permissions');
    console.error('  4. Ensure the database name, username, and password are correct');
    
    process.exit(1);
  } finally {
    console.log('\n🏁 Test completed.');
    process.exit(0);
  }
}

// Run the test
testConnection();
