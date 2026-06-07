"use client";

import Link from "next/link";
import { useState } from "react";

type UploadResponse = {
  imported?: number;
  skipped?: number;
  preview?: Array<Record<string, string | number | undefined>>;
  duplicateNames?: string[];
  error?: string;
};

export function UploadClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setResult({ error: "Please select an Excel file." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as UploadResponse;
      setResult(payload);
    } catch {
      setResult({ error: "Upload failed. Please try again." });
    } finally {
      setIsUploading(false);
    }
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
          href="/admin/requests"
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50"
        >
          View Requests
        </Link>
        <Link
          href="/admin"
          className="rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          Open Settings
        </Link>
      </div>

      <section className="rounded-[2rem] border border-emerald-200/80 bg-white/95 p-6 shadow-[0_20px_60px_-40px_rgba(22,101,52,0.25)]">
        <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-900/75">
          Import starts as soon as you click <span className="font-medium text-emerald-950">Upload & Import</span>.
          Portal and email settings are managed from <span className="font-medium text-emerald-950">Open Settings</span>.
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="excel-file" className="mb-2 block text-sm font-medium text-emerald-900">
              Excel file
            </label>
            <input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full rounded-2xl border border-emerald-200 px-4 py-3 text-sm text-emerald-900 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-700 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex items-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isUploading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                Uploading...
              </span>
            ) : (
              "Upload & Import"
            )}
          </button>
        </form>

        {result?.error ? <p className="mt-4 text-sm text-red-600">{result.error}</p> : null}
        {typeof result?.imported === "number" ? (
          <div className="mt-6 space-y-4">
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {result.imported} records imported successfully.
            </p>
            <p className="text-sm text-emerald-900/70">{result.skipped ?? 0} rows skipped.</p>
            {result.duplicateNames && result.duplicateNames.length > 0 ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Duplicate names detected and skipped: {result.duplicateNames.join(", ")}
              </p>
            ) : null}
            {result.preview && result.preview.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-emerald-200/80">
                <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
                  Preview of first 5 rows
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-emerald-100">
                    <thead className="bg-white">
                      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-emerald-800">
                        <th className="px-4 py-3">S.No</th>
                        <th className="px-4 py-3">Name/ID</th>
                        <th className="px-4 py-3">Species</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Key Descriptors</th>
                        <th className="px-4 py-3">Parentage</th>
                        <th className="px-4 py-3">Host Institution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100">
                      {result.preview.map((row, index) => (
                        <tr
                          key={`${row.name}-${index}`}
                          className={index % 2 === 0 ? "bg-white" : "bg-emerald-50/35"}
                        >
                          <td className="px-4 py-3 text-sm text-emerald-900">{String(row.serialNo ?? "-")}</td>
                          <td className="px-4 py-3 text-sm text-emerald-950">{String(row.name ?? "-")}</td>
                          <td className="px-4 py-3 text-sm text-emerald-900">{String(row.species ?? "-")}</td>
                          <td className="px-4 py-3 text-sm text-emerald-900">{String(row.type ?? "-")}</td>
                          <td className="px-4 py-3 text-sm text-emerald-900">{String(row.description ?? "-")}</td>
                          <td className="px-4 py-3 text-sm text-emerald-900">{String(row.accession ?? "-")}</td>
                          <td className="px-4 py-3 text-sm text-emerald-900">{String(row.collection ?? "-")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
