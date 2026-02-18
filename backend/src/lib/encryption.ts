import crypto from "crypto";
import { env } from "./env";

const ALGORITHM = "aes-256-gcm";

function getKey() {
  if (!env.FIELD_ENCRYPTION_KEY) {
    throw new Error("FIELD_ENCRYPTION_KEY is not configured");
  }
  const raw = Buffer.from(env.FIELD_ENCRYPTION_KEY, "base64");
  if (raw.length !== 32) {
    throw new Error("FIELD_ENCRYPTION_KEY must be 32 bytes base64");
  }
  return raw;
}

export function encryptField(plainText: string) {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptField(payload: string) {
  const key = getKey();
  const raw = Buffer.from(payload, "base64");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const data = raw.subarray(28);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
