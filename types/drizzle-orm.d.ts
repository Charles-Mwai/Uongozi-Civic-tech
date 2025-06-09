declare module 'drizzle-orm/neon-http' {
  import { PgDatabase } from 'drizzle-orm/pg-core';
  import { NeonQueryResultHKT, NeonHttpDatabase } from 'drizzle-orm/neon-http';
  
  export * from 'drizzle-orm/neon-http';
  
  export function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(
    client: any,
    options?: any
  ): NeonHttpDatabase<TSchema>;
}

declare module 'drizzle-orm/neon-http/migrator' {
  import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
  
  export interface MigrateOptions {
    migrationsFolder: string;
  }
  
  export function migrate(
    db: NeonHttpDatabase,
    options: MigrateOptions
  ): Promise<void>;
}
