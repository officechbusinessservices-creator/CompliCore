import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  PUBLIC_API_BASE_URL: z.string().url().or(z.literal("")).default(""),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_PREVIOUS_SECRET: z.string().optional().default(""),
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
  ALLOWED_METHODS: z.string().default("GET,POST,PATCH,DELETE,PUT,OPTIONS"),
  BODY_LIMIT_BYTES: z.coerce.number().int().positive().default(10240),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  RATE_LIMIT_WINDOW: z.string().default("1 minute"),
  RATE_LIMIT_ALLOWLIST: z.string().optional(),
  DB_SSL: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  DB_SSL_REJECT_UNAUTHORIZED: z
    .string()
    .default("true")
    .transform((v) => v !== "false"),
  DB_POOL_MAX: z.coerce.number().int().positive().default(20),
  DB_IDLE_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
  DB_CONNECT_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  DB_SLOW_QUERY_THRESHOLD_MS: z.coerce.number().int().positive().default(100),
  REDIS_URL: z.string().url().optional().or(z.literal("")),
  ACCESS_TOKEN_COOKIE_NAME: z.string().default("cc_access"),
  REFRESH_TOKEN_COOKIE_NAME: z.string().default("cc_refresh"),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SAME_SITE: z.enum(["strict", "lax", "none"]).default("lax"),
  COOKIE_SECURE: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(3600),
  REFRESH_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(604800),
  EMAIL_USERNAME: z.string().default(""),
  EMAIL_PASSWORD: z.string().default(""),
  EMAIL_HOST: z.string().default("sandbox.smtp.mailtrap.io"),
  EMAIL_PORT: z.coerce.number().int().positive().default(2525),
  EMAIL_FROM: z.string().email().default("hello@complicore.local"),
  SENDGRID_USERNAME: z.string().default(""),
  SENDGRID_PASSWORD: z.string().default(""),
  PUBLIC_WEB_BASE_URL: z.string().url().or(z.literal("")).default(""),
  LIFECYCLE_EMAILS_ENABLED: z
    .string()
    .default("true")
    .transform((v) => v === "true"),
  LIFECYCLE_EMAIL_TICK_MS: z.coerce.number().int().positive().default(60000),
  TRIAL_DURATION_DAYS: z.coerce.number().int().positive().default(14),
  CLOUDINARY_CLOUD_NAME: z.string().default(""),
  CLOUDINARY_API_KEY: z.string().default(""),
  CLOUDINARY_API_SECRET: z.string().default(""),
  FIELD_ENCRYPTION_KEY: z.string().optional().default(""),
  FIELD_ENCRYPTION_KEY_ENCRYPTED_B64: z.string().optional().default(""),
  KMS_REGION: z.string().optional().default(""),
  KMS_ENDPOINT: z.string().url().or(z.literal("")).default(""),
  KMS_ENCRYPTION_CONTEXT_JSON: z.string().optional().default(""),
  SECURITY_AUDIT_LOG_PATH: z.string().default(""),
  SECURITY_SIEM_EXPORT_URL: z.string().url().or(z.literal("")).default(""),
  SECURITY_SIEM_AUTH_TOKEN: z.string().optional().default(""),
  SECURITY_SIEM_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  SECURITY_ALERT_FAILED_LOGIN_THRESHOLD: z.coerce.number().int().positive().default(8),
  SECURITY_ALERT_RBAC_DENY_THRESHOLD: z.coerce.number().int().positive().default(20),
  SECURITY_ALERT_WINDOW_SECONDS: z.coerce.number().int().positive().default(600),
  AUTH_MAX_FAILED_ATTEMPTS: z.coerce.number().int().positive().default(5),
  AUTH_LOCKOUT_WINDOW_SECONDS: z.coerce.number().int().positive().default(900),
  AUTH_LOCKOUT_DURATION_SECONDS: z.coerce.number().int().positive().default(900),
  LOGIN_IMPOSSIBLE_TRAVEL_WINDOW_SECONDS: z.coerce.number().int().positive().default(3600),
  WEBAUTHN_MFA_ENABLED: z
    .string()
    .default("true")
    .transform((v) => v === "true"),
  WEBAUTHN_RP_NAME: z.string().default("CompliCore"),
  WEBAUTHN_RP_ID: z.string().default("localhost"),
  WEBAUTHN_ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
  WEBAUTHN_CHALLENGE_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  MFA_STEP_UP_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  PMS_WEBHOOK_SECRET: z.string().default(""),
  DATA_EXPORT_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(50),
  STRIPE_SECRET_KEY: z.string().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().default(""),
  HONEYTOKEN_IDS: z.string().default(""),
  SIGNED_URL_TTL_SECONDS: z.coerce.number().int().positive().default(60),
  WS_ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
  WS_ENABLE_REDIS_ADAPTER: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  ENABLE_DEMO_FALLBACK: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const fields = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
  throw new Error(`Invalid environment configuration: ${fields}`);
}

if (parsed.data.NODE_ENV === "production" && parsed.data.ENABLE_DEMO_FALLBACK) {
  throw new Error("Invalid environment configuration: ENABLE_DEMO_FALLBACK must be false in production");
}

if (parsed.data.NODE_ENV === "production" && !parsed.data.PMS_WEBHOOK_SECRET.trim()) {
  throw new Error("Invalid environment configuration: PMS_WEBHOOK_SECRET is required in production");
}

if (parsed.data.FIELD_ENCRYPTION_KEY_ENCRYPTED_B64.trim() && !parsed.data.KMS_REGION.trim()) {
  throw new Error(
    "Invalid environment configuration: KMS_REGION is required when FIELD_ENCRYPTION_KEY_ENCRYPTED_B64 is set",
  );
}

export const env = parsed.data;
