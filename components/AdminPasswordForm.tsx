"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { authenticateAdmin } from "@/app/admin/actions";

const initialState = {
  error: undefined as string | undefined,
  success: false,
};

export function AdminPasswordForm() {
  const [state, formAction] = useFormState(authenticateAdmin, initialState);

  useEffect(() => {
    if (state.success) {
      window.location.reload();
    }
  }, [state.success]);

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-emerald-200/80 bg-white/95 p-6 shadow-[0_28px_80px_-42px_rgba(22,101,52,0.28)]">
      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
        Admin Access
      </span>
      <h1 className="mt-4 text-2xl font-semibold text-emerald-950">Sign in to Genom Data</h1>
      <p className="mt-2 text-sm text-emerald-900/70">Enter the admin password to continue.</p>
      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-emerald-900">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded-2xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 transition focus:border-emerald-500"
            required
          />
          {state.error ? <p className="mt-2 text-sm text-red-600">{state.error}</p> : null}
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-300"
      disabled={pending}
    >
      {pending ? "Checking..." : "Unlock Admin"}
    </button>
  );
}
