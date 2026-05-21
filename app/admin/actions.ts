"use server";

import { cookies } from "next/headers";
import { getAdminCookieName } from "@/lib/admin";
import { getEffectiveAdminSettings } from "@/lib/settings";

export async function authenticateAdmin(
  _: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const password = String(formData.get("password") || "");
  const settings = await getEffectiveAdminSettings();

  if (!settings.adminPassword || password !== settings.adminPassword) {
    return { error: "Incorrect admin password.", success: false };
  }

  cookies().set(getAdminCookieName(), password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return { error: undefined, success: true };
}
