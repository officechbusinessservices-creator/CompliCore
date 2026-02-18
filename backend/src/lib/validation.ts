import { ZodError } from "zod";

export type ValidationError = {
  path: string;
  message: string;
};

export function formatZodError(err: ZodError): ValidationError[] {
  return err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}
