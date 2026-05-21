import { AdminPasswordForm } from "@/components/AdminPasswordForm";
import { AdminShell } from "@/components/AdminShell";
import { isAdminAuthenticated } from "@/lib/admin";
import { UploadClient } from "./upload-client";

export default async function UploadPage() {
  if (!(await isAdminAuthenticated())) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <AdminPasswordForm />
      </main>
    );
  }

  return (
    <AdminShell
      title="Excel Import"
      description="Upload germplasm records from an Excel workbook, preview detected rows, and skip duplicate names automatically."
    >
      <UploadClient />
    </AdminShell>
  );
}
