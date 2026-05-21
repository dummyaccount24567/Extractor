import { AdminPasswordForm } from "@/components/AdminPasswordForm";
import { AdminShell } from "@/components/AdminShell";
import { isAdminAuthenticated } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getEffectiveAdminSettings } from "@/lib/settings";
import { AdminDashboardClient } from "./settings-client";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <AdminPasswordForm />
      </main>
    );
  }

  const [settings, entryCount, requestCount, latestRequests] = await Promise.all([
    getEffectiveAdminSettings(),
    prisma.germplasmEntry.count(),
    prisma.requestLog.count(),
    prisma.requestLog.findMany({
      orderBy: { submittedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <AdminShell
      title="Dashboard"
      description="Manage portal settings, email delivery, data imports, and recent request activity from one place."
    >
      <AdminDashboardClient
        initialSettings={{
          portalTitle: settings.portalTitle,
          smtpHost: settings.smtpHost,
          smtpPort: String(settings.smtpPort),
          smtpUser: settings.smtpUser,
          smtpPass: settings.smtpPass,
          adminEmail: settings.adminEmail,
          adminPassword: "",
          hasSavedSettings: settings.hasSavedSettings,
        }}
        stats={{
          entryCount,
          requestCount,
        }}
        recentRequests={latestRequests.map((request) => ({
          id: request.id,
          entryName: request.entryName,
          requesterName: request.requesterName,
          department: request.department,
          submittedAt: request.submittedAt.toISOString(),
        }))}
      />
    </AdminShell>
  );
}
