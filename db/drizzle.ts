import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/db/schema';
import postgres from 'postgres';

// Load environment variables
import * as dotenv from 'dotenv';

dotenv.config();

let database: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

if (process.env.NODE_ENV === 'production') {
  pg = postgres(process.env.DATABASE_URL!);
  database = drizzle(pg, { schema });
} else {
  if (!(global as any).database!) {
    pg = postgres(process.env.DATABASE_URL!);
    (global as any).database = drizzle(pg, { schema });
  }
  database = (global as any).database;
}

export { database as db, pg };
