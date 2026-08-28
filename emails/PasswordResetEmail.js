const FONT_FAMILY = "Arial, Helvetica, sans-serif";

export default function PasswordResetEmail({ fullName, resetUrl, siteUrl }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body style={{ margin: 0, background: "#f4f4f2", fontFamily: FONT_FAMILY }}>
        <div style={{ padding: "48px 24px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto 24px", paddingLeft: 36 }}>
            <img src={`${siteUrl}/partner-logo-drokex-black.png`} alt="Drokex" height="28" style={{ height: 28, width: "auto" }} />
          </div>

          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid rgba(17,17,17,0.08)",
              padding: "40px 36px",
            }}
          >
            <h1 style={{ margin: "0 0 20px", fontFamily: FONT_FAMILY, fontSize: 22, lineHeight: 1.3, fontWeight: 700, color: "#111111" }}>
              Restablece tu contraseña
            </h1>

            <p style={{ margin: "0 0 16px", fontFamily: FONT_FAMILY, fontSize: 15, lineHeight: 1.6, color: "#111111" }}>
              Hola <strong>{fullName}</strong>,
            </p>

            <p style={{ margin: "0 0 24px", fontFamily: FONT_FAMILY, fontSize: 15, lineHeight: 1.6, color: "rgba(17,17,17,0.72)" }}>
              Recibimos una solicitud para restablecer la contraseña de tu cuenta en Drokex. Haz clic
              en el botón para crear una nueva.
            </p>

            <a
              href={resetUrl}
              style={{
                display: "inline-block",
                background: "#f07a1e",
                color: "#ffffff",
                textDecoration: "none",
                fontFamily: FONT_FAMILY,
                fontSize: 15,
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: 8,
              }}
            >
              Restablecer contraseña →
            </a>

            <div style={{ height: 1, background: "rgba(17,17,17,0.08)", margin: "28px 0 20px" }} />

            <p style={{ margin: 0, fontFamily: FONT_FAMILY, fontSize: 13, lineHeight: 1.6, color: "#666666" }}>
              Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo — tu
              contraseña seguirá siendo la misma.
            </p>
          </div>

          <p style={{ margin: "24px 0 0", fontFamily: FONT_FAMILY, fontSize: 12, color: "rgba(17,17,17,0.45)", textAlign: "center" }}>
            Drokex
          </p>
        </div>
      </body>
    </html>
  );
}
