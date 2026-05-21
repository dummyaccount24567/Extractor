import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRequestNotification } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      entryId,
      entryName,
      requesterName,
      phone,
      department,
      purpose,
      quantity,
    } = body as {
      entryId?: number;
      entryName?: string;
      requesterName?: string;
      phone?: string;
      department?: string;
      purpose?: string;
      quantity?: number;
    };

    const safeEntryName = String(entryName || "").trim();
    const safeRequesterName = String(requesterName || "").trim();
    const safePhone = String(phone || "").trim();
    const safeDepartment = String(department || "").trim();
    const safePurpose = String(purpose || "").trim();
    const normalizedPhone = String(phone || "").replace(/\D/g, "");

    if (
      !entryId ||
      !safeEntryName ||
      !safeRequesterName ||
      normalizedPhone.length < 10 ||
      !safeDepartment ||
      !safePurpose ||
      safePurpose.length < 20 ||
      !quantity ||
      quantity < 1
    ) {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const log = await prisma.requestLog.create({
      data: {
        entryId,
        entryName: safeEntryName,
        requesterName: safeRequesterName,
        phone: safePhone,
        department: safeDepartment,
        purpose: safePurpose,
        quantity,
      },
    });

    try {
      await sendRequestNotification({
        entryName: log.entryName,
        requesterName: log.requesterName,
        phone: log.phone,
        department: log.department,
        purpose: log.purpose,
        quantity: log.quantity,
        submittedAt: log.submittedAt.toLocaleString(),
      });
    } catch (mailError) {
      console.error("Failed to send request email:", mailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Request submission failed:", error);
    return NextResponse.json({ error: "Failed to submit request." }, { status: 500 });
  }
}
