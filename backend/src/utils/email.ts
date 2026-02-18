import nodemailer from "nodemailer";
import { env } from "../lib/env";

type EmailUser = {
  email: string;
  firstName?: string;
  lastName?: string;
};

export class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private from: string;

  constructor(user: EmailUser, url: string) {
    this.to = user.email;
    this.firstName = user.firstName || user.lastName || "User";
    this.url = url;
    this.from = `CompliCore <${env.EMAIL_FROM}>`;
  }

  private newTransport() {
    if (env.NODE_ENV === "production" && env.SENDGRID_USERNAME && env.SENDGRID_PASSWORD) {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: env.SENDGRID_USERNAME,
          pass: env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      auth: {
        user: env.EMAIL_USERNAME,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }

  private async send(subject: string, text: string) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send(
      "Your password reset token (valid for 10 min)",
      `Hello ${this.firstName},\n\nForgot your password? Submit a request with your new password to:\n${this.url}\n\nIf you didn't request this, please ignore this email.`,
    );
  }
}
