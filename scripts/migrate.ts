import "dotenv/config";

import { getDb } from "../src/lib/db";

async function main() {
  const db = getDb();
  const { migrate } = await import("drizzle-orm/neon-http/migrator");

  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
