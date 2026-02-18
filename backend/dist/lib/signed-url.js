"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signPlanUrl = signPlanUrl;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("./env");
function signPlanUrl(path) {
    if (!env_1.env.FIELD_ENCRYPTION_KEY) {
        throw new Error("FIELD_ENCRYPTION_KEY is not configured");
    }
    const expiresAt = Math.floor(Date.now() / 1000) + env_1.env.SIGNED_URL_TTL_SECONDS;
    const payload = `${path}.${expiresAt}`;
    const signature = crypto_1.default
        .createHmac("sha256", Buffer.from(env_1.env.FIELD_ENCRYPTION_KEY, "base64"))
        .update(payload)
        .digest("hex");
    return `${path}?expires=${expiresAt}&signature=${signature}`;
}
