import { probeDatabase } from "@venuza/database";
import { serve } from "@hono/node-server";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app";
import { loadEnv } from "./env";

const here = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(here, "../../../.env") });

const env = loadEnv();
const app = createApp(env, { probeDatabase });

serve(
  {
    fetch: app.fetch,
    hostname: "0.0.0.0",
    port: env.port,
  },
  (info) => {
    console.log(`Venuza API listening on port ${info.port}`);
  },
);
