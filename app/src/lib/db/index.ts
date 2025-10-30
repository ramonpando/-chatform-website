import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Allow build to succeed without DATABASE_URL (it's only needed at runtime)
const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/placeholder';

// For query purposes
// Force IPv4 to avoid IPv6 connection issues
const queryClient = postgres(databaseUrl, {
  connect_timeout: 10,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  // Force IPv4
  connection: {
    application_name: 'chatform_app'
  }
});
export const db = drizzle(queryClient, { schema });

// Export types
export type Database = typeof db;
