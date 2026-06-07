"use client";

export type GermplasmEntry = {
  id: number;
  serialNo: number;
  name: string;
  genome: string | null;
  species: string | null;
  type: string | null;
  collection: string | null;
  accession: string | null;
  description: string | null;
};

type ResultsTableProps = {
  entries: GermplasmEntry[];
  isLoading: boolean;
  onRequest: (entry: GermplasmEntry) => void;
};

export function ResultsTable({ entries, isLoading, onRequest }: ResultsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-emerald-100">
          <thead className="bg-emerald-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Name/ID</th>
              <th className="px-4 py-3">Species</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Key Descriptors</th>
              <th className="px-4 py-3">Parentage</th>
              <th className="px-4 py-3">Host Institution</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-emerald-800/70">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700" />
                    Loading entries...
                  </span>
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-emerald-800/70">
                  No entries found matching your search.
                </td>
              </tr>
            ) : (
              entries.map((entry, index) => (
                <tr key={entry.id} className={index % 2 === 0 ? "bg-white" : "bg-emerald-50/40"}>
                  <td className="px-4 py-4 text-sm text-emerald-900">{entry.serialNo}</td>
                  <td className="px-4 py-4 text-sm font-medium text-emerald-950">{entry.name}</td>
                  <td className="px-4 py-4 text-sm text-emerald-900">{entry.species || "-"}</td>
                  <td className="px-4 py-4 text-sm text-emerald-900">{entry.type || "-"}</td>
                  <td className="max-w-xs px-4 py-4 text-sm text-emerald-900">
                    {entry.description || "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-emerald-900">{entry.accession || "-"}</td>
                  <td className="px-4 py-4 text-sm text-emerald-900">{entry.collection || "-"}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onRequest(entry)}
                      className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-medium text-emerald-800 transition hover:bg-emerald-50"
                    >
                      Request
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
