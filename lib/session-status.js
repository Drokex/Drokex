// 401 = sesión real invalidada. Cualquier otro status (500, timeout, DB blip)
// es un fallo transitorio del fetch, no un logout — no debe limpiar la sesión en UI.
export function shouldClearSession(status) {
  return status === 401;
}

// La BD no respondió: no sabemos si el usuario existe. Quien la reciba debe
// distinguirla de "no existe" para no cerrar sesiones válidas por un fallo de red.
export class UserLookupUnavailableError extends Error {
  constructor(cause) {
    super("No se pudo consultar el usuario.");
    this.name = "UserLookupUnavailableError";
    this.cause = cause;
  }
}
