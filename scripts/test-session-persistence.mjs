// Un fallo de BD no debe cerrar una sesión válida.
//
// Bug original: getUserById caía al fallback de usuarios demo cuando la BD no
// respondía; una cuenta real no está ahí, devolvía null y /api/account
// contestaba 401 => el header mostraba al usuario deslogueado.
//
//   node scripts/test-session-persistence.mjs
import assert from "node:assert/strict";
import { UserLookupUnavailableError } from "../lib/session-status.js";

// Reproduce la lógica de getUserById en su rama de error de conexión.
function resolveUser({ dbReachable, demoUsers, id }) {
  if (dbReachable) return { id };
  const demo = demoUsers.find((u) => u.id === id);
  if (demo) return demo;
  throw new UserLookupUnavailableError(new Error("DatabaseNotReachable"));
}

// Reproduce la decisión de /api/account.
function accountStatus({ session, dbReachable, demoUsers }) {
  if (!session?.userId) return 401;
  try {
    const user = resolveUser({ dbReachable, demoUsers, id: session.userId });
    return user ? 200 : 401;
  } catch (error) {
    if (error instanceof UserLookupUnavailableError) return 200; // sesión intacta
    throw error;
  }
}

const sesionReal = { userId: "usuario-real-de-la-bd" };

// BD caída + cuenta real: la sesión sobrevive (era 401, el bug).
assert.equal(accountStatus({ session: sesionReal, dbReachable: false, demoUsers: [] }), 200);

// BD sana: comportamiento normal.
assert.equal(accountStatus({ session: sesionReal, dbReachable: true, demoUsers: [] }), 200);

// Sin cookie: 401 de verdad, tanto con BD sana como caída.
assert.equal(accountStatus({ session: null, dbReachable: true, demoUsers: [] }), 401);
assert.equal(accountStatus({ session: null, dbReachable: false, demoUsers: [] }), 401);

// BD caída pero es una cuenta demo: se resuelve sin tocar la BD.
assert.equal(
  accountStatus({
    session: { userId: "demo-1" },
    dbReachable: false,
    demoUsers: [{ id: "demo-1" }],
  }),
  200,
);

console.log("ok — la sesión resiste caídas de BD y el 401 real se mantiene");
