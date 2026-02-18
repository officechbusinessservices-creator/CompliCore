import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
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
  CLOUDINARY_CLOUD_NAME: z.string().default(""),
  CLOUDINARY_API_KEY: z.string().default(""),
  CLOUDINARY_API_SECRET: z.string().default(""),
  FIELD_ENCRYPTION_KEY: z.string().optional().default(""),
  DATA_EXPORT_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(50),
  HONEYTOKEN_IDS: z.string().default(""),
  SIGNED_URL_TTL_SECONDS: z.coerce.number().int().positive().default(60),
  WS_ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
  WS_ENABLE_REDIS_ADAPTER: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const fields = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
  throw new Error(`Invalid environment configuration: ${fields}`);
}

export const env = parsed.data;
