import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import type { UserRecord } from "./prisma-user-repo";
import {
  findWebAuthnCredential,
  listWebAuthnCredentials,
  updateWebAuthnCredentialCounter,
  upsertWebAuthnCredential,
} from "./prisma-user-repo";
import { env } from "./env";

// Re-export the type alias so any code that imported SecureUserRecord from here keeps working
export type { UserRecord as SecureUserRecord } from "./prisma-user-repo";

type ChallengePurpose = "registration" | "authentication";

type ChallengeRecord = {
  challenge: string;
  expiresAtMs: number;
};

type StoredCredential = {
  id: string;
  publicKey: Uint8Array;
  counter: number;
  transports?: string[];
};

const challengeStore = new Map<string, ChallengeRecord>();

function challengeStoreKey(userId: string, purpose: ChallengePurpose) {
  return `${purpose}:${userId}`;
}

function allowedOrigins() {
  return env.WEBAUTHN_ALLOWED_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function storeChallenge(userId: string, purpose: ChallengePurpose, challenge: string) {
  challengeStore.set(challengeStoreKey(userId, purpose), {
    challenge,
    expiresAtMs: Date.now() + env.WEBAUTHN_CHALLENGE_TTL_SECONDS * 1000,
  });
}

function consumeChallenge(userId: string, purpose: ChallengePurpose) {
  const key = challengeStoreKey(userId, purpose);
  const record = challengeStore.get(key);
  challengeStore.delete(key);
  if (!record) return null;
  if (Date.now() > record.expiresAtMs) return null;
  return record.challenge;
}

async function decodeStoredCredential(
  userId: string,
  credentialId: string,
): Promise<StoredCredential | null> {
  const stored = await findWebAuthnCredential(userId, credentialId);
  if (!stored) return null;

  try {
    const decodedPublicKey = Buffer.from(stored.publicKey, "base64");
    return {
      id: stored.id,
      publicKey: Uint8Array.from(decodedPublicKey),
      counter: stored.counter,
      transports: stored.transports,
    };
  } catch {
    return null;
  }
}

export function isWebAuthnMfaEnabled() {
  return env.WEBAUTHN_MFA_ENABLED;
}

export async function hasWebAuthnCredentials(userId: string) {
  const creds = await listWebAuthnCredentials(userId);
  return creds.length > 0;
}

export function isStepUpSatisfied(payload: Record<string, unknown> | null | undefined) {
  if (!payload || payload.stepUpRequired !== true) return true;
  const verifiedAt = Number(payload.stepUpVerifiedAt || 0);
  if (!Number.isFinite(verifiedAt) || verifiedAt <= 0) return false;
  const ageSeconds = Math.floor(Date.now() / 1000) - verifiedAt;
  return ageSeconds <= env.MFA_STEP_UP_TTL_SECONDS;
}

export async function createRegistrationOptionsForUser(user: UserRecord) {
  const existingCreds = await listWebAuthnCredentials(user.id);
  const excludeCredentials = existingCreds.map((credential) => ({
    id: credential.id,
    transports: credential.transports as any,
  }));

  const options = await generateRegistrationOptions({
    rpName: env.WEBAUTHN_RP_NAME,
    rpID: env.WEBAUTHN_RP_ID,
    userName: user.email,
    userID: Buffer.from(user.id, "utf8"),
    userDisplayName: `${user.firstName} ${user.lastName}`.trim(),
    excludeCredentials,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "required",
    },
  });

  storeChallenge(user.id, "registration", options.challenge);
  return options;
}

export async function verifyRegistrationForUser(user: UserRecord, response: RegistrationResponseJSON) {
  const challenge = consumeChallenge(user.id, "registration");
  if (!challenge) {
    return { verified: false as const, reason: "registration challenge expired or missing" };
  }

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: allowedOrigins(),
    expectedRPID: env.WEBAUTHN_RP_ID,
    requireUserVerification: true,
  });

  if (!verification.verified || !verification.registrationInfo) {
    return { verified: false as const, reason: "registration response verification failed" };
  }

  const credential = verification.registrationInfo.credential;
  const transports = Array.isArray(response.response.transports)
    ? [...response.response.transports]
    : [];

  await upsertWebAuthnCredential(user.id, {
    id: credential.id,
    publicKey: Buffer.from(credential.publicKey).toString("base64"),
    counter: credential.counter,
    transports,
  });

  return {
    verified: true as const,
    credentialId: credential.id,
  };
}

export async function createAuthenticationOptionsForUser(user: UserRecord) {
  const credentials = await listWebAuthnCredentials(user.id);
  if (credentials.length === 0) {
    return null;
  }

  const options = await generateAuthenticationOptions({
    rpID: env.WEBAUTHN_RP_ID,
    allowCredentials: credentials.map((credential) => ({
      id: credential.id,
      transports: credential.transports as any,
    })),
    userVerification: "required",
  });

  storeChallenge(user.id, "authentication", options.challenge);
  return options;
}

export async function verifyAuthenticationForUser(
  user: UserRecord,
  response: AuthenticationResponseJSON,
) {
  const challenge = consumeChallenge(user.id, "authentication");
  if (!challenge) {
    return { verified: false as const, reason: "authentication challenge expired or missing" };
  }

  const credential = await decodeStoredCredential(user.id, response.id);
  if (!credential) {
    return { verified: false as const, reason: "unknown authenticator credential" };
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: allowedOrigins(),
    expectedRPID: env.WEBAUTHN_RP_ID,
    credential: credential as any,
    requireUserVerification: true,
  });

  if (!verification.verified) {
    return { verified: false as const, reason: "authentication response verification failed" };
  }

  await updateWebAuthnCredentialCounter(
    user.id,
    verification.authenticationInfo.credentialID,
    verification.authenticationInfo.newCounter,
  );

  return {
    verified: true as const,
    credentialId: verification.authenticationInfo.credentialID,
    newCounter: verification.authenticationInfo.newCounter,
  };
}
