import { readFileSync } from "fs";
import { resolve } from "path";

const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^=]+)="?([^"]*)"?$/);
  if (match) process.env[match[1]] = match[2];
}

const { PrismaClient } = await import("../generated/prisma/client.ts");
const { PrismaPg } = await import("@prisma/adapter-pg");
const { default: pg } = await import("pg");

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const popupBanners = [
  { slot: "popup", imageUrl: "/popup-geu.png", alt: "GEU — Resistencia que perdura. Soluciones en caucho para cada industria", width: 300, height: 600, order: 0 },
  { slot: "popup", imageUrl: "/popup-kliniu.png", alt: "Kliniu — Higiene que se siente, calidad que se nota", width: 300, height: 600, order: 1 },
  { slot: "popup", imageUrl: "/popup-totalpars.png", alt: "TotalPars — Compatibles con tu ruta. Repuestos para vehículos de carga", width: 300, height: 600, order: 2 },
  { slot: "popup", imageUrl: "/popup-lego.png", alt: "LEGO — Construye tu mundo. Imagina. Crea. Juega.", width: 300, height: 600, order: 3 },
  { slot: "popup", imageUrl: "/popup-geu-cuadrado.webp", alt: "GEU — Todo empieza con una buena solución", width: 1080, height: 1080, order: 4 },
  { slot: "popup", imageUrl: "/popup-kliniu-cuadrado.webp", alt: "Kliniu — Limpieza profesional para cada necesidad", width: 1080, height: 1080, order: 5 },
];

const sidebarBanners = [
  { slot: "sidebar", imageUrl: "/popup-geu.png", alt: "GEU — Resistencia que perdura. Soluciones en caucho para cada industria", width: 300, height: 600, order: 0 },
  { slot: "sidebar", imageUrl: "/popup-kliniu.png", alt: "Kliniu — Higiene que se siente, calidad que se nota", width: 300, height: 600, order: 1 },
  { slot: "sidebar", imageUrl: "/popup-totalpars.png", alt: "TotalPars — Compatibles con tu ruta. Repuestos para vehículos de carga", width: 300, height: 600, order: 2 },
  { slot: "sidebar", imageUrl: "/popup-lego.png", alt: "LEGO — Construye tu mundo. Imagina. Crea. Juega.", width: 300, height: 600, order: 3 },
];

const existing = await prisma.banner.count();
if (existing > 0) {
  console.log(`Ya hay ${existing} banners en BD, no se vuelve a sembrar.`);
} else {
  await prisma.banner.createMany({ data: [...popupBanners, ...sidebarBanners] });
  console.log(`✅ Sembrados ${popupBanners.length + sidebarBanners.length} banners.`);
}

await pool.end();
