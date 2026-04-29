"use client";

import { useEffect, useRef, useState } from "react";
import SiteHeader from "@/app/components/site-header";

const W = 960;
const H = 540;
const GRAVITY = 0.7;
const FRICTION = 0.82;
const SPRITE_FRAMES = 6;
const SPRITE_SRC_W = 1424 / SPRITE_FRAMES;
const SPRITE_SRC_H = 510;

const LEVELS = [
  {
    name: "Nivel 1",
    width: 1800,
    platforms: [
      { x: 0, y: 480, w: 1800, h: 60 },
      { x: 260, y: 390, w: 150, h: 28 },
      { x: 520, y: 330, w: 160, h: 28 },
      { x: 840, y: 390, w: 180, h: 28 },
      { x: 1170, y: 335, w: 180, h: 28 },
    ],
    coins: [
      { x: 300, y: 350 }, { x: 570, y: 290 }, { x: 910, y: 350 },
      { x: 1230, y: 295 }, { x: 1500, y: 430 },
    ],
    enemies: [
      { x: 700, y: 440, w: 42, h: 40, minX: 650, maxX: 900, vx: 2 },
      { x: 1350, y: 440, w: 42, h: 40, minX: 1280, maxX: 1520, vx: 2.4 },
    ],
    flag: { x: 1660, y: 380, w: 44, h: 100 },
  },
  {
    name: "Nivel 2",
    width: 2200,
    platforms: [
      { x: 0, y: 480, w: 675, h: 60 },
      { x: 725, y: 480, w: 535, h: 60 },
      { x: 1390, y: 480, w: 810, h: 60 },
      { x: 360, y: 380, w: 130, h: 28 },
      { x: 640, y: 315, w: 175, h: 28 },
      { x: 1030, y: 380, w: 160, h: 28 },
      { x: 1420, y: 325, w: 160, h: 28 },
      { x: 1750, y: 380, w: 170, h: 28 },
    ],
    coins: [
      { x: 395, y: 340 }, { x: 720, y: 275 }, { x: 1080, y: 340 },
      { x: 1480, y: 285 }, { x: 1810, y: 340 }, { x: 2020, y: 430 },
    ],
    enemies: [
      { x: 860, y: 440, w: 42, h: 40, minX: 780, maxX: 1200, vx: 2.6 },
      { x: 1600, y: 440, w: 42, h: 40, minX: 1450, maxX: 1980, vx: 3 },
    ],
    flag: { x: 2070, y: 380, w: 44, h: 100 },
  },
  {
    name: "Nivel 3",
    width: 2500,
    platforms: [
      { x: 0, y: 480, w: 420, h: 60 },
      { x: 550, y: 480, w: 360, h: 60 },
      { x: 1040, y: 480, w: 380, h: 60 },
      { x: 1560, y: 480, w: 940, h: 60 },
      { x: 300, y: 370, w: 140, h: 28 },
      { x: 620, y: 315, w: 150, h: 28 },
      { x: 980, y: 360, w: 140, h: 28 },
      { x: 1320, y: 300, w: 150, h: 28 },
      { x: 1700, y: 360, w: 150, h: 28 },
      { x: 2040, y: 320, w: 160, h: 28 },
    ],
    coins: [
      { x: 340, y: 330 }, { x: 665, y: 275 }, { x: 1025, y: 320 },
      { x: 1370, y: 260 }, { x: 1760, y: 320 }, { x: 2100, y: 280 },
      { x: 2300, y: 430 },
    ],
    enemies: [
      { x: 610, y: 440, w: 42, h: 40, minX: 560, maxX: 870, vx: 3 },
      { x: 1120, y: 440, w: 42, h: 40, minX: 1060, maxX: 1370, vx: 3.2 },
      { x: 1840, y: 440, w: 42, h: 40, minX: 1600, maxX: 2320, vx: 3.4 },
    ],
    flag: { x: 2380, y: 380, w: 44, h: 100 },
  },
  {
    name: "Nivel 4",
    width: 3000,
    platforms: [
      { x: 0, y: 480, w: 500, h: 60 },
      { x: 630, y: 480, w: 340, h: 60 },
      { x: 1100, y: 480, w: 360, h: 60 },
      { x: 1600, y: 480, w: 400, h: 60 },
      { x: 2120, y: 480, w: 880, h: 60 },
      { x: 280, y: 375, w: 130, h: 28 },
      { x: 570, y: 315, w: 140, h: 28 },
      { x: 890, y: 365, w: 140, h: 28 },
      { x: 1230, y: 310, w: 150, h: 28 },
      { x: 1540, y: 365, w: 150, h: 28 },
      { x: 1880, y: 305, w: 150, h: 28 },
      { x: 2250, y: 365, w: 150, h: 28 },
      { x: 2560, y: 315, w: 160, h: 28 },
    ],
    coins: [
      { x: 320, y: 335 }, { x: 615, y: 275 }, { x: 940, y: 325 },
      { x: 1285, y: 270 }, { x: 1590, y: 325 }, { x: 1935, y: 265 },
      { x: 2310, y: 325 }, { x: 2620, y: 275 }, { x: 2820, y: 430 },
    ],
    enemies: [
      { x: 680, y: 440, w: 42, h: 40, minX: 640, maxX: 930, vx: 3.5 },
      { x: 1180, y: 440, w: 42, h: 40, minX: 1120, maxX: 1420, vx: 3.8 },
      { x: 1720, y: 440, w: 42, h: 40, minX: 1620, maxX: 1960, vx: 4 },
      { x: 2320, y: 440, w: 42, h: 40, minX: 2150, maxX: 2880, vx: 4.2 },
    ],
    flag: { x: 2860, y: 380, w: 44, h: 100 },
  },
];

