import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getEffectiveAdminSettings } from "@/lib/settings";

const ADMIN_COOKIE = "germplasm-admin-auth";

export async function isAdminAuthenticated() {
  const cookieValue = cookies().get(ADMIN_COOKIE)?.value;

  if (!cookieValue) {
    return false;
  }

  const settings = await getEffectiveAdminSettings();
  return cookieValue === settings.adminPassword;
}

export function getAdminCookieName() {
  return ADMIN_COOKIE;
}

export async function isAuthorizedAdminRequest(request: NextRequest) {
  const cookieValue = request.cookies.get(ADMIN_COOKIE)?.value;

  if (!cookieValue) {
    return false;
  }

  const settings = await getEffectiveAdminSettings();
  return cookieValue === settings.adminPassword;
}
