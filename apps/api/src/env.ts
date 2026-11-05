export type ServerEnv = {
  port: number;
  databaseUrl: string | undefined;
  databaseUrlUnpooled: string | undefined;
  firebaseProjectId: string | undefined;
  firebaseClientEmail: string | undefined;
  firebasePrivateKey: string | undefined;
  r2AccountId: string | undefined;
  r2AccessKeyId: string | undefined;
  r2SecretAccessKey: string | undefined;
  r2BucketName: string | undefined;
  r2Endpoint: string | undefined;
  r2PublicBaseUrl: string | undefined;
  brevoApiKey: string | undefined;
  brevoSenderEmail: string | undefined;
  brevoSenderName: string | undefined;
  paynowIntegrationId: string | undefined;
  paynowIntegrationKey: string | undefined;
  expoAccessToken: string | undefined;
  appPublicUrl: string | undefined;
  apiPublicUrl: string | undefined;
};

function read(source: NodeJS.ProcessEnv, name: string): string | undefined {
  const value = source[name];
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function readPort(source: NodeJS.ProcessEnv): number {
  const raw = read(source, "PORT");
  if (raw === undefined) {
    return 3001;
  }
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return 3001;
  }
  return port;
}

/** The only module that reads server environment variables. */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): ServerEnv {
  return {
    port: readPort(source),
    databaseUrl: read(source, "DATABASE_URL"),
    databaseUrlUnpooled: read(source, "DATABASE_URL_UNPOOLED"),
    firebaseProjectId: read(source, "FIREBASE_PROJECT_ID"),
    firebaseClientEmail: read(source, "FIREBASE_CLIENT_EMAIL"),
    firebasePrivateKey: read(source, "FIREBASE_PRIVATE_KEY"),
    r2AccountId: read(source, "R2_ACCOUNT_ID"),
    r2AccessKeyId: read(source, "R2_ACCESS_KEY_ID"),
    r2SecretAccessKey: read(source, "R2_SECRET_ACCESS_KEY"),
    r2BucketName: read(source, "R2_BUCKET_NAME"),
    r2Endpoint: read(source, "R2_ENDPOINT"),
    r2PublicBaseUrl: read(source, "R2_PUBLIC_BASE_URL"),
    brevoApiKey: read(source, "BREVO_API_KEY"),
    brevoSenderEmail: read(source, "BREVO_SENDER_EMAIL"),
    brevoSenderName: read(source, "BREVO_SENDER_NAME"),
    paynowIntegrationId: read(source, "PAYNOW_INTEGRATION_ID"),
    paynowIntegrationKey: read(source, "PAYNOW_INTEGRATION_KEY"),
    expoAccessToken: read(source, "EXPO_ACCESS_TOKEN"),
    appPublicUrl: read(source, "APP_PUBLIC_URL"),
    apiPublicUrl: read(source, "API_PUBLIC_URL"),
  };
}

export function firebaseAdminConfigured(env: ServerEnv): boolean {
  return Boolean(env.firebaseProjectId && env.firebaseClientEmail && env.firebasePrivateKey);
}
