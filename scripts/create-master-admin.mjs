import { readFileSync } from "fs";
import { resolve } from "path";
import crypto from "crypto";

// Load .env.local manually
const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^=]+)="?([^"]*)"?$/);
  if (match) process.env[match[1]] = match[2];
}

const { PrismaClient } = await import("../generated/prisma/client.ts");
const { PrismaPg } = await import("@prisma/adapter-pg");
const { default: pg } = await import("pg");
const bcrypt = await import("bcryptjs");

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MASTER_EMAIL = process.argv[2] || "master@drokex.com";
const MASTER_PASSWORD = process.argv[3] || crypto.randomBytes(9).toString("base64url");

let master = await prisma.user.findUnique({ where: { email: MASTER_EMAIL } });
const hash = await bcrypt.hash(MASTER_PASSWORD, 10);

if (!master) {
  master = await prisma.user.create({
    data: {
      fullName: "Master Admin",
      email: MASTER_EMAIL,
      role: "ADMIN",
      plan: "DIRECT",
      passwordHash: hash,
    },
  });
  console.log("✅ Usuario maestro creado:", master.email);
} else {
  master = await prisma.user.update({
    where: { id: master.id },
    data: { role: "ADMIN", plan: "DIRECT", passwordHash: hash },
  });
  console.log("✅ Usuario maestro actualizado:", master.email);
}

console.log("Email:", MASTER_EMAIL);
console.log("Password:", MASTER_PASSWORD);
console.log("PIN admin (ADMIN_EXTRA_PIN en .env.local):", process.env.ADMIN_EXTRA_PIN || "(no seteado)");

await pool.end();
