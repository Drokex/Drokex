"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const STRAND_COUNT   = 320;
const SEG_PER_STRAND = 24;
const BASE_SPREAD    = 1.8;

function randomRange(a, b) { return a + Math.random() * (b - a); }

function buildStrand(baseX, baseZ, spread, height, phase) {
  const pts = [];
  const bx = baseX;
  const bz = baseZ;
  const tipX = bx + randomRange(-spread, spread);
  const tipZ = bz + randomRange(-spread * 0.5, spread * 0.5);
  const tipY = randomRange(height * 0.5, height);
  const midX = (bx + tipX) / 2 + randomRange(-0.3, 0.3);
  const midY = tipY * randomRange(0.35, 0.6);
  const midZ = (bz + tipZ) / 2 + randomRange(-0.2, 0.2);

  for (let i = 0; i <= SEG_PER_STRAND; i++) {
    const t = i / SEG_PER_STRAND;
    const mt = 1 - t;
    // Quadratic bezier
    const x = mt * mt * bx + 2 * mt * t * midX + t * t * tipX;
    const y = mt * mt * -1.5 + 2 * mt * t * midY + t * t * tipY;
    const z = mt * mt * bz + 2 * mt * t * midZ + t * t * tipZ;
    pts.push({ x, y, z, t });
  }
  return { pts, phase, tipX, tipZ, tipY, bx, bz };
}

export default function Cables3D({ width = 900, height = 500 }) {
  const mountRef  = useRef(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const frameRef  = useRef(null);

  useEffect(() => {
    const W = mountRef.current?.offsetWidth  || width;
    const H = mountRef.current?.offsetHeight || height;

    // Scene
    const scene    = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const camera   = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 1.5, 7);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    mountRef.current.appendChild(renderer.domElement);

    // Build strands
    const strands = [];
    const lines   = [];

    for (let s = 0; s < STRAND_COUNT; s++) {
      const angle   = randomRange(-Math.PI * 0.72, Math.PI * 0.72);
      const radius  = randomRange(0, BASE_SPREAD);
      const baseX   = Math.sin(angle) * radius;
      const baseZ   = randomRange(-0.6, 0.6);
      const spread  = randomRange(0.4, 1.6);
      const height  = randomRange(1.8, 4.2);
      const phase   = Math.random() * Math.PI * 2;
      const strand  = buildStrand(baseX, baseZ, spread, height, phase);
      strands.push(strand);

      // Geometry
      const positions = new Float32Array((SEG_PER_STRAND + 1) * 3);
      const colors    = new Float32Array((SEG_PER_STRAND + 1) * 3);

      strand.pts.forEach(({ x, y, z, t }, i) => {
        positions[i * 3]     = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        // Color: dark green base → bright green → white tip
        const r = t < 0.6 ? 0.1 + t * 0.6 : 0.6 + (t - 0.6) * 2.4;
        const g = 0.4 + t * 0.6;
        const b = t < 0.5 ? 0.05 : (t - 0.5) * 0.5;
        colors[i * 3]     = Math.min(r, 1);
        colors[i * 3 + 1] = Math.min(g, 1);
        colors[i * 3 + 2] = Math.min(b, 1);
      });

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: randomRange(0.55, 0.95),
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      lines.push({ line, geo, strand });
    }

    // Mouse
    function onMouseMove(e) {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      mouseRef.current.y = ((e.clientY - rect.top)  / rect.height - 0.5) * -2;
    }
    window.addEventListener("mousemove", onMouseMove);

    // Animate
    const clock = new THREE.Clock();
    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      const t   = clock.getElapsedTime();
      const mx  = mouseRef.current.x * 3;
      const my  = mouseRef.current.y * 1.5;

      lines.forEach(({ line, geo, strand }, si) => {
        const pos = geo.attributes.position.array;
        const { pts, phase, bx, bz } = strand;

        pts.forEach(({ x, y, z, t: frac }, i) => {
          // Wave sway
          const sway  = Math.sin(t * 0.9 + phase + frac * 2.5) * 0.06 * frac;
          const sway2 = Math.cos(t * 0.6 + phase * 1.3 + frac * 1.8) * 0.04 * frac;

          // Mouse influence — closer to tip = more influence
          const dx   = bx - mx;
          const dz   = bz - my;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const push = Math.max(0, 1 - dist / 2.5) * frac * 0.35;
          const pushX = (bx - mx) / (dist + 0.001) * push * -1;
          const pushZ = (bz - my) / (dist + 0.001) * push * -0.5;

          pos[i * 3]     = x + sway  + pushX;
          pos[i * 3 + 1] = y + sway2;
          pos[i * 3 + 2] = z + sway * 0.5 + pushZ;
        });
        geo.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
    }
    animate();

    // Resize
    function onResize() {
      const W2 = mountRef.current?.offsetWidth  || width;
      const H2 = mountRef.current?.offsetHeight || height;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      lines.forEach(({ line, geo }) => { geo.dispose(); scene.remove(line); });
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
