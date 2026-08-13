const categoryOptions = [
  "Automatizacion industrial",
  "Empaque y logistica",
  "Movilidad electrica",
  "Agroindustria",
  "Retail y consumo",
  "Construccion modular",
];

const availabilityOptions = [
  "Entrega inmediata",
  "Disponible por pedido",
  "Produccion programada",
];

const sampleProducts = [
  {
    slug: "modulo-iot-trazabilidad",
    sku: "DRK-IOT-101",
    supplier: "Nova Tracking Labs",
    originCountry: "Colombia",
    category: "Automatizacion industrial",
    name: "Modulo IoT para trazabilidad de flotas",
    price: 1850000,
    previousPrice: 2150000,
    stock: 18,
    minimumStock: 4,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1563770660941-10a2b4bd6f83?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22731d8c63?auto=format&fit=crop&w=1200&q=80",
    ],
    availability: "Entrega inmediata",
    shortDescription: "Hardware listo para monitoreo de operaciones, mantenimiento y ubicacion.",
    description:
      "Solucion pensada para empresas que necesitan monitorear activos, rutas y eventos operativos con un despliegue rapido y soporte para expansion regional.",
    application: "Operaciones logísticas, seguimiento de flota, trazabilidad de equipos.",
    marketFocus: "Latinoamerica y operadores con expansion regional",
    compatibility: ["Panel web", "Alertas por eventos", "Integracion API"],
    technicalSpecs: [
      { etiqueta: "Conectividad", valor: "4G / GPS / Bluetooth" },
      { etiqueta: "Voltaje", valor: "9V - 36V" },
      { etiqueta: "Uso", valor: "Flotas, activos, logistica" },
    ],
    featured: true,
    active: true,
  },
  {
    slug: "linea-empaque-flexible-oem",
    sku: "DRK-PKG-220",
    supplier: "Pacific Packaging Group",
    originCountry: "China",
    category: "Empaque y logistica",
    name: "Linea OEM de empaque flexible para exportacion",
    price: 920000,
    previousPrice: 1100000,
    stock: 40,
    minimumStock: 10,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1586528116493-5b36f64f5b55?auto=format&fit=crop&w=1200&q=80",
    ],
    availability: "Produccion programada",
    shortDescription: "Solucion de empaque lista para marcas que exportan o escalan volumen.",
    description:
      "Portafolio de bolsas, films y soluciones flexibles para manufactura y exportacion, con acompanamiento en especificaciones y origen.",
    application: "Retail, alimentos, exportacion, marcas propias.",
    marketFocus: "Marcas privadas, distribuidores y operadores de retail",
    compatibility: ["MOQ escalable", "Marca propia", "Despachos globales"],
    technicalSpecs: [
      { etiqueta: "MOQ", valor: "Desde 5.000 unidades" },
      { etiqueta: "Material", valor: "PE / PET / laminados" },
      { etiqueta: "Modalidad", valor: "OEM / private label" },
    ],
    featured: true,
    active: true,
  },
  {
    slug: "estacion-carga-comercial-ac",
    sku: "DRK-EV-315",
    supplier: "Volt Bridge Systems",
    originCountry: "Turquia",
    category: "Movilidad electrica",
    name: "Estacion AC comercial para carga de flotas",
    price: 6400000,
    previousPrice: 7100000,
    stock: 7,
    minimumStock: 2,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    ],
    availability: "Disponible por pedido",
    shortDescription: "Infraestructura lista para operadores de movilidad y parqueaderos comerciales.",
    description:
      "Equipo AC para redes de carga empresarial con opciones de monitoreo, autenticacion y despliegue en parqueaderos, centros logísticos y hubs urbanos.",
    application: "Parqueaderos, operadores de flotas, centros comerciales.",
    marketFocus: "Infraestructura energetica y movilidad urbana",
    compatibility: ["OCPP", "RFID", "App de gestion"],
    technicalSpecs: [
      { etiqueta: "Potencia", valor: "22 kW" },
      { etiqueta: "Conector", valor: "Tipo 2" },
      { etiqueta: "Proteccion", valor: "IP54" },
    ],
    featured: false,
    active: true,
  },
];

module.exports = {
  categoryOptions,
  availabilityOptions,
  sampleProducts,
};
