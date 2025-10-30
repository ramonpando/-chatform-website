import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// For query purposes
// Force IPv4 to avoid IPv6 connection issues
const queryClient = postgres(process.env.DATABASE_URL, {
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
