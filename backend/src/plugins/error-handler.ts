import type { FastifyPluginAsync, FastifyError } from "fastify";

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
    const error = err as FastifyError;
    const status = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;

    const problem: ProblemDetails = {
      type: error.code ? `urn:problem:${error.code}` : "about:blank",
      title: error.name || "Internal Server Error",
      status,
      detail: error.message || "Something went wrong",
      instance: request.url,
      traceId: request.id,
    };

    if ((error as any).validation) {
      problem.title = "Request validation failed";
      problem.errors = (error as any).validation;
    }

    if (status >= 500) {
      request.log.error({ err: error, traceId: request.id }, "unhandled error");
    } else {
      request.log.warn({ err: error, traceId: request.id }, "request error");
    }

    reply.status(status).send(problem);
  });
};

export default errorHandler;