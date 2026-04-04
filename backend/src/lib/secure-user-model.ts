import argon2 from "argon2";
import crypto from "crypto";

export type SecureUserRecord = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  webauthnCredentials: WebAuthnCredentialRecord[];
  passwordHash: string;
  passwordResetTokenHash?: string;
  passwordResetExpiresAt?: number;
  createdAt: string;
};

export type WebAuthnCredentialRecord = {
  id: string;
  publicKey: string;
  counter: number;
  transports?: string[];
};

const usersByEmail = new Map<string, SecureUserRecord>();

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(passwordHash: string, candidatePassword: string): Promise<boolean> {
  return argon2.verify(passwordHash, candidatePassword);
}

export function findUserByEmail(email: string): SecureUserRecord | undefined {
  return usersByEmail.get(email.toLowerCase());
}

export function findUserById(id: string): SecureUserRecord | undefined {
  return [...usersByEmail.values()].find((user) => user.id === id);
}

export function createUser(input: {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  passwordHash: string;
}): SecureUserRecord {
  const email = input.email.toLowerCase();
  const user: SecureUserRecord = {
    id: `usr_${Math.random().toString(36).slice(2, 10)}`,
    email,
    firstName: input.firstName,
    lastName: input.lastName,
    roles: input.roles,
    webauthnCredentials: [],
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };

  usersByEmail.set(email, user);
  return user;
}

export function createPasswordResetToken(userId: string, ttlMs = 10 * 60 * 1000) {
  const user = findUserById(userId);
  if (!user) return null;

  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.passwordResetTokenHash = tokenHash;
  user.passwordResetExpiresAt = Date.now() + ttlMs;

  return {
    resetToken,
    tokenHash,
    expiresAt: user.passwordResetExpiresAt,
  };
}

export function findUserByPasswordResetToken(token: string): SecureUserRecord | undefined {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  return [...usersByEmail.values()].find(
    (user) =>
      user.passwordResetTokenHash === tokenHash &&
      typeof user.passwordResetExpiresAt === "number" &&
      user.passwordResetExpiresAt > Date.now(),
  );
}

export function updateUserPassword(userId: string, passwordHash: string): SecureUserRecord | undefined {
  const user = findUserById(userId);
  if (!user) return undefined;

  user.passwordHash = passwordHash;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  return user;
}

export function clearPasswordResetToken(userId: string): SecureUserRecord | undefined {
  const user = findUserById(userId);
  if (!user) return undefined;

  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  return user;
}

export function userHasAnyRole(user: SecureUserRecord, allowedRoles: string[]): boolean {
  return user.roles.some((role) => allowedRoles.includes(role));
}

export function userNeedsPrivilegedStepUp(user: SecureUserRecord): boolean {
  return user.roles.some((role) => role === "host" || role === "admin");
}

export function listWebAuthnCredentials(userId: string): WebAuthnCredentialRecord[] {
  const user = findUserById(userId);
  if (!user) return [];
  return user.webauthnCredentials || [];
}

export function findWebAuthnCredential(
  userId: string,
  credentialId: string,
): WebAuthnCredentialRecord | undefined {
  const user = findUserById(userId);
  if (!user) return undefined;
  return (user.webauthnCredentials || []).find((credential) => credential.id === credentialId);
}

export function upsertWebAuthnCredential(
  userId: string,
  nextCredential: WebAuthnCredentialRecord,
): WebAuthnCredentialRecord | undefined {
  const user = findUserById(userId);
  if (!user) return undefined;

  if (!user.webauthnCredentials) user.webauthnCredentials = [];
  const existingIndex = user.webauthnCredentials.findIndex(
    (credential) => credential.id === nextCredential.id,
  );
  if (existingIndex >= 0) {
    user.webauthnCredentials[existingIndex] = nextCredential;
  } else {
    user.webauthnCredentials.push(nextCredential);
  }
  return nextCredential;
}

export function updateWebAuthnCredentialCounter(
  userId: string,
  credentialId: string,
  counter: number,
): WebAuthnCredentialRecord | undefined {
  const credential = findWebAuthnCredential(userId, credentialId);
  if (!credential) return undefined;
  credential.counter = counter;
  return credential;
}

/**
 * Demo role definitions used when ENABLE_DEMO_FALLBACK is true.
 * Each entry maps a role to a fixed demo email / display name.
 */
const DEMO_ROLE_ACCOUNTS: Array<{
  role: string;
  email: string;
  firstName: string;
  lastName: string;
}> = [
  { role: "host", email: "host@demo.complicore.local", firstName: "Demo", lastName: "Host" },
  { role: "guest", email: "guest@demo.complicore.local", firstName: "Demo", lastName: "Guest" },
  { role: "cleaner", email: "cleaner@demo.complicore.local", firstName: "Demo", lastName: "Cleaner" },
  { role: "maintenance", email: "maintenance@demo.complicore.local", firstName: "Demo", lastName: "Maintenance" },
  { role: "corporate", email: "corporate@demo.complicore.local", firstName: "Demo", lastName: "Corporate" },
  { role: "admin", email: "admin@demo.complicore.local", firstName: "Demo", lastName: "Admin" },
];

/**
 * Seed in-memory demo users, one per role.
 * Should only be called when ENABLE_DEMO_FALLBACK is true (never in production).
 * The shared demo password is taken from the DEMO_PASSWORD env variable; falls
 * back to the literal string "demo-password" if unset.
 */
export async function seedDemoUsers(demoPassword = "demo-password"): Promise<void> {
  const passwordHash = await hashPassword(demoPassword);
  for (const account of DEMO_ROLE_ACCOUNTS) {
    if (!findUserByEmail(account.email)) {
      createUser({
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        roles: [account.role],
        passwordHash,
      });
    }
  }
}
