import type { ConfigContext, ExpoConfig } from "expo/config";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function loadExpoPublicEnv(): void {
  const envFile = path.resolve(process.cwd(), "../../.env");
  if (!existsSync(envFile)) {
    return;
  }
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
    if (!key.startsWith("EXPO_PUBLIC_") || process.env[key] !== undefined) {
      continue;
    }
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function glassGlowMain(): string {
  const file = path.resolve(process.cwd(), "../../packages/design-tokens/colors.json");
  const parsed = JSON.parse(readFileSync(file, "utf8")) as { main?: string };
  if (!parsed.main) {
    throw new Error("Glass Glow main color is missing from design tokens");
  }
  return parsed.main;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  loadExpoPublicEnv();
  const main = glassGlowMain();

  return {
    ...config,
    name: "Venuza",
    slug: "venuza",
    scheme: "venuza",
    userInterfaceStyle: "dark",
    android: {
      ...config.android,
      package: "com.venuza.app",
      adaptiveIcon: {
        backgroundColor: main,
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
    },
    ios: {
      ...config.ios,
      bundleIdentifier: "com.venuza.app",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: main,
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  };
};
