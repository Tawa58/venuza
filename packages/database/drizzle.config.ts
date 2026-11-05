import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(packageRoot, "../../.env") });

const unpooled = process.env.DATABASE_URL_UNPOOLED;

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: unpooled && unpooled.length > 0 ? unpooled : "postgresql://127.0.0.1:5432/venuza",
  },
});
