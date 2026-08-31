const FONT_FAMILY = "Arial, Helvetica, sans-serif";

export default function PqrEmail({ name, email, type, message, siteUrl }) {
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
            <span
              style={{
                display: "inline-block",
                background: "rgba(127,224,64,0.16)",
                color: "#3d7d16",
                fontFamily: FONT_FAMILY,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "6px 12px",
                borderRadius: 999,
                marginBottom: 16,
              }}
            >
              {type}
            </span>

            <h1 style={{ margin: "0 0 20px", fontFamily: FONT_FAMILY, fontSize: 22, lineHeight: 1.3, fontWeight: 700, color: "#111111" }}>
              Nueva solicitud PQR
            </h1>

            <p style={{ margin: "0 0 24px", fontFamily: FONT_FAMILY, fontSize: 15, lineHeight: 1.6, color: "rgba(17,17,17,0.72)" }}>
              Alguien envió un caso desde el formulario de ayuda en drokex.com. Estos son los datos:
            </p>

            <table cellPadding="0" cellSpacing="0" style={{ width: "100%", marginBottom: 24 }}>
              <tbody>
                <tr>
                  <td style={{ padding: "10px 0", borderTop: "1px solid rgba(17,17,17,0.08)", fontFamily: FONT_FAMILY, fontSize: 13, color: "#666666", width: 120, verticalAlign: "top" }}>
                    Nombre
                  </td>
                  <td style={{ padding: "10px 0", borderTop: "1px solid rgba(17,17,17,0.08)", fontFamily: FONT_FAMILY, fontSize: 15, color: "#111111" }}>
                    {name}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 0", borderTop: "1px solid rgba(17,17,17,0.08)", fontFamily: FONT_FAMILY, fontSize: 13, color: "#666666", width: 120, verticalAlign: "top" }}>
                    Correo
                  </td>
                  <td style={{ padding: "10px 0", borderTop: "1px solid rgba(17,17,17,0.08)", fontFamily: FONT_FAMILY, fontSize: 15 }}>
                    <a href={`mailto:${email}`} style={{ color: "#f07a1e", textDecoration: "none" }}>{email}</a>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 0", borderTop: "1px solid rgba(17,17,17,0.08)", borderBottom: "1px solid rgba(17,17,17,0.08)", fontFamily: FONT_FAMILY, fontSize: 13, color: "#666666", width: 120, verticalAlign: "top" }}>
                    Mensaje
                  </td>
                  <td style={{ padding: "10px 0", borderTop: "1px solid rgba(17,17,17,0.08)", borderBottom: "1px solid rgba(17,17,17,0.08)", fontFamily: FONT_FAMILY, fontSize: 15, lineHeight: 1.6, color: "#111111", whiteSpace: "pre-line" }}>
                    {message}
                  </td>
                </tr>
              </tbody>
            </table>

            <a
              href={`mailto:${email}`}
              style={{
                display: "inline-block",
                background: "#7FE040",
                color: "#111111",
                textDecoration: "none",
                fontFamily: FONT_FAMILY,
                fontSize: 15,
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: 8,
              }}
            >
              Responder a {name.split(" ")[0]} →
            </a>
          </div>

          <p style={{ margin: "24px 0 0", fontFamily: FONT_FAMILY, fontSize: 12, color: "rgba(17,17,17,0.45)", textAlign: "center" }}>
            Drokex — Centro de ayuda
          </p>
        </div>
      </body>
    </html>
  );
}
