"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const zod_1 = require("zod");
const validation_1 = require("../lib/validation");
const auth_controller_1 = require("../controllers/auth-controller");
const usernameSchema = zod_1.z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only include letters, numbers, and underscore");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    firstName: zod_1.z.string().min(1).max(80),
    lastName: zod_1.z.string().min(1).max(80),
    username: usernameSchema.optional(),
    role: zod_1.z.enum(["guest", "host", "enterprise", "admin"]).optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    role: zod_1.z.enum(["guest", "host", "enterprise", "admin"]).optional(),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10, "refreshToken is required").optional(),
});
const forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
const resetPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
async function authRoutes(fastify) {
    const authController = (0, auth_controller_1.createAuthController)(fastify);
    fastify.post("/auth/register", async (request, reply) => {
        const parsed = registerSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid register payload",
                errors: (0, validation_1.formatZodError)(parsed.error),
                instance: request.url,
                traceId: request.id,
            });
        }
        return authController.signup(request, reply, parsed.data);
    });
    fastify.post("/auth/login", async (request, reply) => {
        const parsed = loginSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid login payload",
                errors: (0, validation_1.formatZodError)(parsed.error),
                instance: request.url,
                traceId: request.id,
            });
        }
        return authController.login(request, reply, parsed.data);
    });
    fastify.post("/auth/refresh", async (request, reply) => {
        const parsed = refreshSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid refresh payload",
                errors: (0, validation_1.formatZodError)(parsed.error),
                instance: request.url,
                traceId: request.id,
            });
        }
        return authController.refresh(request, reply, parsed.data.refreshToken);
    });
    fastify.post("/auth/logout", async (_request, reply) => {
        return authController.logout(reply);
    });
    fastify.post("/auth/forgot-password", async (request, reply) => {
        const parsed = forgotPasswordSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid forgot-password payload",
                errors: (0, validation_1.formatZodError)(parsed.error),
                instance: request.url,
                traceId: request.id,
            });
        }
        return authController.forgotPassword(request, reply, parsed.data);
    });
    fastify.post("/auth/reset-password/:token", async (request, reply) => {
        const parsed = resetPasswordSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid reset-password payload",
                errors: (0, validation_1.formatZodError)(parsed.error),
                instance: request.url,
                traceId: request.id,
            });
        }
        const token = request.params.token;
        if (!token) {
            return reply.status(400).send({ error: "reset token is required" });
        }
        return authController.resetPassword(request, reply, token, parsed.data);
    });
    // Backward compatible dev endpoint
    fastify.get("/auth/me", async (request, reply) => {
        return authController.me(request, reply);
    });
    fastify.get("/auth/admin/ping", async (request, reply) => {
        const guard = await authController.requireRoles(request, reply, ["admin"]);
        if (guard)
            return guard;
        return reply.send({ ok: true, scope: "admin" });
    });
}
