"use client";

import Link from "next/link";
import * as XLSX from "xlsx";

type RequestLog = {
  id: number;
  entryName: string;
  requesterName: string;
  phone: string;
  department: string;
  purpose: string;
  quantity: number;
  submittedAt: Date | string;
};

type RequestsClientProps = {
  requests: RequestLog[];
};

export function RequestsClient({ requests }: RequestsClientProps) {
  const normalizedRequests = requests.map((request) => ({
    ...request,
    submittedAt: new Date(request.submittedAt),
  }));

  function exportCsv() {
    const rows = normalizedRequests.map((request) => ({
      Date: request.submittedAt.toLocaleString(),
      "Entry Name": request.entryName,
      Requester: request.requesterName,
      Phone: request.phone,
      Department: request.department,
      Purpose: request.purpose,
      Qty: request.quantity,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");
    XLSX.writeFile(workbook, "germplasm-request-logs.csv", { bookType: "csv" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin"
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50"
        >
          Back to Dashboard
        </Link>
        <Link
          href="/admin/upload"
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50"
        >
          Open Excel Import
        </Link>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          Export to CSV
        </button>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-white/95 shadow-[0_20px_60px_-40px_rgba(22,101,52,0.25)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-100">
            <thead className="bg-emerald-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-emerald-800">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Entry Name</th>
                <th className="px-4 py-3">Requester</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {normalizedRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-emerald-900/60">
                    No requests submitted yet.
                  </td>
                </tr>
              ) : (
                normalizedRequests.map((request, index) => (
                  <tr key={request.id} className={index % 2 === 0 ? "bg-white" : "bg-emerald-50/35"}>
                    <td className="px-4 py-4 text-sm text-emerald-900">
                      {request.submittedAt.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-emerald-950">
                      {request.entryName}
                    </td>
                    <td className="px-4 py-4 text-sm text-emerald-900">
                      {request.requesterName}
                    </td>
                    <td className="px-4 py-4 text-sm text-emerald-900">{request.phone}</td>
                    <td className="px-4 py-4 text-sm text-emerald-900">{request.department}</td>
                    <td className="max-w-sm px-4 py-4 text-sm text-emerald-900">{request.purpose}</td>
                    <td className="px-4 py-4 text-sm text-emerald-900">{request.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
