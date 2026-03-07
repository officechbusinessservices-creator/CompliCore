/**
 * prisma-user-repo.ts
 *
 * Prisma-backed user store. Exports the same API surface as secure-user-model.ts
 * so the auth controller and webauthn layer can swap the import without other changes.
 *
 * All IDs are surfaced as strings to maintain compatibility with the JWT payload
 * and webauthn challenge store, even though the DB uses integer primary keys.
 */

import argon2 from "argon2";
import crypto from "crypto";
import { prisma } from "./prisma";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WebAuthnCredentialRecord = {
  id: string;
  publicKey: string;
  counter: number;
  transports?: string[];
};

export type UserRecord = {
  id: string; // string representation of DB int id
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  webauthnCredentials: WebAuthnCredentialRecord[];
  passwordHash: string;
  passwordResetTokenHash?: string | null;
  passwordResetExpiresAt?: number | null; // epoch ms
  createdAt: string; // ISO string
};

// Alias kept so webauthn-stepup.ts can import { SecureUserRecord } without changes
export type SecureUserRecord = UserRecord;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function toNumericId(id: string | number): number {
  if (typeof id === "number") return id;
  const n = parseInt(id, 10);
  return Number.isFinite(n) ? n : -1;
}

function mapUser(
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    roles: string[];
    passwordResetTokenHash: string | null;
    passwordResetExpiresAt: Date | null;
    createdAt: Date;
  },
  credentials: Array<{
    id: string;
    publicKey: string;
    counter: number;
    transports: string[];
  }> = [],
): UserRecord {
  return {
    id: String(user.id),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    passwordHash: user.passwordHash,
    roles: user.roles,
    passwordResetTokenHash: user.passwordResetTokenHash ?? null,
    passwordResetExpiresAt: user.passwordResetExpiresAt
      ? user.passwordResetExpiresAt.getTime()
      : null,
    createdAt: user.createdAt.toISOString(),
    webauthnCredentials: credentials.map((c) => ({
      id: c.id,
      publicKey: c.publicKey,
      counter: c.counter,
      transports: c.transports ?? [],
    })),
  };
}

// ---------------------------------------------------------------------------
// Password utilities (re-exported so callers don't need a second import)
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(
  passwordHash: string,
  candidatePassword: string,
): Promise<boolean> {
  return argon2.verify(passwordHash, candidatePassword);
}

// ---------------------------------------------------------------------------
// User CRUD
// ---------------------------------------------------------------------------

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { webauthnCredentials: true },
  });
  if (!user) return undefined;
  return mapUser(user, user.webauthnCredentials);
}

export async function findUserById(id: string | number): Promise<UserRecord | undefined> {
  const numId = toNumericId(id);
  if (numId < 0) return undefined;
  const user = await prisma.user.findUnique({
    where: { id: numId },
    include: { webauthnCredentials: true },
  });
  if (!user) return undefined;
  return mapUser(user, user.webauthnCredentials);
}

export async function createUser(input: {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  passwordHash: string;
}): Promise<UserRecord> {
  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      firstName: input.firstName,
      lastName: input.lastName,
      roles: input.roles,
      passwordHash: input.passwordHash,
    },
    include: { webauthnCredentials: true },
  });
  return mapUser(user, user.webauthnCredentials);
}

// ---------------------------------------------------------------------------
// Password reset
// ---------------------------------------------------------------------------

export async function createPasswordResetToken(
  userId: string | number,
  ttlMs = 10 * 60 * 1000,
) {
  const numId = toNumericId(userId);
  if (numId < 0) return null;

  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expiresAt = new Date(Date.now() + ttlMs);

  await prisma.user.update({
    where: { id: numId },
    data: {
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: expiresAt,
    },
  });

  return {
    resetToken,
    tokenHash,
    expiresAt: expiresAt.getTime(),
  };
}

