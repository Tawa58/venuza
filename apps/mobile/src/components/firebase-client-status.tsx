import { useEffect, useState } from "react";
import { Text } from "react-native";
import { getFirebaseAuth } from "@/lib/firebase";

type Status = "checking" | "ready" | "unset";

export function FirebaseClientStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    try {
      setStatus(getFirebaseAuth() ? "ready" : "unset");
    } catch {
      setStatus("unset");
    }
  }, []);

  const label =
    status === "ready"
      ? "Firebase client initialised"
      : status === "unset"
        ? "Firebase public config is not set"
        : "Checking Firebase client config";

  return <Text className="mt-6 text-sm text-muted">{label}</Text>;
}
