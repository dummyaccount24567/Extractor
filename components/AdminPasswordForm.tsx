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
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Admin Access</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter the admin password to continue.
      </p>
      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-slate-500"
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
      className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      disabled={pending}
    >
      {pending ? "Checking..." : "Unlock Admin"}
    </button>
  );
}
