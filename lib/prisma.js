import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis;

function hasExpectedDelegates(client) {
  if (!client) return false;
  return "product" in client && "inventoryMovement" in client && "quote" in client;
}

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const cachedPrisma = hasExpectedDelegates(globalForPrisma.prisma ?? null)
  ? globalForPrisma.prisma
  : null;

export const prisma = cachedPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
