import { createRequire } from "module";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^=]+)="?([^"]*)"?$/);
  if (match) process.env[match[1]] = match[2];
}

const { PrismaClient } = await import("../generated/prisma/client/index.js");
const { PrismaPg } = await import("@prisma/adapter-pg");
const { default: pg } = await import("pg");
const bcrypt = await import("bcryptjs");

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PROVIDER_EMAIL = "brandon941194@gmail.com";

// Crear proveedor si no existe
let provider = await prisma.user.findUnique({ where: { email: PROVIDER_EMAIL } });

if (!provider) {
  const hash = await bcrypt.hash("Drokex2025!", 10);
  provider = await prisma.user.create({
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
  // Asegurar que tenga rol PROVIDER
  if (provider.role !== "PROVIDER") {
    provider = await prisma.user.update({
      where: { id: provider.id },
      data: { role: "PROVIDER", plan: "DIRECT" },
    });
  }
  console.log("✅ Proveedor existente:", provider.email);
}

// Asignar todos los productos sin proveedor a este usuario
const updated = await prisma.product.updateMany({
  where: { providerId: null },
  data: { providerId: provider.id },
});

console.log(`✅ Productos asignados: ${updated.count}`);

await pool.end();
