"use client";

import { useEffect, useState } from "react";

// Devuelve el link correcto para un CTA de "crear cuenta": si ya hay sesión,
// manda a la cuenta del usuario en vez de al formulario de registro.
export function useAccountCta(loggedOutHref = "/registro") {
  const [href, setHref] = useState(loggedOutHref);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/account", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => {
        if (!isMounted || !payload?.user) return;
        const link =
          payload.user.role === "ADMIN"
            ? "/admin"
            : payload.session?.audience === "cliente" || payload.user.role === "CUSTOMER"
              ? "/mi-cuenta?role=cliente"
              : "/mi-cuenta?role=proveedor";
        setHref(link);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [loggedOutHref]);

  return href;
}
