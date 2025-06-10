import { neon } from '@neondatabase/serverless';

// Direct connection string with your credentials
const connectionString = 'postgresql://neondb_owner:npg_1kjUoEmwpDe2@ep-twilight-mouse-a5c41gnh-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function testNeonConnection() {
  console.log('🔗 Testing Neon database connection...');
  
  try {
    // Create a connection pool
    const sql = neon(connectionString);
    
    // Test the connection with a simple query
    console.log('🔍 Running test query...');
    const result = await sql`SELECT version() AS version`;
    
    console.log('✅ Connection successful!');
    console.log('📊 Database version:', result[0].version);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    if (error.hint) {
      console.error('Hint:', error.hint);
    }
    
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Verify the database credentials are correct');
    console.error('2. Check if the database server is running and accessible');
    console.error('3. Ensure the database user has the correct permissions');
    console.error('4. Try connecting with a different client (like pgAdmin or DBeaver)');
    
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the test
testNeonConnection();
