import crypto from "crypto";
import { DecryptCommand, KMSClient } from "@aws-sdk/client-kms";
import { env } from "./env";

const ALGORITHM = "aes-256-gcm";
const REQUIRED_KEY_BYTES = 32;

let cachedKey: Buffer | null = null;
let initPromise: Promise<void> | null = null;

function ensureKeyLength(raw: Buffer, source: string) {
  if (raw.length !== REQUIRED_KEY_BYTES) {
    throw new Error(`${source} must decode to ${REQUIRED_KEY_BYTES} bytes`);
  }
  return raw;
}

function decodePlainFieldKey() {
  const plain = env.FIELD_ENCRYPTION_KEY.trim();
  if (!plain) return null;
  return ensureKeyLength(Buffer.from(plain, "base64"), "FIELD_ENCRYPTION_KEY");
}

function parseKmsEncryptionContext() {
  const rawContext = env.KMS_ENCRYPTION_CONTEXT_JSON.trim();
  if (!rawContext) return undefined;

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawContext);
  } catch {
    throw new Error("KMS_ENCRYPTION_CONTEXT_JSON must be valid JSON");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("KMS_ENCRYPTION_CONTEXT_JSON must be a JSON object");
  }

  const normalized = Object.entries(parsed as Record<string, unknown>).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (typeof value !== "string") {
        throw new Error("KMS_ENCRYPTION_CONTEXT_JSON values must be strings");
      }
      acc[key] = value;
      return acc;
    },
    {},
  );

  return normalized;
}

async function decryptKmsEnvelopeFieldKey() {
  const encrypted = env.FIELD_ENCRYPTION_KEY_ENCRYPTED_B64.trim();
  if (!encrypted) return null;

  const kms = new KMSClient({
    region: env.KMS_REGION || undefined,
    endpoint: env.KMS_ENDPOINT || undefined,
  });

  const decrypted = await kms.send(
    new DecryptCommand({
      CiphertextBlob: Buffer.from(encrypted, "base64"),
      EncryptionContext: parseKmsEncryptionContext(),
    }),
  );

  const plaintext = decrypted.Plaintext ? Buffer.from(decrypted.Plaintext as Uint8Array) : null;
  if (!plaintext) {
    throw new Error("KMS returned empty plaintext for FIELD_ENCRYPTION_KEY_ENCRYPTED_B64");
  }
  return ensureKeyLength(plaintext, "FIELD_ENCRYPTION_KEY_ENCRYPTED_B64");
}

async function resolveKeyMaterial() {
  const fromKms = await decryptKmsEnvelopeFieldKey();
  if (fromKms) {
    cachedKey = fromKms;
    return;
  }

  const plain = decodePlainFieldKey();
  cachedKey = plain;
}

export async function initializeFieldEncryptionKey() {
  if (!initPromise) {
    initPromise = resolveKeyMaterial();
  }
  await initPromise;
}

function getKey() {
  if (!cachedKey && !env.FIELD_ENCRYPTION_KEY_ENCRYPTED_B64.trim()) {
    const plain = decodePlainFieldKey();
    if (plain) cachedKey = plain;
  }

  if (!cachedKey) {
    throw new Error("Field encryption key material is not initialized");
  }
  return cachedKey;
}

export function isFieldEncryptionEnabled() {
  if (cachedKey) return true;
  try {
    if (env.FIELD_ENCRYPTION_KEY.trim()) {
      cachedKey = decodePlainFieldKey();
    }
  } catch {
    return false;
  }
  return cachedKey !== null;
}

export function getFieldEncryptionKey() {
  return Buffer.from(getKey());
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
