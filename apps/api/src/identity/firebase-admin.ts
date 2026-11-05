import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { firebaseAdminConfigured, type ServerEnv } from "../env";

let cachedAuth: Auth | undefined;

export function getFirebaseAdminAuth(env: ServerEnv): Auth {
  if (cachedAuth) {
    return cachedAuth;
  }
  if (!firebaseAdminConfigured(env)) {
    throw new Error("Firebase Admin is not configured");
  }

  const projectId = env.firebaseProjectId;
  const clientEmail = env.firebaseClientEmail;
  const privateKey = env.firebasePrivateKey;
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin is not configured");
  }

  const existing = getApps()[0];
  const app: App =
    existing ??
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });

  cachedAuth = getAuth(app);
  return cachedAuth;
}
