"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const LIME = "#bef264";
const LIME_DIM = "rgba(190,242,100,";

const COUNTRY_POINTS = [
  { id: "mexico",     name: "México",              lat: 23.6,   lng: -102.5 },
  { id: "guatemala",  name: "Guatemala",            lat: 15.5,   lng: -90.25 },
  { id: "elsalvador", name: "El Salvador",          lat: 13.79,  lng: -88.9  },
  { id: "honduras",   name: "Honduras",             lat: 15.2,   lng: -86.24 },
  { id: "nicaragua",  name: "Nicaragua",            lat: 12.87,  lng: -85.21 },
  { id: "dominicana", name: "Rep. Dominicana",      lat: 18.9,   lng: -70.3  },
  { id: "colombia",   name: "Colombia",             lat: 4.71,   lng: -74.07 },
  { id: "peru",       name: "Perú",                 lat: -9.19,  lng: -75.0  },
];

const ARC_PAIRS = [
  ["mexico", "guatemala"],
  ["guatemala", "honduras"],
  ["honduras", "nicaragua"],
  ["nicaragua", "colombia"],
  ["colombia", "peru"],
];

const arcData = ARC_PAIRS.map(([a, b]) => {
  const from = COUNTRY_POINTS.find(p => p.id === a);
  const to   = COUNTRY_POINTS.find(p => p.id === b);
  return { startLat: from.lat, startLng: from.lng, endLat: to.lat, endLng: to.lng };
});

export default function DrokexGlobe({ onCountrySelect, selectedCountry }) {
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function update() {
      if (containerRef.current) {
        setSize({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        });
      }
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const ctrl = globeRef.current.controls();
    ctrl.autoRotate = true;
    ctrl.autoRotateSpeed = 0.4;
    ctrl.enableZoom = true;
    ctrl.minDistance = 200;
    ctrl.maxDistance = 550;
    globeRef.current.pointOfView({ lat: 10, lng: -82, altitude: 1.9 });
  }, [ready]);

  // Pause rotation when a country is selected, resume on close
  useEffect(() => {
    if (!ready || !globeRef.current) return;
    globeRef.current.controls().autoRotate = !selectedCountry;
  }, [ready, selectedCountry]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Globe
        ref={globeRef}
        width={size.w}
        height={size.h}
        onGlobeReady={() => setReady(true)}

        /* ── Globe surface ── */
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="rgba(0,0,0,0)"
        showGraticules={true}

        /* ── Atmosphere ── */
        atmosphereColor={LIME}
        atmosphereAltitude={0.28}

        /* ── Country dots ── */
        pointsData={COUNTRY_POINTS}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.06}
        pointRadius={0.45}
        pointColor={() => LIME}
        pointLabel=""
        onPointClick={(point) => {
          globeRef.current?.pointOfView(
            { lat: point.lat, lng: point.lng, altitude: 0.9 },
            1000
          );
          onCountrySelect(point.id);
        }}
        onPointHover={(point) => {
          if (globeRef.current) globeRef.current.controls().autoRotate = !point;
          if (containerRef.current) containerRef.current.style.cursor = point ? "pointer" : "grab";
        }}

        /* ── Pulsing rings ── */
        ringsData={COUNTRY_POINTS}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => (t) => `${LIME_DIM}${Math.max(0, 1 - t * 1.8)})`}
        ringMaxRadius={3.5}
        ringPropagationSpeed={2.5}
        ringRepeatPeriod={900}

        /* ── Country labels ── */
        labelsData={COUNTRY_POINTS}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        labelColor={() => LIME}
        labelSize={0.55}
        labelDotRadius={0.25}
        labelAltitude={0.015}
        labelResolution={3}

      />
    </div>
  );
}
