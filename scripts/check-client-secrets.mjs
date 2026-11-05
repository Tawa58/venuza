import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const forbidden = [
  "FIREBASE_PRIVATE_KEY",
  "DATABASE_URL_UNPOOLED",
  "DATABASE_URL",
  "R2_SECRET_ACCESS_KEY",
  "BREVO_API_KEY",
  "PAYNOW_INTEGRATION_KEY",
];

const roots = ["apps/web", "apps/mobile"];
const skipDirectories = new Set(["node_modules", ".next", ".expo", "dist", "web-build", "android", "ios"]);
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".json"]);

async function walk(directory, hits) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirectories.has(entry.name)) {
      continue;
    }
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, hits);
      continue;
    }
    if (!extensions.has(path.extname(entry.name))) {
      continue;
    }
    const text = await readFile(fullPath, "utf8");
    for (const name of forbidden) {
      if (text.includes(name)) {
        hits.push(`${fullPath}: ${name}`);
      }
    }
  }
}

const hits = [];
for (const root of roots) {
  await walk(path.resolve(root), hits);
}

if (hits.length > 0) {
  console.error("Client source contains server secret names:");
  for (const hit of hits) {
    console.error(hit);
  }
  process.exit(1);
}

console.log("Client source does not contain the Phase 1 server secret names.");
