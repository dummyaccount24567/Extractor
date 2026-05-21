"use client";

import Link from "next/link";
import { useState } from "react";

type SettingsState = {
  portalTitle: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  adminEmail: string;
  adminPassword: string;
  hasSavedSettings: boolean;
};

type DashboardProps = {
  initialSettings: SettingsState;
  stats: {
    entryCount: number;
    requestCount: number;
  };
  recentRequests: Array<{
    id: number;
    entryName: string;
    requesterName: string;
    department: string;
    submittedAt: string;
  }>;
};

export function AdminDashboardClient({
  initialSettings,
  stats,
  recentRequests,
}: DashboardProps) {
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          smtpPort: Number(settings.smtpPort),
        }),
      });

      const result = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !result.success) {
        setError(result.error || "Failed to save settings.");
        return;
      }

      setMessage("Admin settings saved successfully.");
      setSettings((current) => ({ ...current, adminPassword: "", hasSavedSettings: true }));
    } catch {
      setError("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTestEmail() {
    setIsTesting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/settings/test-email", {
        method: "POST",
      });
      const result = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !result.success) {
        setError(result.error || "Failed to send test email.");
        return;
      }

      setMessage("Test email sent successfully.");
    } catch {
      setError("Failed to send test email.");
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Germplasm Entries" value={String(stats.entryCount)} />
        <Card label="Total Requests" value={String(stats.requestCount)} />
        <Card label="Email Config" value={settings.hasSavedSettings ? "Saved" : "Using .env"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Portal & Email Settings</h2>
              <p className="mt-1 text-sm text-slate-600">
                Configure the portal title, admin password, and the SMTP account used for request notifications.
              </p>
            </div>
            <button
              type="button"
              onClick={handleTestEmail}
              disabled={isTesting}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isTesting ? "Sending..." : "Send Test Email"}
            </button>
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSave}>
            <Field
              label="Portal Title"
              value={settings.portalTitle}
              onChange={(value) => setSettings((current) => ({ ...current, portalTitle: value }))}
            />
            <Field
              label="Admin Email"
              type="email"
              value={settings.adminEmail}
              onChange={(value) => setSettings((current) => ({ ...current, adminEmail: value }))}
            />
            <Field
              label="SMTP Host"
              value={settings.smtpHost}
              onChange={(value) => setSettings((current) => ({ ...current, smtpHost: value }))}
            />
            <Field
              label="SMTP Port"
              type="number"
              value={settings.smtpPort}
              onChange={(value) => setSettings((current) => ({ ...current, smtpPort: value }))}
            />
            <Field
              label="SMTP User"
              value={settings.smtpUser}
              onChange={(value) => setSettings((current) => ({ ...current, smtpUser: value }))}
            />
            <Field
              label="SMTP Password"
              type="password"
              value={settings.smtpPass}
              onChange={(value) => setSettings((current) => ({ ...current, smtpPass: value }))}
            />
            <div className="md:col-span-2">
              <Field
                label={
                  settings.hasSavedSettings
                    ? "New Admin Password (leave blank to keep current)"
                    : "Admin Password"
                }
                type="password"
                value={settings.adminPassword}
                onChange={(value) =>
                  setSettings((current) => ({ ...current, adminPassword: value }))
                }
              />
            </div>

            <div className="md:col-span-2">
              {message ? (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {message}
                </p>
              ) : null}
              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
            <div className="mt-4 grid gap-3">
              <Link
                href="/admin/upload"
                className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Open Excel Import
              </Link>
              <Link
                href="/admin/requests"
                className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Review Request Logs
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Recent Requests</h2>
              <Link href="/admin/requests" className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentRequests.length === 0 ? (
                <p className="text-sm text-slate-500">No requests have been submitted yet.</p>
              ) : (
                recentRequests.map((request) => (
                  <div key={request.id} className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-900">{request.entryName}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {request.requesterName} - {request.department}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(request.submittedAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 transition focus:border-slate-500"
      />
    </label>
  );
}
