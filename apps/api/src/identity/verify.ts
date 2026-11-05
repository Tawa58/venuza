import type { Context } from "hono";
import { firebaseAdminConfigured, type ServerEnv } from "../env";
import { getFirebaseAdminAuth } from "./firebase-admin";

function readBearer(header: string | undefined): string | undefined {
  if (!header) {
    return undefined;
  }
  const [scheme, token, extra] = header.split(" ");
  if (scheme !== "Bearer" || extra !== undefined || !token || token.length === 0) {
    return undefined;
  }
  return token;
}

export async function verifyBearer(c: Context, env: ServerEnv): Promise<Response> {
  const token = readBearer(c.req.header("authorization"));
  if (!token) {
    return c.json({ error: "Missing bearer token" }, 401);
  }
  if (!firebaseAdminConfigured(env)) {
    return c.json({ error: "Firebase Admin is not configured" }, 503);
  }

  try {
    const auth = getFirebaseAdminAuth(env);
    const decoded = await auth.verifyIdToken(token);
    return c.json({ uid: decoded.uid });
  } catch {
    return c.json({ error: "Invalid bearer token" }, 401);
  }
}
