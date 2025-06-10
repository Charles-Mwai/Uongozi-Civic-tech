import pg from 'pg';
const { Client } = pg;

async function testConnection() {
  console.log('🔍 Testing PostgreSQL connection...');
  
  const config = {
    user: 'neondb_owner',
    host: 'ep-twilight-mouse-a5c41gnh-pooler.us-east-2.aws.neon.tech',
    database: 'neondb',
    password: 'npg_Wk8adJAq7vXf',
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  };

  const client = new Client(config);

  try {
    console.log('🔄 Connecting to database...');
    await client.connect();
    console.log('✅ Successfully connected to the database');
    
    // Test query
    const res = await client.query('SELECT version()');
    console.log('📊 Database version:', res.rows[0].version);
    
    // List tables
    const tablesRes = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📂 Tables in the database:');
    if (tablesRes.rows.length > 0) {
      tablesRes.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.table_name} (${row.table_type})`);
      });
    } else {
      console.log('  No tables found in the database.');
    }
    
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    console.error('Error details:', {
      code: err.code,
      hint: err.hint,
      position: err.position
    });
    
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Verify the database credentials are correct');
    console.log('2. Check if the database server is running and accessible');
    console.log('3. Ensure the database user has the correct permissions');
    console.log('4. Check if your IP is whitelisted in the database firewall');
    
  } finally {
    await client.end();
    console.log('\n🏁 Connection closed');
  }
}

// Run the test
testConnection().catch(console.error);
