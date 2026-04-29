import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { demoUsers } from "@/lib/demo-users";

function mapUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    company: user.company || null,
    phone: user.phone || null,
    role: user.role,
    logoUrl: user.logoUrl || null,
  };
}

export async function getUserById(id) {
  if (prisma) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? mapUser(user) : null;
  }

  const user = demoUsers.find((item) => item.id === id);
  return user ? mapUser(user) : null;
}

export async function authenticateUser(email, password) {
  if (prisma) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new Error("INVALID_CREDENTIALS");
    }

    return mapUser(user);
  }

  const user = demoUsers.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return mapUser(user);
}

export async function createUser(input) {
  const fullName = (input.fullName || "").trim();
  const email = (input.email || "").trim().toLowerCase();
  const password = input.password || "";
  const company = (input.company || "").trim() || null;
  const phone = (input.phone || "").trim() || null;

  if (!fullName || !email || !password) {
    throw new Error("MISSING_FIELDS");
  }

  if (prisma) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("EMAIL_EXISTS");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const role = input.audience === "proveedor" ? "PROVIDER" : "CUSTOMER";
    const logoUrl = (input.logoUrl || "").trim() || null;
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        company,
        phone,
        passwordHash,
        role,
        logoUrl,
      },
    });

    return mapUser(user);
  }

  const exists = demoUsers.some((item) => item.email.toLowerCase() === email);
  if (exists) {
    throw new Error("EMAIL_EXISTS");
  }

  return {
    id: `demo-${Date.now()}`,
    fullName,
    email,
    company,
    phone,
    role: "CUSTOMER",
  };
}
