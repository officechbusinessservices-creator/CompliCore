"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptField = encryptField;
exports.decryptField = decryptField;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("./env");
const ALGORITHM = "aes-256-gcm";
function getKey() {
    if (!env_1.env.FIELD_ENCRYPTION_KEY) {
        throw new Error("FIELD_ENCRYPTION_KEY is not configured");
    }
    const raw = Buffer.from(env_1.env.FIELD_ENCRYPTION_KEY, "base64");
    if (raw.length !== 32) {
        throw new Error("FIELD_ENCRYPTION_KEY must be 32 bytes base64");
    }
    return raw;
}
function encryptField(plainText) {
    const key = getKey();
    const iv = crypto_1.default.randomBytes(12);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString("base64");
}
function decryptField(payload) {
    const key = getKey();
    const raw = Buffer.from(payload, "base64");
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const data = raw.subarray(28);
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
