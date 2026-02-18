"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().int().positive().default(4000),
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: zod_1.z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_PREVIOUS_SECRET: zod_1.z.string().optional().default(""),
    ALLOWED_ORIGINS: zod_1.z.string().default("http://localhost:3000"),
    ALLOWED_METHODS: zod_1.z.string().default("GET,POST,PATCH,DELETE,PUT,OPTIONS"),
    BODY_LIMIT_BYTES: zod_1.z.coerce.number().int().positive().default(10240),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().int().positive().default(120),
    RATE_LIMIT_WINDOW: zod_1.z.string().default("1 minute"),
    RATE_LIMIT_ALLOWLIST: zod_1.z.string().optional(),
    DB_SSL: zod_1.z
        .string()
        .default("false")
        .transform((v) => v === "true"),
    DB_SSL_REJECT_UNAUTHORIZED: zod_1.z
        .string()
        .default("true")
        .transform((v) => v !== "false"),
    DB_POOL_MAX: zod_1.z.coerce.number().int().positive().default(20),
    DB_IDLE_TIMEOUT_MS: zod_1.z.coerce.number().int().positive().default(30000),
    DB_CONNECT_TIMEOUT_MS: zod_1.z.coerce.number().int().positive().default(5000),
    DB_SLOW_QUERY_THRESHOLD_MS: zod_1.z.coerce.number().int().positive().default(100),
    REDIS_URL: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    ACCESS_TOKEN_COOKIE_NAME: zod_1.z.string().default("cc_access"),
    REFRESH_TOKEN_COOKIE_NAME: zod_1.z.string().default("cc_refresh"),
    COOKIE_DOMAIN: zod_1.z.string().optional(),
    COOKIE_SAME_SITE: zod_1.z.enum(["strict", "lax", "none"]).default("lax"),
    COOKIE_SECURE: zod_1.z
        .string()
        .default("false")
        .transform((v) => v === "true"),
    ACCESS_TOKEN_TTL_SECONDS: zod_1.z.coerce.number().int().positive().default(3600),
    REFRESH_TOKEN_TTL_SECONDS: zod_1.z.coerce.number().int().positive().default(604800),
    EMAIL_USERNAME: zod_1.z.string().default(""),
    EMAIL_PASSWORD: zod_1.z.string().default(""),
    EMAIL_HOST: zod_1.z.string().default("sandbox.smtp.mailtrap.io"),
    EMAIL_PORT: zod_1.z.coerce.number().int().positive().default(2525),
    EMAIL_FROM: zod_1.z.string().email().default("hello@complicore.local"),
    SENDGRID_USERNAME: zod_1.z.string().default(""),
    SENDGRID_PASSWORD: zod_1.z.string().default(""),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().default(""),
    CLOUDINARY_API_KEY: zod_1.z.string().default(""),
    CLOUDINARY_API_SECRET: zod_1.z.string().default(""),
    FIELD_ENCRYPTION_KEY: zod_1.z.string().optional().default(""),
    DATA_EXPORT_LIMIT_PER_MINUTE: zod_1.z.coerce.number().int().positive().default(50),
    HONEYTOKEN_IDS: zod_1.z.string().default(""),
    SIGNED_URL_TTL_SECONDS: zod_1.z.coerce.number().int().positive().default(60),
    WS_ALLOWED_ORIGINS: zod_1.z.string().default("http://localhost:3000"),
    WS_ENABLE_REDIS_ADAPTER: zod_1.z
        .string()
        .default("false")
        .transform((v) => v === "true"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    const fields = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid environment configuration: ${fields}`);
}
exports.env = parsed.data;
