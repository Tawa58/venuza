import { healthResponseSchema } from "@venuza/shared";
import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "./app";
import { loadEnv, type ServerEnv } from "./env";

function readError(value: unknown): { error: string; uid?: unknown } {
  assert.ok(value && typeof value === "object");
  assert.equal("uid" in value, false);
  assert.ok("error" in value && typeof value.error === "string");
  return { error: value.error };
}

function env(overrides: Partial<ServerEnv> = {}): ServerEnv {
  return {
    port: 3001,
    databaseUrl: undefined,
    databaseUrlUnpooled: undefined,
    firebaseProjectId: undefined,
    firebaseClientEmail: undefined,
    firebasePrivateKey: undefined,
    r2AccountId: undefined,
    r2AccessKeyId: undefined,
    r2SecretAccessKey: undefined,
    r2BucketName: undefined,
    r2Endpoint: undefined,
    r2PublicBaseUrl: undefined,
    brevoApiKey: undefined,
    brevoSenderEmail: undefined,
    brevoSenderName: undefined,
    paynowIntegrationId: undefined,
    paynowIntegrationKey: undefined,
    expoAccessToken: undefined,
    appPublicUrl: undefined,
    apiPublicUrl: undefined,
    ...overrides,
  };
}

test("loadEnv treats missing optional secrets as unset", () => {
  const loaded = loadEnv({});
  assert.equal(loaded.port, 3001);
  assert.equal(loaded.databaseUrl, undefined);
  assert.equal(loaded.firebasePrivateKey, undefined);
  assert.equal(loaded.r2SecretAccessKey, undefined);
  assert.equal(loaded.brevoApiKey, undefined);
  assert.equal(loaded.paynowIntegrationKey, undefined);
});

test("loadEnv ignores blank values and a bad port", () => {
  const loaded = loadEnv({
    PORT: "nope",
    DATABASE_URL: "   ",
    FIREBASE_PROJECT_ID: " venuza ",
  });
  assert.equal(loaded.port, 3001);
  assert.equal(loaded.databaseUrl, undefined);
  assert.equal(loaded.firebaseProjectId, "venuza");
});

test("GET /health is degraded when DATABASE_URL is unset", async () => {
  const app = createApp(env(), {
    probeDatabase: async () => {
      throw new Error("probe should not run");
    },
  });
  const response = await app.request("/health");
  assert.equal(response.status, 200);
  const body = healthResponseSchema.parse(await response.json());
  assert.equal(body.status, "degraded");
  assert.equal(body.service, "venuza-api");
  assert.equal(body.checks.database.status, "skipped");
  assert.match(body.checks.database.detail, /DATABASE_URL is not set/);
});

test("GET /health reports a failed round-trip without crashing", async () => {
  const app = createApp(env({ databaseUrl: "postgresql://127.0.0.1:5432/venuza" }), {
    probeDatabase: async () => {
      throw new Error("connection refused");
    },
  });
  const response = await app.request("/health");
  assert.equal(response.status, 503);
  const body = healthResponseSchema.parse(await response.json());
  assert.equal(body.status, "degraded");
  assert.equal(body.checks.database.status, "error");
  assert.equal(body.checks.database.detail, "Database round-trip failed");
});

test("GET /health returns ok after a database round-trip", async () => {
  let probed = false;
  const app = createApp(env({ databaseUrl: "postgresql://127.0.0.1:5432/venuza" }), {
    probeDatabase: async () => {
      probed = true;
    },
  });
  const response = await app.request("/health");
  assert.equal(response.status, 200);
  assert.equal(probed, true);
  const body = healthResponseSchema.parse(await response.json());
  assert.equal(body.status, "ok");
  assert.equal(body.checks.database.status, "ok");
});

test("GET /auth/verify rejects a missing bearer token", async () => {
  const app = createApp(env(), { probeDatabase: async () => undefined });
  const response = await app.request("/auth/verify");
  assert.equal(response.status, 401);
  const body = readError(await response.json());
  assert.equal(body.error, "Missing bearer token");
});

test("GET /auth/verify does not claim a token was verified when Admin is unset", async () => {
  const app = createApp(env(), { probeDatabase: async () => undefined });
  const response = await app.request("/auth/verify", {
    headers: { authorization: "Bearer not-a-real-token" },
  });
  assert.equal(response.status, 503);
  const body = readError(await response.json());
  assert.equal(body.error, "Firebase Admin is not configured");
});
