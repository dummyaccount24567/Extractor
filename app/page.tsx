"use client";

import { useEffect, useMemo, useState } from "react";
import { Pagination } from "@/components/Pagination";
import { RequestModal } from "@/components/RequestModal";
import { ResultsTable, type GermplasmEntry } from "@/components/ResultsTable";
import { SearchBar } from "@/components/SearchBar";
import { Toast } from "@/components/Toast";

type EntriesResponse = {
  data: GermplasmEntry[];
  total: number;
  page: number;
  totalPages: number;
  types: string[];
};

const PAGE_SIZE = 20;

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [entries, setEntries] = useState<GermplasmEntry[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<GermplasmEntry | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    async function loadEntries() {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          search: debouncedSearch,
          type: selectedType,
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        const response = await fetch(`/api/entries?${params.toString()}`, {
          cache: "no-store",
        });
        const result = (await response.json()) as EntriesResponse;
        setEntries(result.data);
        setTypes(result.types);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      } catch {
        setEntries([]);
        setTypes([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    }

    loadEntries();
  }, [debouncedSearch, selectedType, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedType]);

  const activeFilters = useMemo(
    () => [
      { label: "All Types", value: "" },
      ...types.map((type) => ({ label: type, value: type })),
    ],
    [types],
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Germplasm Request Portal
          </h1>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            Browse available germplasm entries, filter by type, and submit requests for
            research or breeding work.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <SearchBar value={search} onChange={setSearch} />
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map((filter) => {
              const isActive = selectedType === filter.value;
              return (
                <button
                  key={filter.value || "all"}
                  type="button"
                  onClick={() => setSelectedType(filter.value)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
            <p className="text-sm text-slate-600">
              Showing {entries.length} of {total} records
            </p>
          </div>
          <ResultsTable entries={entries} isLoading={isLoading} onRequest={setSelectedEntry} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </section>
      </div>

      <RequestModal
        entry={selectedEntry}
        isOpen={Boolean(selectedEntry)}
        onClose={() => setSelectedEntry(null)}
        onSuccess={() => setToastMessage("Your request has been submitted successfully!")}
      />

      {toastMessage ? <Toast message={toastMessage} onClose={() => setToastMessage("")} /> : null}
    </main>
  );
}
