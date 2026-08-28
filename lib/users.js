import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { demoUsers } from "@/lib/demo-users";
import { UserLookupUnavailableError } from "@/lib/session-status";

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

function findDemoUserByEmail(email) {
  return demoUsers.find((item) => item.email.toLowerCase() === email.toLowerCase());
}

function findDemoUserById(id) {
  return demoUsers.find((item) => item.id === id);
}

function canUseDemoFallback(error) {
  return error instanceof Error && /ENOTFOUND|ECONN|tenant\/user|DATABASE/i.test(error.message);
}

export async function getUserById(id) {
  if (prisma) {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      return user ? mapUser(user) : null;
    } catch (error) {
      if (!canUseDemoFallback(error)) throw error;

      // Los usuarios demo solo cubren las cuentas de ejemplo. Para cualquier
      // otra, un fallo de conexión no significa que la cuenta no exista.
      const demoUser = findDemoUserById(id);
      if (demoUser) return mapUser(demoUser);
      throw new UserLookupUnavailableError(error);
    }
  }

  const user = findDemoUserById(id);
  return user ? mapUser(user) : null;
}

export async function authenticateUser(email, password) {
  if (prisma) {
    try {
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
    } catch (error) {
      if (!canUseDemoFallback(error)) throw error;
    }
  }

  const user = findDemoUserByEmail(email);

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
    role: input.audience === "proveedor" ? "PROVIDER" : "CUSTOMER",
  };
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Genera un token de reset, guarda solo su hash (nunca el valor usable) y una
// expiración de 1h. Pedir un reset nuevo sobreescribe el anterior, así que
// solo el último enlace enviado por correo queda válido.
export async function setResetToken(email) {
  if (!prisma) return null;

  const normalizedEmail = (email || "").trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) return null;

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetTokenHash: hashResetToken(token),
      resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  return { token, user: mapUser(user) };
}

// Cambia la password y consume el token en una sola query atómica: evita que
// dos requests concurrentes con el mismo token puedan reutilizarlo.
export async function consumeResetToken(token, newPassword) {
  if (!prisma || !token || !newPassword) {
    throw new Error("INVALID_OR_EXPIRED_TOKEN");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const { count } = await prisma.user.updateMany({
    where: {
      resetTokenHash: hashResetToken(token),
      resetTokenExpiresAt: { gt: new Date() },
    },
    data: {
      passwordHash,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    },
  });

  if (count === 0) {
    throw new Error("INVALID_OR_EXPIRED_TOKEN");
  }
}
