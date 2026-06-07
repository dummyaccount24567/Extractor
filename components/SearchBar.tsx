"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <label htmlFor="search" className="mb-2 block text-sm font-medium text-emerald-900">
          Trait Search
        </label>
        <span className="pointer-events-none absolute left-4 top-[3.35rem] -translate-y-1/2 text-emerald-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m0 0A7.95 7.95 0 1 0 5.4 5.4a7.95 7.95 0 0 0 11.25 11.25Z"
            />
          </svg>
        </span>
        <input
          id="search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter a trait to search records"
          className="w-full rounded-2xl border border-emerald-200 bg-white py-3 pl-12 pr-4 text-sm text-emerald-950 shadow-sm outline-none transition focus:border-emerald-500"
        />
      </div>
      <p className="text-sm text-emerald-800/80">
        Results appear after a trait search.
      </p>
    </div>
  );
}
