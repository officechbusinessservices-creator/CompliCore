"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenWithRotation = verifyTokenWithRotation;
exports.verifyRequestWithRotation = verifyRequestWithRotation;
function verifyTokenWithRotation(fastify, token) {
    try {
        return fastify.jwt.verify(token);
    }
    catch (err) {
        const previousJwt = fastify.jwtPrevious;
        if (previousJwt) {
            return previousJwt.verify(token);
        }
        throw err;
    }
}
async function verifyRequestWithRotation(request) {
    try {
        await request.jwtVerify();
        return;
    }
    catch (err) {
        const verifyPrevious = request.jwtVerifyPrevious;
        if (typeof verifyPrevious === "function") {
            await verifyPrevious.call(request);
            return;
        }
        throw err;
    }
}
