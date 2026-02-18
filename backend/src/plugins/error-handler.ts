import type { FastifyPluginAsync } from "fastify";

type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  errors?: unknown;
};

const errorHandler: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((err, request, reply) => {
    const status = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

    const problem: ProblemDetails = {
      type: err.code ? `urn:problem:${err.code}` : "about:blank",
      title: err.name || "Internal Server Error",
      status,
      detail: err.message || "Something went wrong",
      instance: request.url,
      traceId: request.id,
    };

    if ((err as any).validation) {
      problem.title = "Request validation failed";
      problem.errors = (err as any).validation;
    }

    if (status >= 500) {
      request.log.error({ err, traceId: request.id }, "unhandled error");
    } else {
      request.log.warn({ err, traceId: request.id }, "request error");
    }

    reply.status(status).send(problem);
  });
};

export default errorHandler;