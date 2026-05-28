import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { NotificationLog } from "../models/notificationLog.model.js";
import { buildEmail } from "../templates/emailTemplates.js";

const hasSmtpConfig = Boolean(env.mail.host && env.mail.user && env.mail.pass);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.secure,
      auth: { user: env.mail.user, pass: env.mail.pass }
    })
  : null;

export const sendRequestEmail = async ({ type, request, recipients, comment, attachments = [] }) => {
  const results = [];

  for (const recipient of recipients.filter(Boolean)) {
    const email = buildEmail({
      type,
      request,
      recipientName: recipient.name,
      comment
    });

    try {
      if (transporter) {
        await transporter.sendMail({
          from: env.mail.from,
          to: recipient.email,
          subject: email.subject,
          html: email.html,
          attachments
        });
      }

      results.push(
        await NotificationLog.create({
          request: request._id,
          recipient: recipient._id,
          email: recipient.email,
          type,
          subject: email.subject,
          status: "Sent",
          sentAt: new Date()
        })
      );
    } catch (error) {
      results.push(
        await NotificationLog.create({
          request: request._id,
          recipient: recipient._id,
          email: recipient.email,
          type,
          subject: email.subject,
          status: "Failed",
          errorMessage: error.message
        })
      );
    }
  }

  return results;
};
