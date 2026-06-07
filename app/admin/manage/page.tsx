import { AdminPasswordForm } from "@/components/AdminPasswordForm";
import { AdminShell } from "@/components/AdminShell";
import { isAdminAuthenticated } from "@/lib/admin";
import { ManageEntriesClient } from "./manage-client";

export default async function ManageEntriesPage() {
  if (!(await isAdminAuthenticated())) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#dcfce7_0%,transparent_25%),linear-gradient(180deg,#f5fff8_0%,#ecfdf3_42%,#ffffff_100%)] px-4">
        <AdminPasswordForm />
      </main>
    );
  }

  return (
    <AdminShell
      title="Manage Data"
      description="Add new germplasm records manually or remove existing records from the database."
    >
      <ManageEntriesClient />
    </AdminShell>
  );
}
