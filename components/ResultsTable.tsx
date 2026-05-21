"use client";

export type GermplasmEntry = {
  id: number;
  serialNo: number;
  name: string;
  genome: string | null;
  species: string | null;
  type: string | null;
  description: string | null;
};

type ResultsTableProps = {
  entries: GermplasmEntry[];
  isLoading: boolean;
  onRequest: (entry: GermplasmEntry) => void;
};

export function ResultsTable({ entries, isLoading, onRequest }: ResultsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Genome</th>
              <th className="px-4 py-3">Species</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Traits</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                    Loading entries...
                  </span>
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                  No entries found matching your search.
                </td>
              </tr>
            ) : (
              entries.map((entry, index) => (
                <tr key={entry.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-4 py-4 text-sm text-slate-700">{entry.serialNo}</td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-900">{entry.name}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{entry.genome || "-"}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{entry.species || "-"}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{entry.type || "-"}</td>
                  <td className="max-w-xs px-4 py-4 text-sm text-slate-700">{entry.description || "-"}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onRequest(entry)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
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
