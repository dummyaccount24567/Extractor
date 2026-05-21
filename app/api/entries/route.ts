import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search")?.trim() || "";
  const type = searchParams.get("type")?.trim() || "";
  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const limit = Math.max(Number(searchParams.get("limit") || 20), 1);

  const where = {
    ...(type ? { type } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { species: { contains: search } },
          ],
        }
      : {}),
  };

  const [data, total, typeRows] = await Promise.all([
    prisma.germplasmEntry.findMany({
      where,
      orderBy: [{ serialNo: "asc" }, { id: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.germplasmEntry.count({ where }),
    prisma.germplasmEntry.findMany({
      distinct: ["type"],
      select: { type: true },
      where: { type: { not: null } },
      orderBy: { type: "asc" },
    }),
  ]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return NextResponse.json({
    data,
    total,
    page,
    totalPages,
    types: typeRows.map((row) => row.type).filter(Boolean),
  });
}
