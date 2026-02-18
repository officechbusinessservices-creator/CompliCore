"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthController = createAuthController;
const env_1 = require("../lib/env");
const secure_user_model_1 = require("../lib/secure-user-model");
const email_1 = require("../utils/email");
const jwt_rotation_1 = require("../lib/jwt-rotation");
function cookieOptions(maxAgeSeconds) {
    return {
        httpOnly: true,
        secure: env_1.env.COOKIE_SECURE,
        sameSite: env_1.env.COOKIE_SAME_SITE,
        domain: env_1.env.COOKIE_DOMAIN || undefined,
        path: "/",
        maxAge: maxAgeSeconds,
    };
}
function buildAuthResponse(fastify, user) {
    const accessToken = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
        roles: user.roles || ["guest"],
        typ: "access",
    }, {
        expiresIn: `${env_1.env.ACCESS_TOKEN_TTL_SECONDS}s`,
    });
    const refreshToken = fastify.jwt.sign({ userId: user.id, typ: "refresh" }, {
        expiresIn: `${env_1.env.REFRESH_TOKEN_TTL_SECONDS}s`,
    });
    return {
        accessToken,
        token: accessToken,
        refreshToken,
        expiresIn: env_1.env.ACCESS_TOKEN_TTL_SECONDS,
        user,
    };
}
function attachAuthCookies(reply, auth) {
    reply
        .setCookie(env_1.env.ACCESS_TOKEN_COOKIE_NAME, auth.accessToken, cookieOptions(env_1.env.ACCESS_TOKEN_TTL_SECONDS))
        .setCookie(env_1.env.REFRESH_TOKEN_COOKIE_NAME, auth.refreshToken, cookieOptions(env_1.env.REFRESH_TOKEN_TTL_SECONDS));
}
function createAuthController(fastify) {
    return {
        async signup(request, reply, body) {
            const email = body.email.toLowerCase();
            if ((0, secure_user_model_1.findUserByEmail)(email)) {
                return reply.status(409).send({ error: "user already exists" });
            }
            const passwordHash = await (0, secure_user_model_1.hashPassword)(body.password);
            const record = (0, secure_user_model_1.createUser)({
                email,
                firstName: body.firstName,
                lastName: body.lastName,
                roles: body.role ? [body.role] : ["guest"],
                passwordHash,
            });
            const user = {
                id: record.id,
                email: record.email,
                firstName: record.firstName,
                lastName: record.lastName,
                displayName: `${record.firstName} ${record.lastName}`,
                roles: record.roles,
                createdAt: record.createdAt,
            };
            const auth = buildAuthResponse(fastify, user);
            attachAuthCookies(reply, auth);
            return reply.status(201).send({ message: "registered", ...auth });
        },
        async login(request, reply, body) {
            const email = body.email.toLowerCase();
            const record = (0, secure_user_model_1.findUserByEmail)(email);
            if (!record) {
                request.log.warn({ email, ip: request.ip, reason: "user_not_found" }, "[SECURITY ALERT] failed login attempt");
                return reply.status(401).send({ error: "invalid credentials" });
            }
            const verified = await (0, secure_user_model_1.verifyPassword)(record.passwordHash, body.password);
            if (!verified) {
                request.log.warn({ email, ip: request.ip, reason: "password_mismatch" }, "[SECURITY ALERT] failed login attempt");
                return reply.status(401).send({ error: "invalid credentials" });
            }
            const user = {
                id: record.id,
                email: record.email,
                firstName: record.firstName,
                lastName: record.lastName,
                displayName: `${record.firstName} ${record.lastName}`,
                roles: body.role ? [body.role] : record.roles,
                createdAt: record.createdAt,
            };
            const auth = buildAuthResponse(fastify, user);
            attachAuthCookies(reply, auth);
            return reply.send({ message: "logged in", ...auth });
        },
        async refresh(request, reply, providedToken) {
            const cookieToken = request.cookies[env_1.env.REFRESH_TOKEN_COOKIE_NAME];
            const token = providedToken || cookieToken;
            if (!token) {
                return reply.status(401).send({ error: "refresh token required" });
            }
            let decoded;
            try {
                decoded = (0, jwt_rotation_1.verifyTokenWithRotation)(fastify, token);
            }
            catch {
                return reply.status(401).send({ error: "invalid refresh token" });
            }
            if (decoded?.typ !== "refresh" || !decoded?.userId) {
                return reply.status(401).send({ error: "invalid refresh token" });
            }
            const record = (0, secure_user_model_1.findUserById)(decoded.userId);
            if (!record) {
                return reply.status(401).send({ error: "invalid refresh token" });
            }
            const user = {
                id: record.id,
                email: record.email,
                firstName: record.firstName,
                lastName: record.lastName,
                displayName: `${record.firstName} ${record.lastName}`,
                roles: record.roles,
                createdAt: record.createdAt,
            };
            const auth = buildAuthResponse(fastify, user);
            attachAuthCookies(reply, auth);
            return reply.send({ message: "refreshed", ...auth });
        },
        async logout(reply) {
            reply
                .clearCookie(env_1.env.ACCESS_TOKEN_COOKIE_NAME, { path: "/", domain: env_1.env.COOKIE_DOMAIN || undefined })
                .clearCookie(env_1.env.REFRESH_TOKEN_COOKIE_NAME, { path: "/", domain: env_1.env.COOKIE_DOMAIN || undefined });
            return reply.send({ message: "logged out" });
        },
        async me(request, reply) {
            const accessToken = request.cookies[env_1.env.ACCESS_TOKEN_COOKIE_NAME];
            if (!accessToken) {
                return reply.status(401).send({ error: "unauthorized" });
            }
            let payload;
            try {
                payload = (0, jwt_rotation_1.verifyTokenWithRotation)(fastify, accessToken);
            }
            catch {
                return reply.status(401).send({ error: "unauthorized" });
            }
            if (payload?.typ !== "access" || !payload?.userId) {
                return reply.status(401).send({ error: "unauthorized" });
            }
            const record = (0, secure_user_model_1.findUserById)(payload.userId);
            if (!record) {
                return reply.status(401).send({ error: "unauthorized" });
            }
            return reply.send({
                id: record.id,
                email: record.email,
                firstName: record.firstName,
                lastName: record.lastName,
                roles: record.roles,
                displayName: `${record.firstName} ${record.lastName}`,
            });
        },
        async forgotPassword(request, reply, body) {
            const email = body.email.toLowerCase();
            const user = (0, secure_user_model_1.findUserByEmail)(email);
            if (!user) {
                return reply.status(404).send({ message: "No user found with that email." });
            }
            const reset = (0, secure_user_model_1.createPasswordResetToken)(user.id);
            if (!reset) {
                return reply.status(500).send({ message: "Failed to create reset token" });
            }
            const host = request.headers.host || "localhost:4000";
            const protocol = env_1.env.COOKIE_SECURE ? "https" : "http";
            const resetURL = `${protocol}://${host}/api/v1/auth/reset-password/${reset.resetToken}`;
            try {
                await new email_1.Email({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                }, resetURL).sendPasswordReset();
                request.log.info({ email, resetExpiresAt: reset.expiresAt }, "password reset email sent");
                return reply.send({
                    status: "success",
                    message: "Token sent to email!",
                });
            }
            catch (error) {
                (0, secure_user_model_1.clearPasswordResetToken)(user.id);
                request.log.error({ email, err: error }, "failed to send password reset email");
                return reply.status(500).send({
                    status: "error",
                    message: "Error sending email. Try again later.",
                });
            }
        },
        async resetPassword(request, reply, token, body) {
            const user = (0, secure_user_model_1.findUserByPasswordResetToken)(token);
            if (!user) {
                return reply.status(400).send({ message: "Token is invalid or has expired." });
            }
            const passwordHash = await (0, secure_user_model_1.hashPassword)(body.password);
            const updated = (0, secure_user_model_1.updateUserPassword)(user.id, passwordHash);
            if (!updated) {
                return reply.status(500).send({ message: "Unable to update password" });
            }
            const authUser = {
                id: updated.id,
                email: updated.email,
                firstName: updated.firstName,
                lastName: updated.lastName,
                displayName: `${updated.firstName} ${updated.lastName}`,
                roles: updated.roles,
                createdAt: updated.createdAt,
            };
            const auth = buildAuthResponse(fastify, authUser);
            attachAuthCookies(reply, auth);
            return reply.send({
                status: "success",
                message: "Password reset successful",
                ...auth,
            });
        },
        async requireRoles(request, reply, allowedRoles) {
            const accessToken = request.cookies[env_1.env.ACCESS_TOKEN_COOKIE_NAME];
            if (!accessToken) {
                return reply.status(401).send({ error: "unauthorized" });
            }
            let payload;
            try {
                payload = (0, jwt_rotation_1.verifyTokenWithRotation)(fastify, accessToken);
            }
            catch {
                return reply.status(401).send({ error: "unauthorized" });
            }
            if (payload?.typ !== "access" || !payload?.userId) {
                return reply.status(401).send({ error: "unauthorized" });
            }
            const record = (0, secure_user_model_1.findUserById)(payload.userId);
            if (!record) {
                return reply.status(401).send({ error: "unauthorized" });
            }
            if (!(0, secure_user_model_1.userHasAnyRole)(record, allowedRoles)) {
                return reply.status(403).send({ error: "forbidden" });
            }
            return null;
        },
    };
}
