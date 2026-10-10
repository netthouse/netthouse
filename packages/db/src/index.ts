import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://netthouse:netthouse_local@localhost:5432/netthouse";

export const client = postgres(connectionString);
export const db = drizzle(client, { schema });
export * from "./schema.js";
export * from "./ledger.js";