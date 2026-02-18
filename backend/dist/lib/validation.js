"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodError = formatZodError;
function formatZodError(err) {
    return err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
    }));
}
