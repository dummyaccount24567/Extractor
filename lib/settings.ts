import { prisma } from "@/lib/prisma";

export type EffectiveAdminSettings = {
  portalTitle: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  adminEmail: string;
  adminPassword: string;
  hasSavedSettings: boolean;
};

export async function getAdminSettingsRecord() {
  return prisma.adminSettings.findUnique({
    where: { id: 1 },
  });
}

export async function getEffectiveAdminSettings(): Promise<EffectiveAdminSettings> {
  const saved = await getAdminSettingsRecord();

  return {
    portalTitle: saved?.portalTitle || "Germplasm Request Portal",
    smtpHost: saved?.smtpHost || process.env.SMTP_HOST || "",
    smtpPort: saved?.smtpPort || Number(process.env.SMTP_PORT || 587),
    smtpUser: saved?.smtpUser || process.env.SMTP_USER || "",
    smtpPass: saved?.smtpPass || process.env.SMTP_PASS || "",
    adminEmail: saved?.adminEmail || process.env.ADMIN_EMAIL || "",
    adminPassword: saved?.adminPassword || process.env.ADMIN_PASSWORD || "",
    hasSavedSettings: Boolean(saved),
  };
}

export async function upsertAdminSettings(input: {
  portalTitle: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  adminEmail: string;
  adminPassword?: string;
}) {
  const existing = await getAdminSettingsRecord();
  const nextPassword =
    input.adminPassword?.trim() ||
    existing?.adminPassword ||
    process.env.ADMIN_PASSWORD ||
    "";

  return prisma.adminSettings.upsert({
    where: { id: 1 },
    update: {
      portalTitle: input.portalTitle.trim(),
      smtpHost: input.smtpHost.trim(),
      smtpPort: input.smtpPort,
      smtpUser: input.smtpUser.trim(),
      smtpPass: input.smtpPass.trim(),
      adminEmail: input.adminEmail.trim(),
      adminPassword: nextPassword,
    },
    create: {
      id: 1,
      portalTitle: input.portalTitle.trim(),
      smtpHost: input.smtpHost.trim(),
      smtpPort: input.smtpPort,
      smtpUser: input.smtpUser.trim(),
      smtpPass: input.smtpPass.trim(),
      adminEmail: input.adminEmail.trim(),
      adminPassword: nextPassword,
    },
  });
}
