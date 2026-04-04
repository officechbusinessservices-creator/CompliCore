import crypto from "crypto";
import { env } from "./env";
import { getFieldEncryptionKey } from "./encryption";

export function signPlanUrl(path: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + env.SIGNED_URL_TTL_SECONDS;
  const payload = `${path}.${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", getFieldEncryptionKey())
    .update(payload)
    .digest("hex");
  return `${path}?expires=${expiresAt}&signature=${signature}`;
}
