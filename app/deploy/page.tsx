"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const INITIAL_COUNT = 5;

export default function DeployPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const redirectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current !== null) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (countdown === null || countdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((current) => {
        if (current === null) {
          return null;
        }

        if (current === 1) {
          setIsLaunching(true);
          redirectTimeoutRef.current = window.setTimeout(() => {
            router.push("/");
          }, 1400);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, router]);

  function handleDeploy() {
    setIsLaunching(false);
    setCountdown(INITIAL_COUNT);

    if (redirectTimeoutRef.current !== null) {
      window.clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
  }

  const statusLabel =
    countdown && countdown > 0 ? String(countdown) : isLaunching ? "Launching..." : "Ready";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#dcfce7_0%,transparent_24%),linear-gradient(180deg,#f5fff8_0%,#ecfdf3_45%,#ffffff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <section className="relative w-full overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-white/95 p-8 shadow-[0_28px_80px_-36px_rgba(22,101,52,0.22)] sm:p-10">
          <div className="absolute inset-y-0 right-0 hidden w-[42%] lg:block">
            <DeployVectors />
          </div>

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center space-y-6 text-center">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Deployment Console
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-emerald-950 sm:text-5xl">
              Secure deployment launch.
            </h1>
            <p className="max-w-lg text-sm leading-7 text-emerald-900/72 sm:text-base">
              Start the deployment countdown and return automatically after launch.
            </p>

            <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-[1.75rem] border border-emerald-100 bg-emerald-50/60 p-6 shadow-inner shadow-emerald-100/70">
              <div className="flex w-full flex-col items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
                    Status
                  </p>
                  <p className="mt-2 text-5xl font-semibold text-emerald-950">{statusLabel}</p>
                </div>
                <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-emerald-200 bg-white text-3xl font-semibold text-emerald-700 shadow-sm">
                  {countdown && countdown > 0 ? countdown : isLaunching ? "..." : "Go"}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleDeploy}
                  disabled={Boolean(countdown && countdown > 0) || isLaunching}
                  className="inline-flex items-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  Deploy
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DeployVectors() {
  return (
    <svg viewBox="0 0 420 420" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="deployLeaf" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
      </defs>
      <circle cx="285" cy="90" r="76" fill="#ecfdf5" />
      <circle cx="315" cy="245" r="92" fill="#f0fdf4" />
      <path
        d="M90 320c54-36 123-48 204-36"
        fill="none"
        stroke="#bbf7d0"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M195 335c-4-62 18-124 68-183 48 68 60 131 36 190"
        fill="none"
        stroke="#14532d"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M228 238c-35-18-58-50-62-102 50 11 79 42 88 90"
        fill="url(#deployLeaf)"
      />
      <path
        d="M264 195c4-46 29-83 79-110 8 58-17 98-74 118"
        fill="#16a34a"
      />
      <path
        d="M276 292c26-26 58-39 97-38-20 44-54 65-102 60"
        fill="#4ade80"
      />
      <path
        d="M151 321c31-9 55-4 78 17-31 15-57 11-78-17Z"
        fill="#86efac"
      />
      <g fill="none" stroke="#166534" strokeLinecap="round">
        <path d="M123 304c20-44 42-75 69-97" strokeWidth="5" />
        <path d="M142 271c11-8 23-15 37-21" strokeWidth="4" />
        <path d="M157 245c8-6 17-10 26-14" strokeWidth="4" />
      </g>
    </svg>
  );
}
