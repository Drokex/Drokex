import { readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^=]+)="?([^"]*)"?$/);
  if (match) process.env[match[1]] = match[2];
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);

  const PROVIDER_EMAIL = "brandon941194@gmail.com";

  let provider: any = await (prisma as any).user.findUnique({ where: { email: PROVIDER_EMAIL } });

  if (!provider) {
    const hash = await bcrypt.hash("Drokex2025!", 10);
    provider = await (prisma as any).user.create({
      data: {
        fullName: "Brandon Drokex",
        email: PROVIDER_EMAIL,
        role: "PROVIDER",
        plan: "DIRECT",
        passwordHash: hash,
      },
    });
    console.log("✅ Proveedor creado:", provider.email);
  } else {
    if (provider.role !== "PROVIDER") {
      provider = await (prisma as any).user.update({
        where: { id: provider.id },
        data: { role: "PROVIDER", plan: "DIRECT" },
      });
    }
    console.log("✅ Proveedor existente:", provider.email);
  }

  const updated = await (prisma as any).product.updateMany({
    where: { providerId: null },
    data: { providerId: provider.id },
  });

  console.log(`✅ Productos asignados: ${updated.count}`);

  await pool.end();
}

main().catch(console.error);
