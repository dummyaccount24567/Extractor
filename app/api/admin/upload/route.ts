import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseExcelBuffer } from "@/lib/excel";
import { isAuthorizedAdminRequest } from "@/lib/admin";

export async function POST(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please upload an Excel file." }, { status: 400 });
  }

  const isExcelFile =
    file.name.endsWith(".xlsx") ||
    file.name.endsWith(".xls") ||
    file.type.includes("sheet");

  if (!isExcelFile) {
    return NextResponse.json({ error: "Only .xlsx and .xls files are supported." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { rows, preview } = parseExcelBuffer(buffer);

    const names = rows.map((row) => row.name);
    const duplicateNamesInFile = new Set<string>();
    const seenInFile = new Set<string>();

    for (const name of names) {
      if (seenInFile.has(name)) {
        duplicateNamesInFile.add(name);
      }
      seenInFile.add(name);
    }

    const existing = await prisma.germplasmEntry.findMany({
      where: { name: { in: names } },
      select: { name: true },
    });

    const existingNames = new Set(existing.map((row) => row.name));
    const uniqueRows = rows.filter((row) => !duplicateNamesInFile.has(row.name) && !existingNames.has(row.name));

    let imported = 0;

    if (uniqueRows.length > 0) {
      const result = await prisma.germplasmEntry.createMany({
        data: uniqueRows,
      });
      imported = result.count;
    }

    return NextResponse.json({
      imported,
      skipped: rows.length - imported,
      preview,
      duplicateNames: [...new Set([...duplicateNamesInFile, ...existing.map((row) => row.name)])],
    });
  } catch (error) {
    console.error("Excel import failed:", error);
    return NextResponse.json({ error: "Failed to import the uploaded file." }, { status: 500 });
  }
}
