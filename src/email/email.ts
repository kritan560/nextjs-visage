'use server'

import { env } from "@/env";
import { createTransport } from "nodemailer";

const userEmail = "amaze560@gmail.com";

export async function SendEmail(to: string, html: string, subject: string) {
  let transport = createTransport({
    service: "GMAIL",
    auth: { user: userEmail, pass: env.GMAIL_PASS },
  });

  try {
    const sendMail = await transport.sendMail({
      to,
      html,
      subject,
      from: userEmail,
    });
    if (sendMail.messageId) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error("failed to send mail");
  }
}
