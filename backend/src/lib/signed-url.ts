import crypto from "crypto";
import { env } from "./env";

export function signPlanUrl(path: string) {
  if (!env.FIELD_ENCRYPTION_KEY) {
    throw new Error("FIELD_ENCRYPTION_KEY is not configured");
  }
  const expiresAt = Math.floor(Date.now() / 1000) + env.SIGNED_URL_TTL_SECONDS;
  const payload = `${path}.${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", Buffer.from(env.FIELD_ENCRYPTION_KEY, "base64"))
    .update(payload)
    .digest("hex");
  return `${path}?expires=${expiresAt}&signature=${signature}`;
}
