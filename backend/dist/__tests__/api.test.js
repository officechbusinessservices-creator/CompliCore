"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const server_1 = require("../server");
let server;
(0, vitest_1.beforeAll)(async () => {
    server = await (0, server_1.buildServer)();
});
(0, vitest_1.afterAll)(async () => {
    if (server)
        await server.close();
});
async function createAuthToken() {
    const email = `api-core-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
    const password = "TestPass123!";
    const register = await server.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: {
            email,
            password,
            firstName: "API",
            lastName: "Tester",
            role: "host",
        },
    });
    (0, vitest_1.expect)(register.statusCode).toBe(201);
    const login = await server.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: { email, password },
    });
    (0, vitest_1.expect)(login.statusCode).toBe(200);
    const loginBody = JSON.parse(login.payload);
    (0, vitest_1.expect)(typeof loginBody.accessToken).toBe("string");
    return loginBody.accessToken;
}
(0, vitest_1.describe)("API - core endpoints", () => {
    (0, vitest_1.it)("GET /api/bookings returns 200", async () => {
        const res = await server.inject({ method: "GET", url: "/api/bookings" });
        (0, vitest_1.expect)(res.statusCode).toBe(200);
    });
    (0, vitest_1.it)("POST /api/auth/login returns token", async () => {
        const token = await createAuthToken();
        (0, vitest_1.expect)(typeof token).toBe("string");
    });
    (0, vitest_1.it)("POST /api/bookings without token returns 401", async () => {
        const res = await server.inject({
            method: "POST",
            url: "/api/bookings",
            payload: { guest_name: "T" },
        });
        (0, vitest_1.expect)(res.statusCode).toBe(401);
    });
});
