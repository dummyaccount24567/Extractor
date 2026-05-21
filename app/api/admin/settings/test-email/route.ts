import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin";
import { sendAdminTestEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await sendAdminTestEmail();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send admin test email:", error);
    return NextResponse.json({ error: "Failed to send test email." }, { status: 500 });
  }
}
