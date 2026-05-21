import nodemailer from "nodemailer";
import { getEffectiveAdminSettings } from "@/lib/settings";

type RequestMailInput = {
  entryName: string;
  requesterName: string;
  phone: string;
  department: string;
  purpose: string;
  quantity: number;
  submittedAt: string;
};

export async function sendRequestNotification(input: RequestMailInput) {
  const settings = await getEffectiveAdminSettings();
  const transporter = buildTransporter(settings);

  if (!transporter || !settings.adminEmail) {
    throw new Error("SMTP is not configured.");
  }

  await transporter.sendMail({
    from: settings.smtpUser,
    to: settings.adminEmail,
    subject: `New Germplasm Request — ${input.entryName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827;">
        <h2 style="margin-bottom: 16px;">New Germplasm Request Received</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Entry Name</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(input.entryName)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Requester</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(input.requesterName)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(input.phone)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Department</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(input.department)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Purpose</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(input.purpose)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Quantity</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${input.quantity}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Submitted At</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(input.submittedAt)}</td></tr>
        </table>
      </div>
    `,
  });
}

export async function sendAdminTestEmail() {
  const settings = await getEffectiveAdminSettings();
  const transporter = buildTransporter(settings);

  if (!transporter || !settings.adminEmail) {
    throw new Error("SMTP is not configured.");
  }

  await transporter.sendMail({
    from: settings.smtpUser,
    to: settings.adminEmail,
    subject: "Germplasm Request Portal Test Email",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827;">
        <h2 style="margin-bottom: 16px;">Email Configuration Test</h2>
        <p>Your Germplasm Request Portal SMTP settings are working correctly.</p>
      </div>
    `,
  });
}

function buildTransporter(settings: {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
}) {
  if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.smtpPort === 465,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPass,
    },
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
