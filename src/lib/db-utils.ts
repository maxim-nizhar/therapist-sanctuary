import { query } from './db';

// Database utility functions

export interface DatabaseInfo {
  version: string;
  database: string;
  user: string;
  timestamp: string;
}

/**
 * Get basic database information
 */
export async function getDatabaseInfo(): Promise<DatabaseInfo> {
  const result = await query(`
    SELECT 
      version() as version,
      current_database() as database,
      current_user as user,
      NOW() as timestamp
  `);
  
  return result.rows[0];
}

/**
 * Check if a table exists in the database
 */
export async function tableExists(tableName: string): Promise<boolean> {
  const result = await query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    );
  `, [tableName]);
  
  return result.rows[0].exists;
}

/**
 * Get list of all tables in the database
 */
export async function getTables(): Promise<string[]> {
  const result = await query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  
  return result.rows.map(row => row.table_name);
}

/**
 * Execute a raw SQL query (be careful with this!)
 */
export async function executeRawQuery(sql: string, params?: any[]) {
  return await query(sql, params);
}

/**
 * Create a new table (example function)
 */
export async function createUsersTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
}

/**
 * Drop a table (be very careful with this!)
 */
export async function dropTable(tableName: string) {
  await query(`DROP TABLE IF EXISTS ${tableName};`);
}
