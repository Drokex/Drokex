"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import styles from "@/app/mi-cuenta/provider-shell.module.css";

export default function AvatarUpload({ initials, logoUrl }) {
  const [preview, setPreview] = useState(logoUrl || null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const router = useRouter();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      setPreview(base64);
      setSaving(true);

      await fetch("/api/account/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl: base64 }),
      });

      setSaving(false);
      router.refresh();
    };
    reader.readAsDataURL(file);
  }

  return (
    <button
      type="button"
      className={styles.providerCleanAvatarWrap}
      style={{ cursor: "pointer", border: "none", background: "none", padding: 0 }}
      title="Cambiar logo"
      aria-label="Cambiar logo"
      onClick={() => fileRef.current?.click()}
    >
      <div className={styles.providerCleanAvatar} style={{ position: "relative" }}>
        {preview ? (
          <img src={preview} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
        ) : (
          initials
        )}

        {/* Cubre todo el círculo al pasar el mouse. */}
        <div className={styles.providerCleanAvatarOverlay} aria-hidden="true">
          <Camera size={22} strokeWidth={2} color="#fff" />
        </div>

        {saving && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#fff" }}>
            ...
          </div>
        )}
      </div>

      {/* Insinúa que se puede cambiar la foto: visible siempre en la esquina.
          Va fuera del círculo con overflow:hidden para que no se recorte. */}
      <div className={styles.providerCleanAvatarBadge} aria-hidden="true">
        <Camera size={14} strokeWidth={2.4} />
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </button>
  );
}
