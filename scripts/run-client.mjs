import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const serverOnlyNames = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_ENDPOINT",
  "R2_PUBLIC_BASE_URL",
  "BREVO_API_KEY",
  "BREVO_SENDER_EMAIL",
  "BREVO_SENDER_NAME",
  "PAYNOW_INTEGRATION_ID",
  "PAYNOW_INTEGRATION_KEY",
  "EXPO_ACCESS_TOKEN",
  "APP_PUBLIC_URL",
  "API_PUBLIC_URL",
];

const prefix = process.argv[2];
const command = process.argv.slice(3);

if (!prefix || command.length === 0) {
  console.error("Usage: node scripts/run-client.mjs <PUBLIC_PREFIX_> --filter <app> <script>");
  process.exit(1);
}

const env = { ...process.env };
for (const name of serverOnlyNames) {
  delete env[name];
}

const envFile = path.resolve(process.cwd(), ".env");
if (existsSync(envFile)) {
  const text = readFileSync(envFile, "utf8");
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith("#")) {
      continue;
    }
    const separator = line.indexOf("=");
    if (separator === -1) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    if (!key.startsWith(prefix)) {
      continue;
    }
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
}

const child = spawn("pnpm", command, {
  stdio: "inherit",
  env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
