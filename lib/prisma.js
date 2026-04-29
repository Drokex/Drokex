import { PrismaPg } from "@prisma/adapter-pg";
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

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({ adapter });
}

const cachedPrisma = hasExpectedDelegates(globalForPrisma.prisma ?? null)
  ? globalForPrisma.prisma
  : null;

export const prisma = cachedPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
