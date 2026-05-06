"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const COUNTRY_POINTS = [
  { id: "mexico",     name: "México",               lat: 23.6,   lng: -102.5, color: "#fb923c", size: 0.45 },
  { id: "guatemala",  name: "Guatemala",             lat: 15.5,   lng: -90.25, color: "#facc15", size: 0.35 },
  { id: "elsalvador", name: "El Salvador",           lat: 13.79,  lng: -88.9,  color: "#60a5fa", size: 0.3  },
  { id: "honduras",   name: "Honduras",              lat: 15.2,   lng: -86.24, color: "#22d3ee", size: 0.35 },
  { id: "nicaragua",  name: "Nicaragua",             lat: 12.87,  lng: -85.21, color: "#f87171", size: 0.35 },
  { id: "dominicana", name: "Rep. Dominicana",       lat: 18.9,   lng: -70.3,  color: "#fb7185", size: 0.35 },
  { id: "colombia",   name: "Colombia",              lat: 4.71,   lng: -74.07, color: "#a3e635", size: 0.45 },
  { id: "peru",       name: "Perú",                  lat: -9.19,  lng: -75.0,  color: "#38bdf8", size: 0.4  },
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

export default function DrokexGlobe({ onCountrySelect, globeRef: externalRef }) {
  const internalRef = useRef(null);
  const globeRef = externalRef || internalRef;
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
    ctrl.autoRotateSpeed = 0.5;
    ctrl.enableZoom = true;
    ctrl.minDistance = 200;
    ctrl.maxDistance = 600;
    globeRef.current.pointOfView({ lat: 8, lng: -80, altitude: 1.8 });
  }, [ready]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Globe
        ref={globeRef}
        width={size.w}
        height={size.h}
        onGlobeReady={() => setReady(true)}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={COUNTRY_POINTS}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.05}
        pointRadius="size"
        pointColor="color"
        pointLabel="name"
        onPointClick={(point) => onCountrySelect(point.id)}
        onPointHover={(point) => {
          if (globeRef.current) {
            globeRef.current.controls().autoRotate = !point;
          }
          if (containerRef.current) {
            containerRef.current.style.cursor = point ? "pointer" : "grab";
          }
        }}
        arcsData={arcData}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={() => "#bef264"}
        arcAltitude={0.22}
        arcStroke={0.6}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2200}
        atmosphereColor="#a3e635"
        atmosphereAltitude={0.22}
      />
    </div>
  );
}
