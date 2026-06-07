"use client";

import { useEffect, useMemo, useState } from "react";
import { Pagination } from "@/components/Pagination";

type Entry = {
  id: number;
  serialNo: number;
  name: string;
  species: string | null;
  type: string | null;
  description: string | null;
  accession: string | null;
  collection: string | null;
};

type FormState = {
  name: string;
  species: string;
  type: string;
  description: string;
  accession: string;
  collection: string;
};

const initialForm: FormState = {
  name: "",
  species: "",
  type: "",
  description: "",
  accession: "",
  collection: "",
};

const PAGE_SIZE = 10;

export function ManageEntriesClient() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    void loadEntries();
  }, []);

  async function loadEntries() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/entries", {
        cache: "no-store",
      });
      const result = (await response.json()) as { entries?: Entry[]; error?: string };

      if (!response.ok || !result.entries) {
        setError(result.error || "Failed to load records.");
        return;
      }

      setEntries(result.entries);
    } catch {
      setError("Failed to load records.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { success?: boolean; error?: string; entry?: Entry };

      if (!response.ok || !result.success || !result.entry) {
        setError(result.error || "Failed to create record.");
        return;
      }

      setEntries((current) =>
        [...current, result.entry].sort((a, b) => a.serialNo - b.serialNo || a.id - b.id),
      );
      setForm(initialForm);
      setMessage("Record added successfully.");
    } catch {
      setError("Failed to create record.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/entries?id=${id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !result.success) {
        setError(result.error || "Failed to delete record.");
        return;
      }

      setEntries((current) => current.filter((entry) => entry.id !== id));
      setMessage("Record deleted successfully.");
    } catch {
      setError("Failed to delete record.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return entries;
    }

    return entries.filter((entry) =>
      [
        entry.name,
        entry.species,
        entry.type,
        entry.description,
        entry.accession,
        entry.collection,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [entries, search]);

  const totalPages = Math.max(Math.ceil(filteredEntries.length / PAGE_SIZE), 1);

  const paginatedEntries = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredEntries.slice(start, start + PAGE_SIZE);
  }, [filteredEntries, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-200/80 bg-white/95 p-6 shadow-[0_20px_60px_-40px_rgba(22,101,52,0.25)]">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-emerald-950">Add Record Manually</h2>
          <p className="mt-1 text-sm text-emerald-900/70">
            Create a new record with the next available backend serial number.
          </p>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Field
            label="Name/ID"
            value={form.name}
            required
            onChange={(value) => setForm((current) => ({ ...current, name: value }))}
          />
          <Field
            label="Species"
            value={form.species}
            onChange={(value) => setForm((current) => ({ ...current, species: value }))}
          />
          <Field
            label="Type"
            value={form.type}
            onChange={(value) => setForm((current) => ({ ...current, type: value }))}
          />
          <Field
            label="Parentage"
            value={form.accession}
            onChange={(value) => setForm((current) => ({ ...current, accession: value }))}
          />
          <Field
            label="Host Institution"
            value={form.collection}
            onChange={(value) => setForm((current) => ({ ...current, collection: value }))}
          />
          <div className="md:col-span-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-emerald-900">Key Descriptors</span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={4}
                className="w-full rounded-2xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 transition focus:border-emerald-500"
              />
            </label>
          </div>

          <div className="md:col-span-2 space-y-3">
            {message ? (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {isSaving ? "Saving..." : "Add Record"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-emerald-200/80 bg-white/95 p-6 shadow-[0_20px_60px_-40px_rgba(22,101,52,0.25)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-emerald-950">Existing Records</h2>
            <p className="mt-1 text-sm text-emerald-900/70">
              Search the current database and delete records when needed.
            </p>
          </div>
          <div className="w-full sm:max-w-sm">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-emerald-900">Search Records</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, trait, species..."
                className="w-full rounded-2xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 transition focus:border-emerald-500"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-200/80">
          <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900/75">
            Showing {paginatedEntries.length} of {filteredEntries.length} records
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-100">
              <thead className="bg-emerald-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">Name/ID</th>
                  <th className="px-4 py-3">Species</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Key Descriptors</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-emerald-900/60">
                      Loading records...
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-emerald-900/60">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  paginatedEntries.map((entry, index) => (
                    <tr key={entry.id} className={index % 2 === 0 ? "bg-white" : "bg-emerald-50/35"}>
                      <td className="px-4 py-4 text-sm text-emerald-900">{entry.serialNo}</td>
                      <td className="px-4 py-4 text-sm font-medium text-emerald-950">{entry.name}</td>
                      <td className="px-4 py-4 text-sm text-emerald-900">{entry.species || "-"}</td>
                      <td className="px-4 py-4 text-sm text-emerald-900">{entry.type || "-"}</td>
                      <td className="max-w-sm px-4 py-4 text-sm text-emerald-900">
                        {entry.description || "-"}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          disabled={deletingId === entry.id}
                          className="rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === entry.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-emerald-900">{label}</span>
      <input
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 transition focus:border-emerald-500"
      />
    </label>
  );
}
