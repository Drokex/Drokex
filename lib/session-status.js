// 401 = sesión real invalidada. Cualquier otro status (500, timeout, DB blip)
// es un fallo transitorio del fetch, no un logout — no debe limpiar la sesión en UI.
export function shouldClearSession(status) {
  return status === 401;
}
