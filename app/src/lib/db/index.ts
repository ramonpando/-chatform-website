import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Allow build to succeed without DATABASE_URL (it's only needed at runtime)
const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/placeholder';

// For query purposes
// Configure postgres client to avoid IPv6 issues
const queryClient = postgres(databaseUrl, {
  connect_timeout: 10,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  max: 10,
  // Force IPv4 by using connection options
  connection: {
    application_name: 'chatform_app',
  },
  // SSL configuration for Supabase
  ssl: 'require',
  // Use fetch mode to avoid connection pooling issues
  fetch_types: false,
  // Prepare statements
  prepare: false,
});
export const db = drizzle(queryClient, { schema });

// Export types
export type Database = typeof db;
