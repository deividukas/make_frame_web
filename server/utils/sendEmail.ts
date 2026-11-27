import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: { email: string; name: string };
}

interface SendEmailResult {
  success: boolean;
  error?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.MAILERSEND_API_KEY;

  if (!apiKey) {
    console.warn("[sendEmail] MAILERSEND_API_KEY not set — email not sent");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const mailerSend = new MailerSend({ apiKey });
    const sentFrom = new Sender("noreply@make-frame.com", "Make-Frame");
    const recipients = [new Recipient(options.to, "Admin")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(options.subject)
      .setHtml(options.html)
      .setText(options.text);

    if (options.replyTo) {
      emailParams.setReplyTo(new Recipient(options.replyTo.email, options.replyTo.name));
    }

    await mailerSend.email.send(emailParams);
    return { success: true };
  } catch (err: unknown) {
    // MailerSend SDK throws response objects, not standard Errors — serialize fully
    let message: string;
    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === "object" && err !== null) {
      try {
        message = JSON.stringify(err);
      } catch {
        message = String(err);
      }
    } else {
      message = String(err);
    }
    console.error("[sendEmail] MailerSend error (full):", message);
    return { success: false, error: message };
  }
}
