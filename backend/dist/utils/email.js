"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../lib/env");
class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.firstName || user.lastName || "User";
        this.url = url;
        this.from = `CompliCore <${env_1.env.EMAIL_FROM}>`;
    }
    newTransport() {
        if (env_1.env.NODE_ENV === "production" && env_1.env.SENDGRID_USERNAME && env_1.env.SENDGRID_PASSWORD) {
            return nodemailer_1.default.createTransport({
                service: "SendGrid",
                auth: {
                    user: env_1.env.SENDGRID_USERNAME,
                    pass: env_1.env.SENDGRID_PASSWORD,
                },
            });
        }
        return nodemailer_1.default.createTransport({
            host: env_1.env.EMAIL_HOST,
            port: env_1.env.EMAIL_PORT,
            auth: {
                user: env_1.env.EMAIL_USERNAME,
                pass: env_1.env.EMAIL_PASSWORD,
            },
        });
    }
    async send(subject, text) {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text,
        };
        await this.newTransport().sendMail(mailOptions);
    }
    async sendPasswordReset() {
        await this.send("Your password reset token (valid for 10 min)", `Hello ${this.firstName},\n\nForgot your password? Submit a request with your new password to:\n${this.url}\n\nIf you didn't request this, please ignore this email.`);
    }
}
exports.Email = Email;
