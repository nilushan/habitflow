import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Database client configuration
 * Uses postgres.js for connection pooling
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not set. " +
    "Please add it to your .env.local file."
  );
}

// Create postgres client
const client = postgres(connectionString);

// Create Drizzle ORM instance
export const db = drizzle(client, { schema });

// Export schema for use in queries
export { schema };
