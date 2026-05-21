import { NextRequest, NextResponse } from "next/server";
import { getAdminCookieName, isAuthorizedAdminRequest } from "@/lib/admin";
import { getEffectiveAdminSettings, upsertAdminSettings } from "@/lib/settings";

export async function GET(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getEffectiveAdminSettings();

  return NextResponse.json({
    portalTitle: settings.portalTitle,
    smtpHost: settings.smtpHost,
    smtpPort: settings.smtpPort,
    smtpUser: settings.smtpUser,
    smtpPass: settings.smtpPass,
    adminEmail: settings.adminEmail,
    adminPassword: "",
    hasSavedSettings: settings.hasSavedSettings,
  });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      portalTitle?: string;
      smtpHost?: string;
      smtpPort?: number | string;
      smtpUser?: string;
      smtpPass?: string;
      adminEmail?: string;
      adminPassword?: string;
    };

    const portalTitle = String(body.portalTitle || "").trim();
    const smtpHost = String(body.smtpHost || "").trim();
    const smtpUser = String(body.smtpUser || "").trim();
    const smtpPass = String(body.smtpPass || "").trim();
    const adminEmail = String(body.adminEmail || "").trim();
    const adminPassword = String(body.adminPassword || "").trim();
    const smtpPort = Number(body.smtpPort || 0);

    if (!portalTitle) {
      return NextResponse.json({ error: "Portal title is required." }, { status: 400 });
    }

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !adminEmail) {
      return NextResponse.json(
        { error: "All email configuration fields are required." },
        { status: 400 },
      );
    }

    if (!adminPassword && !(await getEffectiveAdminSettings()).adminPassword) {
      return NextResponse.json(
        { error: "Admin password is required for first-time setup." },
        { status: 400 },
      );
    }

    const saved = await upsertAdminSettings({
      portalTitle,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      adminEmail,
      adminPassword,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(getAdminCookieName(), saved.adminPassword || adminPassword, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch (error) {
    console.error("Failed to save admin settings:", error);
    return NextResponse.json({ error: "Failed to save settings." }, { status: 500 });
  }
}
