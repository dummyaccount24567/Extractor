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
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
        >
          Back to Dashboard
        </Link>
        <Link
          href="/admin/upload"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
        >
          Open Excel Import
        </Link>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Export to CSV
        </button>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
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
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                    No requests submitted yet.
                  </td>
                </tr>
              ) : (
                normalizedRequests.map((request, index) => (
                  <tr key={request.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {request.submittedAt.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-900">
                      {request.entryName}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {request.requesterName}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{request.phone}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{request.department}</td>
                    <td className="max-w-sm px-4 py-4 text-sm text-slate-700">{request.purpose}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{request.quantity}</td>
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
