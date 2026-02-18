"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = buildServer;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const listings_1 = __importDefault(require("./routes/listings"));
const payments_1 = __importDefault(require("./routes/payments"));
const messages_1 = __importDefault(require("./routes/messages"));
const properties_1 = __importDefault(require("./routes/properties"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const ai_1 = __importDefault(require("./routes/ai"));
const pms_1 = __importDefault(require("./routes/pms"));
const pms_connectors_1 = __importDefault(require("./routes/pms-connectors"));
const modules_1 = __importDefault(require("./routes/modules"));
dotenv_1.default.config();
async function buildServer() {
    const fastify = (0, fastify_1.default)({
        logger: {
            level: "info",
            redact: {
                paths: [
                    "req.headers.authorization",
                    "req.headers.cookie",
                    "req.body.password",
                    "req.body.accessToken",
                    "req.body.refreshToken",
                    "req.body.token",
                ],
                remove: true,
            },
        },
    });
    await fastify.register(cors_1.default, { origin: true });
    await fastify.register(helmet_1.default, {
        contentSecurityPolicy: false,
    });
    await fastify.register(rate_limit_1.default, {
        max: Number(process.env.RATE_LIMIT_MAX || 120),
        timeWindow: process.env.RATE_LIMIT_WINDOW || "1 minute",
    });
    await fastify.register(jwt_1.default, { secret: process.env.JWT_SECRET || "dev-secret" });
    fastify.get("/", async () => ({ status: "ok", service: "complicore-backend" }));
    fastify.get("/health", async () => ({ status: "ok" }));
    fastify.get("/health/ready", async () => ({ status: "ready" }));
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.status(401).send({ error: "unauthorized" });
        }
    });
    fastify.decorate("requireRole", async function (request, reply, roles) {
        try {
            await request.jwtVerify();
            const userRoles = request.user?.roles || ["guest"];
            if (!roles.some((r) => userRoles.includes(r))) {
                return reply.status(403).send({ error: "forbidden" });
            }
        }
        catch (err) {
            return reply.status(401).send({ error: "unauthorized" });
        }
    });
    await fastify.register(auth_1.default, { prefix: "/api" });
    await fastify.register(users_1.default, { prefix: "/api" });
    await fastify.register(bookings_1.default, { prefix: "/api" });
    await fastify.register(listings_1.default, { prefix: "/api" });
    await fastify.register(payments_1.default, { prefix: "/api" });
    await fastify.register(messages_1.default, { prefix: "/api" });
    await fastify.register(properties_1.default, { prefix: "/api" });
    await fastify.register(reviews_1.default, { prefix: "/api" });
    await fastify.register(analytics_1.default, { prefix: "/api" });
    await fastify.register(ai_1.default, { prefix: "/api" });
    await fastify.register(pms_1.default, { prefix: "/api" });
    await fastify.register(pms_connectors_1.default, { prefix: "/api" });
    await fastify.register(modules_1.default, { prefix: "/api" });
    await fastify.register(auth_1.default, { prefix: "/v1" });
    await fastify.register(users_1.default, { prefix: "/v1" });
    await fastify.register(bookings_1.default, { prefix: "/v1" });
    await fastify.register(listings_1.default, { prefix: "/v1" });
    await fastify.register(payments_1.default, { prefix: "/v1" });
    await fastify.register(messages_1.default, { prefix: "/v1" });
    await fastify.register(properties_1.default, { prefix: "/v1" });
    await fastify.register(reviews_1.default, { prefix: "/v1" });
    await fastify.register(analytics_1.default, { prefix: "/v1" });
    await fastify.register(ai_1.default, { prefix: "/v1" });
    await fastify.register(pms_1.default, { prefix: "/v1" });
    await fastify.register(pms_connectors_1.default, { prefix: "/v1" });
    await fastify.register(modules_1.default, { prefix: "/v1" });
    return fastify;
}
