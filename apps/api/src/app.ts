import { Hono } from "hono";
import type { ServerEnv } from "./env";
import { buildHealthResponse } from "./health";
import { verifyBearer } from "./identity/verify";

export type AppDependencies = {
  probeDatabase: (connectionString: string) => Promise<void>;
};

export function createApp(env: ServerEnv, dependencies: AppDependencies) {
  const app = new Hono();

  app.get("/health", async (c) => {
    const result = await buildHealthResponse(env, dependencies.probeDatabase);
    return c.json(result.body, result.statusCode);
  });

  app.get("/auth/verify", (c) => verifyBearer(c, env));

  app.notFound((c) => c.json({ error: "Not found" }, 404));

  return app;
}
