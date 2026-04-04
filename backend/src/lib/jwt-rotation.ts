import type { FastifyInstance, FastifyRequest } from "fastify";

export function verifyTokenWithRotation(fastify: FastifyInstance, token: string) {
  try {
    return (fastify as any).jwt.verify(token);
  } catch (err) {
    const previousJwt = (fastify as any).jwtPrevious;
    if (previousJwt) {
      return previousJwt.verify(token);
    }
    throw err;
  }
}

export async function verifyRequestWithRotation(request: FastifyRequest) {
  try {
    await (request as any).jwtVerify();
    return;
  } catch (err) {
    const verifyPrevious = (request as any).jwtVerifyPrevious;
    if (typeof verifyPrevious === "function") {
      await verifyPrevious.call(request);
      return;
    }
    throw err;
  }
}
