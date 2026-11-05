import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export function createDatabase(connectionString: string) {
  const pool = new Pool({
    connectionString,
    max: 2,
    connectionTimeoutMillis: 4_000,
  });
  const db = drizzle(pool, { schema });
  return { db, pool };
}

export async function probeDatabase(connectionString: string): Promise<void> {
  const { db, pool } = createDatabase(connectionString);
  try {
    await db.execute(sql`select 1`);
  } finally {
    await pool.end();
  }
}
