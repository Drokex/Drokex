"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="provider-clean-avatar-wrap" style={{ cursor: "pointer" }} title="Cambiar logo" onClick={() => fileRef.current?.click()}>
      <div className="provider-clean-avatar" aria-hidden="true">
        {preview ? (
          <img src={preview} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
        ) : (
          initials
        )}
        {saving && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#fff" }}>
            ...
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}
