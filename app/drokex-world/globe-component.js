"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const LIME = "#bef264";
const LIME_DIM = "rgba(190,242,100,";

const COUNTRY_POINTS = [
  { id: "mexico",     name: "México",              lat: 23.6,   lng: -102.5, color: "#fb923c" },
  { id: "guatemala",  name: "Guatemala",            lat: 15.5,   lng: -90.25, color: "#facc15" },
  { id: "elsalvador", name: "El Salvador",          lat: 13.79,  lng: -88.9,  color: "#60a5fa" },
  { id: "honduras",   name: "Honduras",             lat: 15.2,   lng: -86.24, color: "#22d3ee" },
  { id: "nicaragua",  name: "Nicaragua",            lat: 12.87,  lng: -85.21, color: "#f87171" },
  { id: "dominicana", name: "Rep. Dominicana",      lat: 18.9,   lng: -70.3,  color: "#fb7185" },
  { id: "colombia",   name: "Colombia",             lat: 4.71,   lng: -74.07, color: "#a3e635" },
  { id: "peru",       name: "Perú",                 lat: -9.19,  lng: -75.0,  color: "#38bdf8" },
];

export default function DrokexGlobe({ onCountrySelect, selectedCountry }) {
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [ready, setReady] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    function update() {
      if (!containerRef.current) return;
      setSize({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!ready || !globeRef.current) return;

    /* Tint the globe surface dark green via Three.js */
    try {
      globeRef.current.scene().traverse(obj => {
        if (obj.isMesh && obj.geometry?.parameters?.radius > 50) {
          obj.material.color?.set("#010c05");
          if (obj.material.emissive) obj.material.emissive.set("#021208");
          if (obj.material.emissiveIntensity !== undefined) obj.material.emissiveIntensity = 1;
        }
      });
    } catch (_) {}

    const ctrl = globeRef.current.controls();
    ctrl.autoRotate = false;
    ctrl.enableZoom = true;
    ctrl.minDistance = 150;
    ctrl.maxDistance = 700;
    globeRef.current.pointOfView({ lat: 12, lng: -78, altitude: 2.6 });
  }, [ready]);

  // Zoom back out when panel closes
  useEffect(() => {
    if (!ready || !globeRef.current) return;
    if (!selectedCountry) {
      globeRef.current.pointOfView({ lat: 12, lng: -78, altitude: 2.6 }, 1200);
    }
  }, [ready, selectedCountry]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", background: "radial-gradient(ellipse at 50% 50%, #001a08 0%, #000 70%)" }}>
      <Globe
        ref={globeRef}
        width={size.w}
        height={size.h}
        onGlobeReady={() => setReady(true)}

        /* Globe surface */
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="rgba(0,0,0,0)"
        showGraticules={true}

        /* Atmosphere */
        atmosphereColor={LIME}
        atmosphereAltitude={0.35}

        /* Country dots */
        pointsData={COUNTRY_POINTS}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.01}
        pointRadius={(d) => hoveredId === d.id ? 1.1 : 0.6}
        pointColor="color"
        pointLabel={(d) => `
          <div style="
            background: rgba(5,5,5,0.85);
            color: ${d.color};
            padding: 7px 16px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 800;
            font-family: sans-serif;
            border: 1.5px solid ${d.color}55;
            box-shadow: 0 0 18px ${d.color}44;
            backdrop-filter: blur(12px);
            white-space: nowrap;
            letter-spacing: 0.02em;
          ">${d.name}</div>
        `}
        onPointClick={(point) => {
          globeRef.current?.pointOfView({ lat: point.lat, lng: point.lng, altitude: 0.35 }, 1400);
          onCountrySelect(point.id);
        }}
        onPointHover={(point) => {
          setHoveredId(point?.id || null);
          if (containerRef.current) containerRef.current.style.cursor = point ? "pointer" : "grab";
        }}

        /* Pulsing rings */
        ringsData={COUNTRY_POINTS}
        ringLat="lat"
        ringLng="lng"
        ringColor={(d) => (t) => {
          const hex = d.color;
          const r = parseInt(hex.slice(1,3),16);
          const g = parseInt(hex.slice(3,5),16);
          const b = parseInt(hex.slice(5,7),16);
          return `rgba(${r},${g},${b},${Math.max(0, 1 - t * 1.6)})`;
        }}
        ringMaxRadius={4}
        ringPropagationSpeed={2.5}
        ringRepeatPeriod={1000}
      />
    </div>
  );
}
