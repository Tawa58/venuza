import { healthResponseSchema, type HealthResponse } from "@venuza/shared";
import type { ServerEnv } from "./env";

export async function buildHealthResponse(
  env: ServerEnv,
  probeDatabase: (connectionString: string) => Promise<void>,
): Promise<{ body: HealthResponse; statusCode: 200 | 503 }> {
  if (!env.databaseUrl) {
    return {
      statusCode: 200,
      body: healthResponseSchema.parse({
        status: "degraded",
        service: "venuza-api",
        checks: {
          database: {
            status: "skipped",
            detail: "DATABASE_URL is not set",
          },
        },
      }),
    };
  }

  try {
    await probeDatabase(env.databaseUrl);
    return {
      statusCode: 200,
      body: healthResponseSchema.parse({
        status: "ok",
        service: "venuza-api",
        checks: {
          database: {
            status: "ok",
            detail: "Database round-trip succeeded",
          },
        },
      }),
    };
  } catch {
    return {
      statusCode: 503,
      body: healthResponseSchema.parse({
        status: "degraded",
        service: "venuza-api",
        checks: {
          database: {
            status: "error",
            detail: "Database round-trip failed",
          },
        },
      }),
    };
  }
}
