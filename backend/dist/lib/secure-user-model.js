"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.createUser = createUser;
exports.createPasswordResetToken = createPasswordResetToken;
exports.findUserByPasswordResetToken = findUserByPasswordResetToken;
exports.updateUserPassword = updateUserPassword;
exports.clearPasswordResetToken = clearPasswordResetToken;
exports.userHasAnyRole = userHasAnyRole;
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = __importDefault(require("crypto"));
const usersByEmail = new Map();
async function hashPassword(password) {
    return argon2_1.default.hash(password, {
        type: argon2_1.default.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
    });
}
async function verifyPassword(passwordHash, candidatePassword) {
    return argon2_1.default.verify(passwordHash, candidatePassword);
}
function findUserByEmail(email) {
    return usersByEmail.get(email.toLowerCase());
}
function findUserById(id) {
    return [...usersByEmail.values()].find((user) => user.id === id);
}
function createUser(input) {
    const email = input.email.toLowerCase();
    const user = {
        id: `usr_${Math.random().toString(36).slice(2, 10)}`,
        email,
        firstName: input.firstName,
        lastName: input.lastName,
        roles: input.roles,
        passwordHash: input.passwordHash,
        createdAt: new Date().toISOString(),
    };
    usersByEmail.set(email, user);
    return user;
}
function createPasswordResetToken(userId, ttlMs = 10 * 60 * 1000) {
    const user = findUserById(userId);
    if (!user)
        return null;
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const tokenHash = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetTokenHash = tokenHash;
    user.passwordResetExpiresAt = Date.now() + ttlMs;
    return {
        resetToken,
        tokenHash,
        expiresAt: user.passwordResetExpiresAt,
    };
}
function findUserByPasswordResetToken(token) {
    const tokenHash = crypto_1.default.createHash("sha256").update(token).digest("hex");
    return [...usersByEmail.values()].find((user) => user.passwordResetTokenHash === tokenHash &&
        typeof user.passwordResetExpiresAt === "number" &&
        user.passwordResetExpiresAt > Date.now());
}
function updateUserPassword(userId, passwordHash) {
    const user = findUserById(userId);
    if (!user)
        return undefined;
    user.passwordHash = passwordHash;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    return user;
}
function clearPasswordResetToken(userId) {
    const user = findUserById(userId);
    if (!user)
        return undefined;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    return user;
}
function userHasAnyRole(user, allowedRoles) {
    return user.roles.some((role) => allowedRoles.includes(role));
}
