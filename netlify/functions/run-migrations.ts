import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';
import { promises as fs } from 'fs';
import path from 'path';

// Type for migration result
interface MigrationResult {
  success: boolean;
  message: string;
  appliedMigrations?: string[];
  error?: string;
}

export const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Verify the request has a valid authorization header
  const authHeader = event.headers.authorization || '';
  const expectedToken = process.env.MIGRATION_TOKEN || 'default-secret-token';
  
  if (!authHeader.startsWith('Bearer ') || 
      authHeader.split(' ')[1] !== expectedToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    const sql = neon();
    const migrationsDir = path.join(process.cwd(), 'migrations');
    
    // Get all migration files
    const files = (await fs.readdir(migrationsDir))
      .filter(file => file.endsWith('.sql') && file.match(/^\d+_.+\.sql$/))
      .sort();
    
    if (files.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No migration files found' }),
      };
    }
    
    // Ensure migrations table exists
    await sql`
      CREATE TABLE IF NOT EXISTS public._migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        success BOOLEAN NOT NULL DEFAULT true
      );
    `;
    
    // Get already applied migrations
    const appliedMigrations = await sql`
      SELECT name FROM public._migrations WHERE success = true;
    `;
    
    const appliedMigrationNames = new Set(appliedMigrations.map(m => m.name));
    const appliedMigrationsList: string[] = [];
    
    // Apply each migration
    for (const file of files) {
      if (appliedMigrationNames.has(file)) {
        console.log(`Skipping already applied migration: ${file}`);
        continue;
      }
      
      const filePath = path.join(migrationsDir, file);
      const sqlContent = await fs.readFile(filePath, 'utf8');
      
      try {
        // Start transaction
        await sql.unsafe('BEGIN');
        
        try {
          // Execute the migration
          await sql.unsafe(sqlContent);
          
          // Record the migration
          await sql`
            INSERT INTO public._migrations (name, success, executed_at)
            VALUES (${file}, true, NOW())
            ON CONFLICT (name) 
            DO UPDATE SET success = true, executed_at = NOW();
          `;
          
          // Commit transaction
          await sql.unsafe('COMMIT');
          
          appliedMigrationsList.push(file);
          console.log(`✅ Applied migration: ${file}`);
          
        } catch (txError) {
          // Rollback transaction on error
          await sql.unsafe('ROLLBACK');
          console.error(`❌ Transaction error in migration ${file}:`, txError);
          
          // Record the failure
          await sql`
            INSERT INTO public._migrations (name, success, executed_at)
            VALUES (${file}, false, NOW())
            ON CONFLICT (name) 
            DO UPDATE SET success = false, executed_at = NOW();
          `;
          
          throw txError;
        }
        
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error applying migration ${file}:`, errorMessage);
        throw error;
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Migrations completed successfully',
        appliedMigrations: appliedMigrationsList,
      }),
    };
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error running migrations:', errorMessage);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Failed to run migrations',
        error: errorMessage,
        appliedMigrations: []
      })
    };
  }
};

// For local testing
if (process.env.NETLIFY_DEV) {
  const runLocalMigrations = async () => {
    try {
      const { config } = await import('dotenv');
      config({ path: '.env.local' });
      
      const event = { 
        httpMethod: 'POST',
        headers: { 
          authorization: `Bearer ${process.env.MIGRATION_TOKEN || 'default-secret-token'}` 
        } 
      };
      
      const result = await handler(event as any, {} as any);
      console.log('Migration result:', result);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Migration error:', errorMessage);
    }
  };
  
  // Run migrations when this file is executed directly
  if (require.main === module) {
    runLocalMigrations();
  }
}
