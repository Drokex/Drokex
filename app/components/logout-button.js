"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} className="secondary-button secondary-button-dark">
      Cerrar sesión
    </button>
  );
}
