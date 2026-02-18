"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const env_1 = require("../lib/env");
const securityFortress = async (fastify) => {
    const allowedOrigins = env_1.env.ALLOWED_ORIGINS
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    const allowedMethods = env_1.env.ALLOWED_METHODS
        .split(",")
        .map((method) => method.trim().toUpperCase())
        .filter(Boolean);
    await fastify.register(cors_1.default, {
        origin: allowedOrigins.length > 0 ? allowedOrigins : true,
        methods: allowedMethods,
        credentials: true,
    });
    await fastify.register(helmet_1.default, {
        contentSecurityPolicy: false,
        global: true,
        hidePoweredBy: true,
    });
    await fastify.register(rate_limit_1.default, {
        max: env_1.env.RATE_LIMIT_MAX,
        timeWindow: env_1.env.RATE_LIMIT_WINDOW,
        allowList: env_1.env.RATE_LIMIT_ALLOWLIST
            ? env_1.env.RATE_LIMIT_ALLOWLIST.split(",").map((ip) => ip.trim())
            : [],
    });
    await fastify.register(cookie_1.default);
};
exports.default = (0, fastify_plugin_1.default)(securityFortress, {
    name: "security-fortress",
});