function newState() {
  return {
    stopped: false,
    currentLevel: 0,
    coins: 0,
    lives: 3,
    cameraX: 0,
    frame: 0,
    player: {
      x: 80, y: 200, w: 46, h: 62,
      vx: 0, vy: 0,
      speed: 0.9, maxSpeed: 8, jumpPower: 16,
      grounded: false, facing: 1,
    },
    levelCoins: LEVELS[0].coins.map((c) => ({ ...c, collected: false })),
    levelEnemies: LEVELS[0].enemies.map((e) => ({ ...e })),
  };
}

export default function AprendePage() {
  const canvasRef = useRef(null);
  const gRef = useRef(null);
  const keysRef = useRef({ left: false, right: false, jump: false });
  const rafRef = useRef(null);

  const [screen, setScreen] = useState("start");
  const [hudCoins, setHudCoins] = useState(0);
  const [hudLevel, setHudLevel] = useState("Nivel 1");
  const [hudLives, setHudLives] = useState(3);

  function startGame() {
    gRef.current = newState();
    setHudCoins(0);
    setHudLevel("Nivel 1");
    setHudLives(3);
    setScreen("playing");
  }

  useEffect(() => {
    if (screen !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const sprite = new Image();
    sprite.src = "/game-sprite.png";

    function overlap(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function resolvePlatforms(axis) {
      const { player } = gRef.current;
      for (const pl of LEVELS[gRef.current.currentLevel].platforms) {
        if (!overlap(player, pl)) continue;
        if (axis === "x") {
          player.x = player.vx > 0 ? pl.x - player.w : pl.x + pl.w;
          player.vx = 0;
        } else {
          if (player.vy > 0) {
            player.y = pl.y - player.h;
            player.vy = 0;
            player.grounded = true;
          } else {
            player.y = pl.y + pl.h;
            player.vy = 0;
          }
        }
      }
    }

    function loadLevel(idx) {
      const g = gRef.current;
      g.currentLevel = idx;
      g.cameraX = 0;
      g.levelCoins = LEVELS[idx].coins.map((c) => ({ ...c, collected: false }));
      g.levelEnemies = LEVELS[idx].enemies.map((e) => ({ ...e }));
      Object.assign(g.player, { x: 80, y: 200, vx: 0, vy: 0, grounded: false });
      setHudLevel(LEVELS[idx].name);
    }

    function loseLife() {
      const g = gRef.current;
      g.lives--;
      if (g.lives <= 0) {
        g.stopped = true;
        setScreen("dead");
      } else {
        setHudLives(g.lives);
        Object.assign(g.player, { x: 80, y: 200, vx: 0, vy: 0, grounded: false });
        g.cameraX = 0;
      }
    }

    // ─── Draw helpers ──────────────────────────────────────────────
    function drawBg(frame) {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#060d1a");
      grad.addColorStop(1, "#0d1f35");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const stars = [
        [50,30],[120,80],[200,20],[320,60],[450,30],[600,70],[720,25],
        [760,90],[80,110],[400,100],[550,50],[850,40],[900,100],
        [150,150],[700,140],[350,170],[480,60],[230,130],
      ];
      for (const [sx, sy] of stars) {
        ctx.globalAlpha = 0.3 + 0.4 * Math.sin(frame * 0.05 + sx);
        ctx.fillStyle = "#fff";
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = "#0a1628";
      const buildings = [
        [0,200,60],[70,220,50],[130,180,70],[210,210,40],[260,170,55],
        [325,195,45],[380,160,65],[455,205,50],[515,175,60],[585,190,55],
        [650,165,70],[730,200,70],[820,180,60],[900,210,55],
      ];
      for (const [bx, by, bw] of buildings) {
        ctx.fillStyle = "#0a1628";
        ctx.fillRect(bx, by, bw, H - by);
        ctx.fillStyle = "rgba(255,133,0,0.18)";
        for (let wy = by + 10; wy < by + 120; wy += 18) {
          for (let wx = bx + 6; wx < bx + bw - 6; wx += 12) {
            if (Math.sin(wx * 3 + wy * 7) > 0.3) ctx.fillRect(wx, wy, 6, 8);
          }
        }
      }
    }

    function drawPlatforms(camX) {
      ctx.save();
      ctx.translate(-camX, 0);
      for (const p of LEVELS[gRef.current.currentLevel].platforms) {
        ctx.fillStyle = "#1a0a00";
        ctx.fillRect(p.x, p.y, p.w, p.h);
        const g2 = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y);
        g2.addColorStop(0, "#ff8500");
        g2.addColorStop(0.5, "#ffb347");
        g2.addColorStop(1, "#ff8500");
        ctx.fillStyle = g2;
        ctx.fillRect(p.x, p.y, p.w, 5);
      }
      ctx.restore();
    }

    function drawCoins(camX, coins) {
      ctx.save();
      ctx.translate(-camX, 0);
      for (const c of coins) {
        if (c.collected) continue;
        ctx.fillStyle = "#ff8500";
        ctx.beginPath();
        ctx.arc(c.x, c.y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("$", c.x, c.y + 3);
      }
      ctx.restore();
    }

    function drawEnemies(camX, enemies) {
      ctx.save();
      ctx.translate(-camX, 0);
      for (const e of enemies) {
        if (e.dead) continue;
        ctx.fillStyle = "#cc0000";
        ctx.fillRect(e.x, e.y, e.w, e.h);
        ctx.fillStyle = "#ff0";
        ctx.fillRect(e.x + 7, e.y + 7, 9, 9);
        ctx.fillRect(e.x + e.w - 16, e.y + 7, 9, 9);
        ctx.fillStyle = "#000";
        ctx.fillRect(e.x + 10, e.y + 10, 4, 4);
        ctx.fillRect(e.x + e.w - 13, e.y + 10, 4, 4);
        ctx.fillStyle = "#fff";
        ctx.fillRect(e.x + 8, e.y + e.h - 10, e.w - 16, 5);
      }
      ctx.restore();
    }

    function drawFlag(camX) {
      const f = LEVELS[gRef.current.currentLevel].flag;
      ctx.save();
      ctx.translate(-camX, 0);
      ctx.fillStyle = "#888";
      ctx.fillRect(f.x + 2, f.y, 6, f.h);
      ctx.fillStyle = "#ff8500";
      ctx.fillRect(f.x + 8, f.y, 50, 28);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GO", f.x + 33, f.y + 20);
      ctx.restore();
    }

    function drawChar(p, frame, camX) {
      ctx.save();
      ctx.translate(p.x - camX + p.w / 2, p.y + p.h / 2);
      ctx.scale(p.facing, 1);
      if (sprite.complete && sprite.naturalWidth > 0) {
        const animFrame = p.grounded ? Math.floor(frame / 5) % SPRITE_FRAMES : 2;
        ctx.drawImage(
          sprite,
          animFrame * SPRITE_SRC_W, 0, SPRITE_SRC_W, SPRITE_SRC_H,
          -p.w / 2, -p.h / 2, p.w, p.h
        );
      } else {
        ctx.fillStyle = "#84cc16";
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }

    function drawHUD(g) {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, W, 44);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = "#ff8500";
      ctx.textAlign = "left";
      ctx.fillText(LEVELS[g.currentLevel].name.toUpperCase(), 16, 28);
      ctx.fillStyle = "#ffd700";
      ctx.textAlign = "center";
      ctx.fillText(`● ${g.coins}`, W / 2, 28);
      ctx.fillStyle = "#ff4444";
      ctx.textAlign = "right";
      ctx.fillText(`♥ ${g.lives}`, W - 16, 28);
    }

    // ─── Game loop ─────────────────────────────────────────────────
    function loop() {
      const g = gRef.current;
      if (!g || g.stopped) return;

      g.frame++;
      const k = keysRef.current;
      const p = g.player;
      const lev = LEVELS[g.currentLevel];

      if (k.left) { p.vx -= p.speed; p.facing = -1; }
      if (k.right) { p.vx += p.speed; p.facing = 1; }
      if (k.jump && p.grounded) { p.vy = -p.jumpPower; p.grounded = false; }

      p.vx = Math.max(Math.min(p.vx * FRICTION, p.maxSpeed), -p.maxSpeed);
      p.vy += GRAVITY;

      p.x += p.vx;
      resolvePlatforms("x");
      p.y += p.vy;
      p.grounded = false;
      resolvePlatforms("y");

      if (p.y > H + 200) {
        loseLife();
        if (g.stopped) return;
      }

      p.x = Math.max(0, Math.min(p.x, lev.width - p.w));
      g.cameraX = Math.max(0, Math.min(p.x - W / 2 + p.w / 2, lev.width - W));

      // Coins
      const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
      for (const c of g.levelCoins) {
        if (!c.collected && Math.hypot(c.x - cx, c.y - cy) < p.w / 2 + 11) {
          c.collected = true;
          g.coins++;
          setHudCoins(g.coins);
        }
      }

      // Enemies
      for (const e of g.levelEnemies) {
        e.x += e.vx;
        if (e.x < e.minX || e.x > e.maxX) e.vx *= -1;
        if (overlap(p, e)) {
          if (p.vy > 2 && p.y + p.h - e.y < 25) {
            e.dead = true;
            p.vy = -10;
          } else {
            loseLife();
            if (g.stopped) return;
            break;
          }
        }
      }
      g.levelEnemies = g.levelEnemies.filter((e) => !e.dead);

      // Flag
      if (overlap(p, lev.flag)) {
        if (g.currentLevel < LEVELS.length - 1) {
          loadLevel(g.currentLevel + 1);
        } else {
          g.stopped = true;
          setScreen("win");
          return;
        }
      }

      ctx.clearRect(0, 0, W, H);
      drawBg(g.frame);
      drawPlatforms(g.cameraX);
      drawCoins(g.cameraX, g.levelCoins);
      drawEnemies(g.cameraX, g.levelEnemies);
      drawFlag(g.cameraX);
      drawChar(p, g.frame, g.cameraX);
      drawHUD(g);

      rafRef.current = requestAnimationFrame(loop);
    }

    function onKeyDown(e) {
      const k = keysRef.current;
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") k.left = true;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") k.right = true;
      if (e.code === "Space" || e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        e.preventDefault();
        k.jump = true;
      }
    }
    function onKeyUp(e) {
      const k = keysRef.current;
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") k.left = false;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") k.right = false;
      if (e.code === "Space" || e.key === "ArrowUp" || e.key.toLowerCase() === "w") k.jump = false;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [screen]);

  function mobileHandlers(key) {
    return {
      onTouchStart: (e) => { e.preventDefault(); keysRef.current[key] = true; },
      onTouchEnd: (e) => { e.preventDefault(); keysRef.current[key] = false; },
      onMouseDown: () => { keysRef.current[key] = true; },
      onMouseUp: () => { keysRef.current[key] = false; },
      onMouseLeave: () => { keysRef.current[key] = false; },
    };
  }

  return (
    <main style={{ minHeight: "100vh", background: "#060d1a" }}>
      <SiteHeader />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 16px 80px" }}>
        <p style={{ color: "#ff8500", fontWeight: 800, letterSpacing: "0.14em", fontSize: "0.75rem", textTransform: "uppercase", margin: "0 0 8px" }}>
          Aprende Drokex
        </p>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, margin: "0 0 6px", textAlign: "center" }}>
          Drokex Platform
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 32px", fontSize: "0.95rem" }}>
          <kbd style={kbdStyle}>←</kbd> <kbd style={kbdStyle}>→</kbd> moverse &nbsp;·&nbsp;{" "}
          <kbd style={kbdStyle}>Espacio</kbd> / <kbd style={kbdStyle}>↑</kbd> saltar
        </p>

        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 0 60px rgba(255,133,0,0.2), 0 0 0 2px rgba(255,133,0,0.3)" }}>
          <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", maxWidth: "100%" }} />

          {screen === "start" && (
            <div style={overlayStyle}>
              <p style={tagStyle}>Drokex Platform</p>
              <h2 style={titleStyle}>¿Listo para jugar?</h2>
              <p style={subStyle}>4 niveles · monedas · enemigos · bandera</p>
              <button onClick={startGame} style={btnStyle}>Comenzar</button>
            </div>
          )}

          {screen === "dead" && (
            <div style={overlayStyle}>
              <p style={{ ...tagStyle, color: "#ff4500" }}>Game Over</p>
              <h2 style={titleStyle}>¡Sin vidas!</h2>
              <p style={subStyle}>Monedas recolectadas: {hudCoins}</p>
              <button onClick={startGame} style={btnStyle}>Intentar de nuevo</button>
            </div>
          )}

          {screen === "win" && (
            <div style={overlayStyle}>
              <p style={{ ...tagStyle, color: "#84cc16" }}>¡Completado!</p>
              <h2 style={titleStyle}>¡Ganaste! 🏆</h2>
              <p style={subStyle}>Terminaste los 4 niveles con {hudCoins} monedas.</p>
              <button onClick={startGame} style={btnStyle}>Jugar de nuevo</button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          <button style={mobileBtnStyle} {...mobileHandlers("left")}>←</button>
          <button style={mobileBtnStyle} {...mobileHandlers("jump")}>↑</button>
          <button style={mobileBtnStyle} {...mobileHandlers("right")}>→</button>
        </div>
      </div>
    </main>
  );
}

const kbdStyle = {
  background: "#1a2a1a", color: "#ff8500",
  padding: "2px 8px", borderRadius: 6, border: "1px solid #ff8500",
};
const overlayStyle = {
  position: "absolute", inset: 0,
  background: "rgba(6,13,26,0.88)", backdropFilter: "blur(4px)",
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", padding: 32,
};
const tagStyle = {
  color: "#ff8500", fontWeight: 800, fontSize: "0.8rem",
  letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px",
};
const titleStyle = { color: "#fff", fontSize: "2rem", fontWeight: 800, margin: "0 0 8px" };
const subStyle = { color: "rgba(255,255,255,0.6)", margin: "0 0 28px", fontSize: "0.95rem" };
const btnStyle = {
  background: "#ff8500", color: "#fff", border: "none",
  borderRadius: 12, padding: "14px 40px", fontSize: "1rem",
  fontWeight: 800, cursor: "pointer", letterSpacing: "0.05em",
};
const mobileBtnStyle = {
  width: 64, height: 52, border: "none", borderRadius: 14,
  background: "#ff8500", fontSize: 24, fontWeight: "bold",
  cursor: "pointer", color: "#fff", touchAction: "none",
};
