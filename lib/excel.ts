import * as XLSX from "xlsx";

type ParsedEntry = {
  serialNo: number;
  name: string;
  genome?: string;
  grinId?: string;
  species?: string;
  type?: string;
  collection?: string;
  accession?: string;
  description?: string;
};

const headerMap: Record<string, keyof ParsedEntry> = {
  "S.No": "serialNo",
  Name: "name",
  Genome: "genome",
  "Grin ID": "grinId",
  Species: "species",
  Type: "type",
  Collection: "collection",
  Accession: "accession",
  Description: "description",
  Traits: "description",
};

export function parseExcelBuffer(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("The uploaded workbook does not contain any sheets.");
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  const parsedRows: ParsedEntry[] = rows
    .map((row) => mapRow(row))
    .filter((row): row is ParsedEntry => Boolean(row && row.name));

  return {
    preview: parsedRows.slice(0, 5),
    rows: parsedRows,
  };
}

function mapRow(row: Record<string, unknown>) {
  const entry = {} as ParsedEntry;

  for (const [header, field] of Object.entries(headerMap)) {
    const rawValue = row[header];

    if (rawValue === undefined || rawValue === null || rawValue === "") {
      continue;
    }

    if (field === "serialNo") {
      entry.serialNo = Number(rawValue) || 0;
      continue;
    }

    entry[field] = String(rawValue).trim();
  }

  if (!entry.name) {
    return null;
  }

  if (!entry.serialNo) {
    entry.serialNo = 0;
  }

  return entry;
}
