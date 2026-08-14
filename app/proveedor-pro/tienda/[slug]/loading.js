// Se muestra mientras el server component resuelve la landing.
// Algunas tiendas pesan varios MB (imágenes embebidas en el JSONB) y tardan segundos.
export default function LoadingTienda() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#11100d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <style>{`@keyframes drokex-spin { to { transform: rotate(360deg); } }`}</style>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "4px solid rgba(255,255,255,0.12)",
          borderTopColor: "#7FE040",
          animation: "drokex-spin 0.8s linear infinite",
        }}
      />
      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#fff8ee" }}>
        Cargando tienda...
      </p>
    </div>
  );
}
