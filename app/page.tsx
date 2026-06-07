"use client";

import { useEffect, useState } from "react";
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
};

const PAGE_SIZE = 20;

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [entries, setEntries] = useState<GermplasmEntry[]>([]);
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
      if (!debouncedSearch) {
        setEntries([]);
        setTotal(0);
        setTotalPages(1);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          search: debouncedSearch,
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        const response = await fetch(`/api/entries?${params.toString()}`, {
          cache: "no-store",
        });
        const result = (await response.json()) as EntriesResponse;
        setEntries(result.data);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      } catch {
        setEntries([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    }

    loadEntries();
  }, [debouncedSearch, page]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7_0%,transparent_26%),linear-gradient(180deg,#f5fff8_0%,#ecfdf3_40%,#ffffff_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-white/95 p-6 shadow-[0_24px_80px_-32px_rgba(22,101,52,0.22)] sm:p-8">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
            <AgricultureVectors />
          </div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Genom Data
            </span>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-emerald-950 sm:text-5xl">
              Genom Data Records
            </h1>
            <p className="max-w-xl text-sm leading-7 text-emerald-900/70 sm:text-base">
              Search key descriptors with a clean agricultural data interface.
            </p>
            <div className="grid max-w-2xl gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Focus
                </p>
                <p className="mt-2 text-sm text-emerald-950">Trait-based retrieval</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Records
                </p>
                <p className="mt-2 text-sm text-emerald-950">Structured genom data</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Use
                </p>
                <p className="mt-2 text-sm text-emerald-950">Research and breeding support</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-emerald-200/80 bg-white/95 p-4 shadow-[0_20px_60px_-36px_rgba(22,101,52,0.2)] sm:p-6">
          <SearchBar value={search} onChange={setSearch} />
        </section>

        {debouncedSearch ? (
          <section className="rounded-[2rem] border border-emerald-200/80 bg-white/95 shadow-[0_20px_60px_-36px_rgba(22,101,52,0.2)]">
            <div className="border-b border-emerald-100 px-4 py-4 sm:px-6">
              <p className="text-sm text-emerald-900/75">
                Showing {entries.length} of {total} records for trait: {debouncedSearch}
              </p>
            </div>
            <ResultsTable entries={entries} isLoading={isLoading} onRequest={setSelectedEntry} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </section>
        ) : null}
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

function AgricultureVectors() {
  return (
    <svg
      viewBox="0 0 520 360"
      className="h-full w-full text-emerald-600 opacity-95"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fieldGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#e8f7eb" />
          <stop offset="100%" stopColor="#a7f3d0" />
        </linearGradient>
        <linearGradient id="leafGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient id="grainGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>
      <circle cx="390" cy="78" r="58" fill="#f0fdf4" />
      <path
        d="M180 302c92-94 196-134 300-120v124H146c-4-4 6-6 34-4Z"
        fill="url(#fieldGradient)"
      />
      <path
        d="M210 290c78-43 165-61 261-52"
        fill="none"
        stroke="#86efac"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M248 316c64-22 133-28 205-20"
        fill="none"
        stroke="#4ade80"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M334 228c-8-37 10-72 49-98 10 46-7 84-49 98Z"
        fill="url(#leafGradient)"
      />
      <path
        d="M322 227c-31-18-47-49-40-92 39 8 61 35 66 81"
        fill="#34d399"
      />
      <path
        d="M366 258v-88"
        fill="none"
        stroke="#166534"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M422 235c-9-24 1-50 29-69 7 31-3 57-29 69Z"
        fill="#16a34a"
      />
      <path
        d="M409 235c-23-13-36-35-35-66 28 7 45 26 50 58"
        fill="url(#grainGradient)"
      />
      <path
        d="M438 266v-59"
        fill="none"
        stroke="#166534"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <g fill="none" stroke="#a7f3d0" strokeWidth="4" strokeLinecap="round">
        <path d="M92 292c28-48 54-80 80-98" />
        <path d="M126 297c20-35 41-61 62-80" />
        <path d="M164 302c16-24 32-44 49-60" />
      </g>
      <g>
        <path
          d="M120 242c16-28 33-47 54-60"
          fill="none"
          stroke="#166534"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <ellipse cx="150" cy="210" rx="10" ry="23" transform="rotate(-28 150 210)" fill="#22c55e" />
        <ellipse cx="178" cy="193" rx="9" ry="18" transform="rotate(-24 178 193)" fill="#4ade80" />
      </g>
    </svg>
  );
}
