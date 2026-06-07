"use client";

import { useEffect, useMemo, useState } from "react";
import type { GermplasmEntry } from "@/components/ResultsTable";

type RequestModalProps = {
  entry: GermplasmEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type FormState = {
  requesterName: string;
  phone: string;
  department: string;
  purpose: string;
  quantity: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  requesterName: "",
  phone: "",
  department: "",
  purpose: "",
  quantity: "1",
};

export function RequestModal({ entry, isOpen, onClose, onSuccess }: RequestModalProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initialState);
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const infoRows = useMemo(
    () =>
      entry
        ? [
            { label: "Name/ID", value: entry.name },
            { label: "Species", value: entry.species || "-" },
            { label: "Type", value: entry.type || "-" },
            { label: "Key Descriptors", value: entry.description || "-" },
            { label: "Parentage", value: entry.accession || "-" },
            { label: "Host Institution", value: entry.collection || "-" },
          ]
        : [],
    [entry],
  );

  const activeEntry = entry;

  if (!isOpen || !activeEntry) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeEntry) {
      return;
    }

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId: activeEntry.id,
          entryName: activeEntry.name,
          requesterName: form.requesterName.trim(),
          phone: form.phone.trim(),
          department: form.department.trim(),
          purpose: form.purpose.trim(),
          quantity: Number(form.quantity),
        }),
      });

      const result = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !result.success) {
        setErrors({
          purpose: result.error || "Failed to submit your request.",
        });
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setErrors({
        purpose: "Failed to submit your request.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Request - {activeEntry.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close modal"
          >
            X
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Entry Details</h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {infoRows.map((row) => (
                <div key={row.label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm text-slate-800">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Field
              id="requesterName"
              label="Full Name"
              value={form.requesterName}
              error={errors.requesterName}
              onChange={(value) => setForm((current) => ({ ...current, requesterName: value }))}
            />
            <Field
              id="phone"
              label="Phone Number"
              type="tel"
              value={form.phone}
              error={errors.phone}
              onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
            />
            <Field
              id="department"
              label="Department"
              value={form.department}
              error={errors.department}
              onChange={(value) => setForm((current) => ({ ...current, department: value }))}
            />
            <div>
              <label htmlFor="purpose" className="mb-2 block text-sm font-medium text-slate-700">
                Purpose of Request
              </label>
              <textarea
                id="purpose"
                value={form.purpose}
                onChange={(event) =>
                  setForm((current) => ({ ...current, purpose: event.target.value }))
                }
                rows={4}
                className={`w-full rounded-lg border px-3 py-2 text-sm transition ${
                  errors.purpose ? "border-red-500" : "border-slate-300 focus:border-slate-500"
                }`}
              />
              {errors.purpose ? <p className="mt-2 text-sm text-red-600">{errors.purpose}</p> : null}
            </div>
            <Field
              id="quantity"
              label="Quantity Requested"
              type="number"
              min={1}
              value={form.quantity}
              error={errors.quantity}
              onChange={(value) => setForm((current) => ({ ...current, quantity: value }))}
            />

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  id: keyof FormState;
  label: string;
  value: string;
  error?: string;
  type?: string;
  min?: number;
  onChange: (value: string) => void;
};

function Field({ id, label, value, error, type = "text", min, onChange }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm transition ${
          error ? "border-red-500" : "border-slate-300 focus:border-slate-500"
        }`}
      />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function validate(form: FormState) {
  const errors: FormErrors = {};

  if (!form.requesterName.trim()) {
    errors.requesterName = "Full name is required.";
  }

  if (form.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Phone number must be at least 10 digits.";
  }

  if (!form.department.trim()) {
    errors.department = "Department is required.";
  }

  if (!form.purpose.trim()) {
    errors.purpose = "Purpose of request is required.";
  } else if (form.purpose.trim().length < 20) {
    errors.purpose = "Purpose of request must be at least 20 characters.";
  }

  if (!form.quantity || Number(form.quantity) < 1) {
    errors.quantity = "Quantity requested must be at least 1.";
  }

  return errors;
}
