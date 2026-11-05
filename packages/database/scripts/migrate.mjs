import { spawnSync } from "node:child_process";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
config({ path: path.resolve(packageRoot, "../../.env") });

if (!process.env.DATABASE_URL_UNPOOLED) {
  console.error("DATABASE_URL_UNPOOLED is not set. The migration was not applied.");
  process.exit(1);
}

const result = spawnSync("pnpm", ["exec", "drizzle-kit", "migrate"], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
