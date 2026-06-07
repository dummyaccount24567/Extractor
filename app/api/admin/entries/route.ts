import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorizedAdminRequest } from "@/lib/admin";

export async function GET(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.germplasmEntry.findMany({
    orderBy: [{ serialNo: "asc" }, { id: "asc" }],
  });

  return NextResponse.json({ entries });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      species?: string;
      type?: string;
      description?: string;
      accession?: string;
      collection?: string;
    };

    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json({ error: "Name/ID is required." }, { status: 400 });
    }

    const existing = await prisma.germplasmEntry.findUnique({
      where: { name },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ error: "A record with this Name/ID already exists." }, { status: 400 });
    }

    const currentMaxSerial = await prisma.germplasmEntry.aggregate({
      _max: { serialNo: true },
    });

    const entry = await prisma.germplasmEntry.create({
      data: {
        serialNo: (currentMaxSerial._max.serialNo ?? 0) + 1,
        name,
        species: normalizeText(body.species),
        type: normalizeText(body.type),
        description: normalizeText(body.description),
        accession: normalizeText(body.accession),
        collection: normalizeText(body.collection),
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error("Manual create failed:", error);
    return NextResponse.json({ error: "Failed to create record." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(request.nextUrl.searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "Record id is required." }, { status: 400 });
  }

  try {
    await prisma.germplasmEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Manual delete failed:", error);
    return NextResponse.json({ error: "Failed to delete record." }, { status: 500 });
  }
}

function normalizeText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
