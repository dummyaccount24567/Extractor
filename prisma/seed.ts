import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const entries = [
    {
      serialNo: 1,
      name: "MNSUA-FA-F3-2023-03",
      genome: "AD",
      species: "G. hirsicum",
      type: "Cross_developed",
      description: "BN, Drought, Heat Tolerance",
    },
    {
      serialNo: 2,
      name: "MNSUA-FA-F3-2023-05",
      genome: "AD",
      species: "G. hirsicum",
      type: "Cross_developed",
      description: "BN, Fiber quality, CLCuV, Spreading",
    },
    {
      serialNo: 3,
      name: "MNSUA-FA-F3-2023-17",
      genome: "AD",
      species: "G. hirsicum",
      type: "Cross_developed",
      description: "Single stem, HDC line, drought tolerance",
    },
    {
      serialNo: 4,
      name: "MNSUA-FA-F3-2023-20",
      genome: "AD",
      species: "G. hirsicum",
      type: "Cross_developed",
      description: "BN, Fiber quality, CLCuV, Spreading",
    },
    {
      serialNo: 5,
      name: "MNSUA-FA-F4-2022-01",
      genome: "AD",
      species: "G. hirsicum",
      type: "Cross_developed",
      description: "Heat Tolerance",
    },
  ];

  for (const entry of entries) {
    await prisma.germplasmEntry.upsert({
      where: { name: entry.name },
      update: entry,
      create: entry,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
