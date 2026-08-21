import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// A connection POOL keeps several open connections to PostgreSQL ready
// to reuse, instead of opening/closing a new connection for every
// request (which would be slow). Every route in this project imports
// this same `pool` and uses pool.query(...) to talk to the database.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
});