export async function findUserByPasswordResetToken(
  token: string,
): Promise<UserRecord | undefined> {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await prisma.user.findFirst({
    where: {
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { gt: new Date() },
    },
    include: { webauthnCredentials: true },
  });
  if (!user) return undefined;
  return mapUser(user, user.webauthnCredentials);
}

export async function updateUserPassword(
  userId: string | number,
  passwordHash: string,
): Promise<UserRecord | undefined> {
  const numId = toNumericId(userId);
  if (numId < 0) return undefined;
  const user = await prisma.user.update({
    where: { id: numId },
    data: {
      passwordHash,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
    },
    include: { webauthnCredentials: true },
  });
  return mapUser(user, user.webauthnCredentials);
}

export async function clearPasswordResetToken(
  userId: string | number,
): Promise<UserRecord | undefined> {
  const numId = toNumericId(userId);
  if (numId < 0) return undefined;
  const user = await prisma.user.update({
    where: { id: numId },
    data: {
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
    },
    include: { webauthnCredentials: true },
  });
  return mapUser(user, user.webauthnCredentials);
}

// ---------------------------------------------------------------------------
// Role helpers (sync — no DB call needed, roles are on the loaded record)
// ---------------------------------------------------------------------------

export function userHasAnyRole(user: UserRecord, allowedRoles: string[]): boolean {
  return user.roles.some((role) => allowedRoles.includes(role));
}

export function userNeedsPrivilegedStepUp(user: UserRecord): boolean {
  return user.roles.some((role) => role === "host" || role === "admin");
}

// ---------------------------------------------------------------------------
// WebAuthn credentials
// ---------------------------------------------------------------------------

export async function listWebAuthnCredentials(
  userId: string | number,
): Promise<WebAuthnCredentialRecord[]> {
  const numId = toNumericId(userId);
  if (numId < 0) return [];
  const creds = await prisma.webAuthnCredential.findMany({ where: { userId: numId } });
  return creds.map((c) => ({
    id: c.id,
    publicKey: c.publicKey,
    counter: c.counter,
    transports: c.transports ?? [],
  }));
}

export async function findWebAuthnCredential(
  userId: string | number,
  credentialId: string,
): Promise<WebAuthnCredentialRecord | undefined> {
  const numId = toNumericId(userId);
  if (numId < 0) return undefined;
  const cred = await prisma.webAuthnCredential.findFirst({
    where: { id: credentialId, userId: numId },
  });
  if (!cred) return undefined;
  return {
    id: cred.id,
    publicKey: cred.publicKey,
    counter: cred.counter,
    transports: cred.transports ?? [],
  };
}

export async function upsertWebAuthnCredential(
  userId: string | number,
  nextCredential: WebAuthnCredentialRecord,
): Promise<WebAuthnCredentialRecord | undefined> {
  const numId = toNumericId(userId);
  if (numId < 0) return undefined;
  const cred = await prisma.webAuthnCredential.upsert({
    where: { id: nextCredential.id },
    create: {
      id: nextCredential.id,
      userId: numId,
      publicKey: nextCredential.publicKey,
      counter: nextCredential.counter,
      transports: nextCredential.transports ?? [],
    },
    update: {
      publicKey: nextCredential.publicKey,
      counter: nextCredential.counter,
      transports: nextCredential.transports ?? [],
    },
  });
  return {
    id: cred.id,
    publicKey: cred.publicKey,
    counter: cred.counter,
    transports: cred.transports ?? [],
  };
}

export async function updateWebAuthnCredentialCounter(
  userId: string | number,
  credentialId: string,
  counter: number,
): Promise<WebAuthnCredentialRecord | undefined> {
  const numId = toNumericId(userId);
  if (numId < 0) return undefined;
  try {
    const cred = await prisma.webAuthnCredential.update({
      where: { id: credentialId },
      data: { counter },
    });
    return {
      id: cred.id,
      publicKey: cred.publicKey,
      counter: cred.counter,
      transports: cred.transports ?? [],
    };
  } catch {
    return undefined;
  }
}
