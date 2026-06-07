import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin";
import { AdminPasswordForm } from "@/components/AdminPasswordForm";
import { AdminShell } from "@/components/AdminShell";
import { RequestsClient } from "./requests-client";

export default async function RequestsPage() {
  if (!(await isAdminAuthenticated())) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#dcfce7_0%,transparent_25%),linear-gradient(180deg,#f5fff8_0%,#ecfdf3_42%,#ffffff_100%)] px-4">
        <AdminPasswordForm />
      </main>
    );
  }

  const requests = await prisma.requestLog.findMany({
    orderBy: { submittedAt: "desc" },
  });

  return (
    <AdminShell
      title="Request Logs"
      description="Review incoming germplasm requests, inspect request purposes, and export records for reporting."
    >
      <RequestsClient requests={requests} />
    </AdminShell>
  );
}
