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
const TOTAL_LEVELS = 15;
const HIGH_SCORE_STORAGE_KEY = "drokex-game-high-scores";
const POWER_COST = 40;
const POWER_COOLDOWN = 50;

function buildLevel(index) {
  const difficulty = index + 1;
  const isFinalLevel = index === 14;
  const isBoss = (difficulty % 3 === 0) || isFinalLevel;
  const castleNum = isFinalLevel ? 5 : (isBoss ? Math.ceil(difficulty / 3) : 0);
  const width = 2500 + index * 420;

  const platforms = [];
  const groundSegments = Math.min(3 + Math.floor(index * 0.55), 11);
  const gap = 68 + index * 13;
  const minGroundWidth = 240;
  const totalGapWidth = gap * (groundSegments - 1);
  const segmentWidth = Math.max(minGroundWidth, Math.floor((width - totalGapWidth) / groundSegments));
  let x = 0;
  for (let i = 0; i < groundSegments; i++) {
    const isLast = i === groundSegments - 1;
    platforms.push({ x, y: 480, w: isLast ? width - x : segmentWidth, h: 60 });
    x += segmentWidth + gap;
  }

  const floatingCount = 5 + Math.floor(index * 1.4);
  for (let i = 0; i < floatingCount; i++) {
    const px = 300 + i * Math.max(175, Math.floor((width - 580) / Math.max(1, floatingCount - 1)));
    const yPattern = [370, 310, 345, 285, 330, 295];
    const py = yPattern[(i + index) % yPattern.length] - Math.min(index * 5, 40);
    platforms.push({
      x: Math.min(px, width - 260),
      y: Math.max(230, py),
      w: Math.max(80, 172 - index * 7),
      h: 28,
    });
  }

  const coins = [];
  const coinCount = 14 + index * 2;
  for (let i = 0; i < coinCount; i++) {
    const basePlatform = platforms[3 + (i % floatingCount)] || platforms[i % platforms.length];
    coins.push({
      x: Math.min(basePlatform.x + basePlatform.w / 2 + (i % 3 - 1) * 22, width - 140),
      y: basePlatform.y - 38,
    });
  }
  coins.push({ x: width - 220, y: 430 });

  const enemies = [];
  const baseSpeed = 2.4 + index * 0.45;

  if (!isFinalLevel) {
    const enemyCount = Math.min(4 + Math.floor(index * 0.95), 14);
    for (let i = 0; i < enemyCount; i++) {
      const ground = platforms[i % groundSegments];
      const minX = ground.x + 45;
      const maxX = Math.max(minX + 130, ground.x + ground.w - 80);
      const startX = ground.x < 300 ? Math.max(minX + 30, Math.min(500, maxX - 10)) : minX + 30;
      const ex = Math.max(minX, Math.min(startX, maxX - 10));
      const isChaser = index >= 3 && (i % Math.max(1, 5 - Math.floor(index / 3)) === 0);
      const canShoot = index >= 5 && !isChaser && (i % Math.max(1, 4 - Math.floor(index / 4)) === 1);
      enemies.push({
        x: ex, y: 440, w: 44, h: 42,
        minX, maxX,
        vx: baseSpeed + i * 0.18,
        isChaser,
        canShoot,
        shootCooldown: canShoot ? 60 + Math.random() * 80 : 0,
        maxShootCooldown: Math.max(50, 140 - index * 6),
        isVoid: index >= 12,
      });
    }
    const flyingCount = 1 + Math.floor(index * 0.7);
    for (let i = 0; i < flyingCount; i++) {
      const fx = 500 + i * Math.floor((width - 700) / Math.max(1, flyingCount));
      const baseY = 180 + (i % 4) * 55;
      const isChaser = index >= 6 && (i % Math.max(1, 3 - Math.floor(index / 5)) === 0);
      const canShoot = index >= 5 && !isChaser && (i % 2 === 0);
      enemies.push({
        x: Math.min(fx, width - 200), y: baseY, w: 42, h: 36,
        minX: Math.max(280, fx - 260), maxX: Math.min(width - 100, fx + 260),
        vx: 2.8 + index * 0.35 + i * 0.14,
        isFlying: true, baseY, floatPhase: i * (Math.PI / 2.2),
        isChaser,
        canShoot,
        shootCooldown: canShoot ? 40 + Math.random() * 60 : 0,
        maxShootCooldown: Math.max(45, 130 - index * 7),
        isVoid: index >= 12,
      });
    }
  } else {
    for (let i = 0; i < 7; i++) {
      const fx = 400 + i * Math.floor((width - 600) / 6);
      const baseY = 140 + (i % 3) * 80;
      enemies.push({
        x: Math.min(fx, width - 200), y: baseY, w: 44, h: 38,
        minX: Math.max(180, fx - 350), maxX: Math.min(width - 100, fx + 350),
        vx: 4.2 + i * 0.3, isFlying: true, baseY, floatPhase: i * (Math.PI / 2.5),
        isChaser: i % 2 === 0,
        canShoot: i % 2 === 1,
        shootCooldown: 50 + i * 15,
        maxShootCooldown: 55,
        isVoid: true,
      });
    }
  }

  if (isFinalLevel) {
    const midX = Math.floor(width * 0.5);
    enemies.push({
      x: midX, y: 200, w: 110, h: 110,
      minX: 60, maxX: width - 160,
      vx: 0, hp: 18, maxHp: 18,
      isBosse: true, isFinalBoss: true,
      canShoot: true, shootCooldown: 80, maxShootCooldown: 60,
      isVoid: true,
    });
  } else if (isBoss) {
    const midX = Math.floor(width * 0.55);
    const bossHP = 3 * castleNum + 2;
    const bossW = 62 + castleNum * 14;
    const bossH = 62 + castleNum * 9;
    enemies.push({
      x: midX, y: 480 - bossH, w: bossW, h: bossH,
      minX: midX - 280, maxX: midX + 280,
      vx: 1.6 + index * 0.2, hp: bossHP, maxHp: bossHP,
      isBosse: true, castleNum,
      canShoot: castleNum >= 3,
      shootCooldown: 90, maxShootCooldown: 80,
    });
    for (let fi = 0; fi < castleNum - 1; fi++) {
      const fmx = midX + (fi % 2 === 0 ? -400 : 400);
      const fmy = 200 + fi * 55;
      const isChaser = fi % 2 === 0 && castleNum >= 3;
      enemies.push({
        x: fmx, y: fmy, w: 44, h: 38,
        minX: midX - 580, maxX: midX + 580,
        vx: 3 + castleNum * 0.5, isFlying: true, baseY: fmy, floatPhase: fi * Math.PI,
        isChaser,
        canShoot: !isChaser && castleNum >= 4,
        shootCooldown: 70 + fi * 20,
        maxShootCooldown: 75,
      });
    }
  }

  return {
    name: isFinalLevel ? "Jefe del Vacío" : isBoss ? `Castillo ${castleNum}` : `Nivel ${difficulty}`,
    isBoss, isFinalLevel, castleNum, width, platforms, coins, enemies,
    flag: { x: width - 160, y: 380, w: 44, h: 100 },
  };
}

const LEVELS = Array.from({ length: TOTAL_LEVELS }, (_, i) => buildLevel(i));

function newState() {
  return {
    stopped: false, currentLevel: 0, coins: 0, lives: 3,
    cameraX: 0, frame: 0, projectiles: [], enemyProjectiles: [],
    impacts: [], particles: [], screenShake: 0,
    powerCooldown: 0, megaPower: 0, bossAnnounce: 0, levelAnnounce: 90,
    invincibleFrames: 80, // grace period at game start
    doubleJumpFlash: 0, killScore: 0, bossBlockFlash: 0, autoPlay: false, hasPower: false,
    player: {
      x: 80, y: 200, w: 46, h: 62, vx: 0, vy: 0,
      speed: 0.9, maxSpeed: 8, jumpPower: 16,
      grounded: false, facing: 1, jumpsLeft: 2,
    },
    levelCoins: LEVELS[0].coins.map((c) => ({ ...c, collected: false })),
    levelEnemies: LEVELS[0].enemies.map((e) => ({ ...e })),
  };
}

export default function AprendePage() {
  const canvasRef = useRef(null);
  const gRef = useRef(null);
  const keysRef = useRef({ left: false, right: false, jump: false, jumpPressed: false, power: false, sprint: false });
  const rafRef = useRef(null);
  const audioRef = useRef(null);

  const [screen, setScreen] = useState("start");
  const [hudCoins, setHudCoins] = useState(0);
  const [hudLives, setHudLives] = useState(3);
  const [finalScore, setFinalScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [highScores, setHighScores] = useState([]);
  const [savingScore, setSavingScore] = useState(false);

  const LS_KEY = "drokex-game-scores-v2";

  function lsGetScores() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
  }

  function lsSaveScore(name, score) {
    const list = lsGetScores();
    list.push({ id: Date.now(), name, score, createdAt: new Date().toISOString() });
    list.sort((a, b) => b.score - a.score);
    localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 20)));
    return list;
  }

  async function fetchScores() {
    try {
      const res = await fetch("/api/game-scores");
      if (!res.ok) throw new Error("api-fail");
      const data = await res.json();
      const apiScores = Array.isArray(data.scores) ? data.scores : [];
      if (apiScores.length > 0) {
        setHighScores(apiScores);
        return;
      }
    } catch {}
    setHighScores(lsGetScores());
  }

  useEffect(() => { fetchScores(); }, []);

  function calculateScore(game) {
    return game.coins * 25 + game.lives * 150 + (game.currentLevel + 1) * 120 + (game.killScore || 0);
  }

  function ensureAudio() {
    if (typeof window === "undefined") return null;
    if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (audioRef.current.state === "suspended") audioRef.current.resume().catch(() => {});
    return audioRef.current;
  }

  function startGame() {
    ensureAudio();
    gRef.current = newState();
    setHudCoins(0); setHudLives(3); setFinalScore(0); setPlayerName("");
    setScreen("playing");
  }

  async function saveHighScore(e) {
    e.preventDefault();
    if (finalScore < 0) { setScreen("scores"); return; }
    const name = playerName.trim() || "Jugador";
    setSavingScore(true);

    // Siempre guardar en localStorage primero
    const localList = lsSaveScore(name, finalScore);

    // Intentar guardar en API
    try {
      const res = await fetch("/api/game-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score: finalScore }),
      });
      if (res.ok) {
        await fetchScores();
      } else {
        setHighScores(localList);
      }
    } catch {
      setHighScores(localList);
    }

    setSavingScore(false);
    setScreen("scores");
  }

  useEffect(() => {
    if (screen !== "playing") return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const sprite = new Image();
    sprite.src = "/game-sprite.png";
    const bgImages = ["/aprende-bg-city.png", "/aprende-bg-volcano.png", "/aprende-bg-forest.png", "/aprende-bg-ghost.png", "/aprende-bg-ghost.png"].map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    const enemySheet = new Image();
    enemySheet.src = "/aprende-enemies.png";
    const explosionSheet = new Image();
    explosionSheet.src = "/aprende-explosions.png";

    function playSound(type) {
      const audio = audioRef.current;
      if (!audio) return;
      const now = audio.currentTime;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      const filter = audio.createBiquadFilter();
      const cfg = {
        coin: [980, 1480, 0.09, "triangle", 0.035],
        jump: [220, 520, 0.12, "sine", 0.035],
        shoot: [620, 180, 0.12, "sawtooth", 0.025],
        hit: [160, 54, 0.16, "square", 0.04],
        level: [440, 880, 0.18, "triangle", 0.045],
        win: [520, 1320, 0.42, "sine", 0.04],
      }[type] || [300, 120, 0.1, "sine", 0.03];
      const [from, to, dur, wave, vol] = cfg;
      osc.type = wave;
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(type === "shoot" ? 1800 : 3200, now);
      osc.frequency.setValueAtTime(from, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(35, to), now + dur);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audio.destination);
      osc.start(now);
      osc.stop(now + dur + 0.03);
    }

    function spawnImpact(x, y, type = "hit") {
      const g = gRef.current;
      const theme = worldTheme(g.currentLevel);
      g.screenShake = Math.max(g.screenShake, type === "boss" ? 14 : 8);
      g.impacts.push({ x, y, age: 0, maxAge: type === "boss" ? 26 : 18, type });
      const count = type === "boss" ? 22 : 12;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + g.frame * 0.03;
        const speed = 1.6 + (i % 5) * 0.75;
        g.particles.push({
          x, y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 1.2,
          life: type === "boss" ? 34 : 24,
          age: 0,
          size: 2 + (i % 4),
          color: i % 3 === 0 ? "#fff" : theme.glow,
        });
      }
    }

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
            player.y = pl.y - player.h; player.vy = 0;
            player.grounded = true; player.jumpsLeft = 2;
          } else { player.y = pl.y + pl.h; player.vy = 0; }
        }
      }
    }

    function loadLevel(idx) {
      const g = gRef.current;
      g.currentLevel = idx;
      g.cameraX = 0;
      g.levelCoins = LEVELS[idx].coins.map((c) => ({ ...c, collected: false }));
      g.levelEnemies = LEVELS[idx].enemies.map((e) => ({ ...e }));
      g.projectiles = [];
      g.enemyProjectiles = [];
      g.impacts = [];
      g.particles = [];
      g.screenShake = 12;
      g.powerCooldown = 0;
      g.invincibleFrames = 80; // grace period on level entry
      g.doubleJumpFlash = 0;
      g.bossBlockFlash = 0;
      g.bossAnnounce = LEVELS[idx].isBoss ? (LEVELS[idx].isFinalLevel ? 220 : 180) : 0;
      g.levelAnnounce = LEVELS[idx].isBoss ? 0 : 90;
      Object.assign(g.player, { x: 80, y: 200, vx: 0, vy: 0, grounded: false, jumpsLeft: 2 });
      playSound("level");
    }

    function loseLife() {
      const g = gRef.current;
      g.hasPower = false;
      g.lives--;
      if (g.lives <= 0) { g.stopped = true; setHudLives(0); setFinalScore(calculateScore(g)); setScreen("dead"); }
      else {
        setHudLives(g.lives);
        g.projectiles = [];
        g.enemyProjectiles = [];
        g.impacts = [];
        g.particles = [];
        g.screenShake = 16;
        g.invincibleFrames = 110;
        g.bossBlockFlash = 0;
        Object.assign(g.player, { x: 80, y: 200, vx: 0, vy: 0, grounded: false, jumpsLeft: 2 });
        g.cameraX = 0;
      }
    }

    // ─── Kill helper ───────────────────────────────────────────────
    function awardKill(e) {
      const g = gRef.current;
      if (e.isFinalBoss) {
        g.killScore += 200;
      } else if (e.isBosse) {
        g.killScore += 100;
        // Ganar vida al matar jefe de castillo
        if (e.hp <= 1) {
          g.lives++;
          setHudLives(g.lives);
          spawnImpact(e.x + e.w / 2, e.y - 20, "boss");
          g.screenShake = 8;
        }
      } else if (e.isFlying) {
        g.killScore += 80;
      } else {
        g.killScore += 50;
      }
    }

    function spawnDropCoins(e) {
      const g = gRef.current;
      const count = (e.isFinalBoss || e.isBosse) ? 10 : 5;
      const cx = e.x + e.w / 2;
      const cy = e.y + e.h / 2;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const dist = 22 + Math.random() * 48;
        g.levelCoins.push({
          x: cx + Math.cos(angle) * dist,
          y: Math.max(32, cy + Math.sin(angle) * dist - 18),
          collected: false,
        });
      }
      // extra explosion flash on death
      spawnImpact(cx, cy, e.isBosse || e.isFinalBoss ? "boss" : "hit");
    }

    // world 0=ciudad, 1=volcán, 2=bosque, 3=fantasma, 4=vacío
    function worldOf(idx) { return Math.min(4, Math.floor(idx / 3)); }
    function worldTheme(idx) {
      const w = worldOf(idx);
      if (w === 1) return { glow: "#ff5a00", glowSoft: "rgba(255,90,0,0.25)", edge: "#ff7a00", accent: "#ffd166", fog: "rgba(255,64,0,0.12)" };
      if (w === 2) return { glow: "#00ff66", glowSoft: "rgba(0,255,102,0.22)", edge: "#12d66f", accent: "#a7ff83", fog: "rgba(0,255,102,0.1)" };
      if (w === 3) return { glow: "#84d8ff", glowSoft: "rgba(132,216,255,0.22)", edge: "#62b7ff", accent: "#d8f4ff", fog: "rgba(120,170,255,0.12)" };
      if (w === 4) return { glow: "#cc44ff", glowSoft: "rgba(204,68,255,0.22)", edge: "#aa00ff", accent: "#ee88ff", fog: "rgba(100,0,200,0.15)" };
      return { glow: "#ff9b21", glowSoft: "rgba(255,155,33,0.23)", edge: "#ff8500", accent: "#ffe08a", fog: "rgba(255,133,0,0.1)" };
    }
    function roundRect(x, y, w, h, r) {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.lineTo(x + w - rr, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
      ctx.lineTo(x + w, y + h - rr);
      ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      ctx.lineTo(x + rr, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
      ctx.lineTo(x, y + rr);
      ctx.quadraticCurveTo(x, y, x + rr, y);
      ctx.closePath();
    }

    // ─── Draw helpers ──────────────────────────────────────────────
    function drawBg(frame) {
      const lev = LEVELS[gRef.current.currentLevel];
      const w = worldOf(gRef.current.currentLevel);
      const bg = bgImages[w];
      if (bg?.complete && bg.naturalWidth > 0) {
        const drift = (gRef.current.cameraX * 0.07) % W;
        ctx.drawImage(bg, -drift, 0, W, H);
        ctx.drawImage(bg, W - drift, 0, W, H);
        ctx.globalAlpha = lev.isBoss ? 0.34 : 0.18;
        ctx.fillStyle = lev.isBoss ? "rgba(0,0,0,0.42)" : "rgba(0,0,0,0.16)";
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
        return;
      }
      const stars = [
        [50,30],[120,80],[200,20],[320,60],[450,30],[600,70],[720,25],
        [760,90],[80,110],[400,100],[550,50],[850,40],[900,100],
        [150,150],[700,140],[350,170],[480,60],[230,130],[810,55],[660,120],
      ];

      if (w === 3) {
        // ── Mundo 3: Reino Fantasma ──
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, "#000008"); g.addColorStop(1, "#060018");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        for (const [sx, sy] of stars) {
          ctx.globalAlpha = 0.28 + 0.45 * Math.sin(frame * 0.05 + sx);
          ctx.fillStyle = "#aaddff"; ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.globalAlpha = 1;
        for (let oi = 0; oi < 12; oi++) {
          const ox = (oi * 137 + frame * 0.18) % W;
          const oy = 60 + ((oi * 83 + frame * 0.12) % (H - 160));
          ctx.globalAlpha = 0.05 + 0.03 * Math.sin(frame * 0.04 + oi);
          ctx.fillStyle = "#88ccff";
          ctx.beginPath(); ctx.arc(ox, oy, 5 + (oi % 3) * 4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;

      } else if (w === 2) {
        // ── Mundo 2: Bosque Maldito ──
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, lev.isBoss ? "#000600" : "#000a00");
        g.addColorStop(1, lev.isBoss ? "#000e00" : "#001400");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        for (const [sx, sy] of stars) {
          ctx.globalAlpha = 0.2 + 0.35 * Math.sin(frame * 0.05 + sx);
          ctx.fillStyle = "#88ff88"; ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.globalAlpha = 1;
        // Green eerie moon
        ctx.globalAlpha = 0.16; ctx.fillStyle = "#44ff44";
        ctx.beginPath(); ctx.arc(760, 55, 42, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.07;
        ctx.beginPath(); ctx.arc(760, 55, 62, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        if (lev.isBoss) {
          // Shadow castle — dark green battlements
          const towers = [[0,170,80],[88,144,58],[158,168,70],[278,136,92],[408,155,60],[498,126,82],[618,150,64],[720,140,76],[828,160,70],[918,136,60]];
          for (const [cx, cy, cw] of towers) {
            ctx.fillStyle = "#010e01"; ctx.fillRect(cx, cy, cw, H - cy);
            ctx.fillStyle = "#000800";
            for (let bx = cx; bx < cx + cw - 8; bx += 17) ctx.fillRect(bx, cy - 16, 10, 16);
            ctx.fillStyle = "rgba(0,180,60,0.14)";
            for (let wy = cy + 18; wy < cy + 105; wy += 24)
              for (let wx = cx + 8; wx < cx + cw - 8; wx += 18)
                if (Math.sin(wx * 3 + wy * 5) > 0.25) ctx.fillRect(wx, wy, 8, 12);
          }
        } else {
          // Twisted trees
          const trees = [[20,130],[85,108],[168,138],[268,116],[375,132],[485,112],[588,128],[688,106],[796,122],[886,132]];
          for (const [tx, ty] of trees) {
            ctx.fillStyle = "#020e02"; ctx.fillRect(tx - 7, ty, 14, H - ty);
            ctx.strokeStyle = "#020e02"; ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(tx, ty + 22); ctx.lineTo(tx - 28, ty - 8);
            ctx.moveTo(tx, ty + 44); ctx.lineTo(tx + 26, ty + 18);
            ctx.moveTo(tx, ty + 62); ctx.lineTo(tx - 20, ty + 44);
            ctx.stroke();
            ctx.globalAlpha = 0.05 + 0.025 * Math.sin(frame * 0.04 + tx);
            ctx.fillStyle = "#003300";
            ctx.beginPath(); ctx.arc(tx, ty - 8, 38, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
          }
        }

      } else if (w === 1) {
        // ── Mundo 1: Volcán ──
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, lev.isBoss ? "#150000" : "#1a0000");
        g.addColorStop(0.7, lev.isBoss ? "#2a0500" : "#300500");
        g.addColorStop(1, "#1a0200");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // Lava glow bottom
        ctx.globalAlpha = 0.28 + 0.1 * Math.sin(frame * 0.04);
        const lavaG = ctx.createLinearGradient(0, H - 90, 0, H);
        lavaG.addColorStop(0, "rgba(255,60,0,0)"); lavaG.addColorStop(1, "rgba(255,80,0,0.5)");
        ctx.fillStyle = lavaG; ctx.fillRect(0, H - 90, W, 90);
        ctx.globalAlpha = 1;
        for (const [sx, sy] of stars) {
          ctx.globalAlpha = 0.15 + 0.25 * Math.sin(frame * 0.05 + sx);
          ctx.fillStyle = "#ffaa66"; ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.globalAlpha = 1;
        if (lev.isBoss) {
          // Lava castle — dark red battlements
          const towers = [[0,175,82],[92,148,56],[162,172,72],[282,138,94],[412,158,62],[502,128,84],[622,153,66],[724,143,78],[832,163,72],[922,138,62]];
          for (const [cx, cy, cw] of towers) {
            ctx.fillStyle = "#1c0200"; ctx.fillRect(cx, cy, cw, H - cy);
            ctx.fillStyle = "#120000";
            for (let bx = cx; bx < cx + cw - 8; bx += 17) ctx.fillRect(bx, cy - 16, 10, 16);
            ctx.fillStyle = "rgba(255,60,0,0.12)";
            for (let wy = cy + 18; wy < cy + 105; wy += 24)
              for (let wx = cx + 8; wx < cx + cw - 8; wx += 18)
                if (Math.sin(wx * 3 + wy * 5) > 0.25) ctx.fillRect(wx, wy, 8, 12);
          }
        } else {
          // Underground cave: stalactites + lava cracks
          const stalactites = [[30,18,70],[90,14,50],[160,20,80],[240,12,45],[310,22,90],[400,16,60],[480,24,75],[560,14,55],[640,20,70],[720,18,85],[800,16,50],[880,22,65]];
          for (const [sx, sw, sh] of stalactites) {
            ctx.fillStyle = "#1a0800";
            ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx + sw, 0); ctx.lineTo(sx + sw / 2, sh); ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 0.2 + 0.12 * Math.sin(frame * 0.06 + sx);
            ctx.fillStyle = "#ff4400";
            ctx.beginPath(); ctx.arc(sx + sw / 2, sh, 4, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
          }
          // Lava crack lines
          ctx.strokeStyle = "rgba(255,80,0,0.12)"; ctx.lineWidth = 1;
          [[100,200,200,360],[320,150,420,310],[600,180,700,400],[800,220,900,380]].forEach(([x1,y1,x2,y2]) => {
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo((x1+x2)/2+20,(y1+y2)/2); ctx.lineTo(x2,y2); ctx.stroke();
          });
        }

      } else if (w === 4) {
        // ── Mundo 4: El Vacío ──
        const gv = ctx.createLinearGradient(0, 0, 0, H);
        gv.addColorStop(0, "#000000"); gv.addColorStop(1, "#0a0018");
        ctx.fillStyle = gv; ctx.fillRect(0, 0, W, H);
        const stars = [
          [50,30],[120,80],[200,20],[320,60],[450,30],[600,70],[720,25],
          [760,90],[80,110],[400,100],[550,50],[850,40],[900,100],
          [150,150],[700,140],[350,170],[480,60],[230,130],[810,55],[660,120],
        ];
        for (const [sx, sy] of stars) {
          ctx.globalAlpha = 0.25 + 0.5 * Math.sin(frame * 0.07 + sx);
          ctx.fillStyle = "#cc44ff"; ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.globalAlpha = 1;
        for (let oi = 0; oi < 5; oi++) {
          const ox = (oi * 180 + 60 + frame * 0.1) % W;
          const oy = 60 + (oi * 110) % (H - 180);
          ctx.globalAlpha = 0.04 + 0.03 * Math.sin(frame * 0.05 + oi);
          ctx.fillStyle = "#9900ff";
          ctx.beginPath(); ctx.ellipse(ox, oy, 80 + oi * 20, 18, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 0.08 + 0.04 * Math.sin(frame * 0.03);
        ctx.fillStyle = "#660099";
        for (let rx = 0; rx < W; rx += 60) {
          ctx.fillRect(rx, 0, 1, H);
        }
        for (let ry = 0; ry < H; ry += 60) {
          ctx.fillRect(0, ry, W, 1);
        }
        ctx.globalAlpha = 1;

      } else {
        // ── Mundo 0: Ciudad Nocturna ──
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, lev.isBoss ? "#110020" : "#060d1a");
        g.addColorStop(1, lev.isBoss ? "#1e0038" : "#0d1f35");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        for (const [sx, sy] of stars) {
          ctx.globalAlpha = 0.28 + 0.45 * Math.sin(frame * 0.05 + sx);
          ctx.fillStyle = lev.isBoss ? "#ff88ff" : "#fff"; ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.globalAlpha = 1;
        if (lev.isBoss) {
          const towers = [[0,175,82],[92,148,56],[162,172,72],[282,138,94],[412,158,62],[502,128,84],[622,153,66],[724,143,78],[832,163,72],[922,138,62]];
          for (const [cx, cy, cw] of towers) {
            ctx.fillStyle = "#19002a"; ctx.fillRect(cx, cy, cw, H - cy);
            ctx.fillStyle = "#110020";
            for (let bx = cx; bx < cx + cw - 8; bx += 17) ctx.fillRect(bx, cy - 16, 10, 16);
            ctx.fillStyle = "rgba(180,0,255,0.18)";
            for (let wy = cy + 18; wy < cy + 105; wy += 24)
              for (let wx = cx + 8; wx < cx + cw - 8; wx += 18)
                if (Math.sin(wx * 3 + wy * 5) > 0.25) ctx.fillRect(wx, wy, 8, 12);
          }
        } else {
          const buildings = [[0,200,60],[70,220,50],[130,180,70],[210,210,40],[260,170,55],[325,195,45],[380,160,65],[455,205,50],[515,175,60],[585,190,55],[650,165,70],[730,200,70],[820,180,60],[900,210,55]];
          for (const [bx, by, bw] of buildings) {
            ctx.fillStyle = "#0a1628"; ctx.fillRect(bx, by, bw, H - by);
            ctx.fillStyle = "rgba(255,133,0,0.18)";
            for (let wy = by + 10; wy < by + 120; wy += 18)
              for (let wx = bx + 6; wx < bx + bw - 6; wx += 12)
                if (Math.sin(wx * 3 + wy * 7) > 0.3) ctx.fillRect(wx, wy, 6, 8);
          }
        }
      }
    }

    function drawPlatforms(camX) {
      ctx.save();
      ctx.translate(-camX, 0);
      const lev = LEVELS[gRef.current.currentLevel];
      const w = worldOf(gRef.current.currentLevel);
      // [base, edge1, edge2] per world
      const palettes = [
        ["#1a0a00", "#ff8500", "#ffb347"],   // ciudad
        ["#1a0500", "#cc3300", "#ff6600"],   // volcán
        ["#001400", "#006622", "#00cc44"],   // bosque
        ["#000820", "#4488cc", "#88ccff"],   // fantasma
      ];
      const [base, c1, c2] = palettes[lev.isFinalLevel ? 3 : w];
      const theme = worldTheme(gRef.current.currentLevel);
      for (const p of lev.platforms) {
        ctx.save();
        ctx.shadowColor = c1;
        ctx.shadowBlur = p.y >= 455 ? 14 : 22;
        ctx.globalAlpha = 0.48;
        ctx.fillStyle = c1;
        roundRect(p.x - 2, p.y - 2, p.w + 4, Math.min(18, p.h + 6), 8);
        ctx.fill();
        ctx.restore();

        const body = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
        body.addColorStop(0, base);
        body.addColorStop(0.42, base);
        body.addColorStop(1, "rgba(0,0,0,0.85)");
        ctx.fillStyle = body;
        roundRect(p.x, p.y, p.w, p.h, p.y >= 455 ? 0 : 7);
        ctx.fill();

        const g2 = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y);
        g2.addColorStop(0, c1); g2.addColorStop(0.5, c2); g2.addColorStop(1, c1);
        ctx.shadowColor = theme.glow;
        ctx.shadowBlur = 12;
        ctx.fillStyle = g2;
        roundRect(p.x, p.y, p.w, 7, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.36;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(p.x + 8, p.y + 2, Math.max(0, p.w - 16), 1);
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = c2;
        for (let sx = p.x + 18; sx < p.x + p.w - 12; sx += 42) {
          ctx.fillRect(sx, p.y + 12, 15, 2);
          if (p.h > 32) ctx.fillRect(sx + 10, p.y + 30, 19, 2);
        }
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    }

    function drawCoins(camX, coins) {
      ctx.save();
      ctx.translate(-camX, 0);
      const theme = worldTheme(gRef.current.currentLevel);
      const frame = gRef.current.frame;
      for (const c of coins) {
        if (c.collected) continue;
        const bob = Math.sin(frame * 0.08 + c.x * 0.02) * 3;
        const spin = 0.72 + 0.28 * Math.sin(frame * 0.12 + c.x);
        ctx.save();
        ctx.translate(c.x, c.y + bob);
        ctx.scale(spin, 1);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = theme.glow;
        ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        const cg = ctx.createRadialGradient(-4, -5, 2, 0, 0, 13);
        cg.addColorStop(0, "#fff6b0");
        cg.addColorStop(0.45, "#ffd700");
        cg.addColorStop(1, "#ff8500");
        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur = 14;
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#fff1a8"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center";
        ctx.fillText("$", 0, 3);
        ctx.restore();
      }
      ctx.restore();
    }

    function enemySpriteIndex(e) {
      const w = worldOf(gRef.current.currentLevel);
      if (e.isFinalBoss) return 5;
      if (e.isBosse) return 4;
      if (e.isFlying) return w === 1 ? 1 : w === 2 ? 1 : 1;
      if (w === 1) return 2;
      if (w === 2) return 3;
      return 0;
    }

    function drawEnemyBitmap(e, frame) {
      if (!enemySheet.complete || enemySheet.naturalWidth <= 0) return false;
      const idx = enemySpriteIndex(e);
      const bob = e.isFlying || e.isFinalBoss ? Math.sin(frame * 0.08 + e.x) * 3 : 0;
      const scale = e.isBosse ? 1.22 : e.isFinalBoss ? 1.35 : 1.18;
      const dw = e.w * scale;
      const dh = e.h * scale;
      const dx = e.x + e.w / 2 - dw / 2;
      const dy = e.y + e.h / 2 - dh / 2 + bob;
      const theme = worldTheme(gRef.current.currentLevel);
      ctx.save();
      ctx.shadowColor = e.isBosse || e.isFinalBoss ? theme.glow : "rgba(255,255,255,0.28)";
      ctx.shadowBlur = e.isBosse || e.isFinalBoss ? 22 : 10;
      ctx.drawImage(enemySheet, idx * 128, 0, 128, 128, dx, dy, dw, dh);
      ctx.restore();
      return true;
    }

    function drawEnemies(camX, enemies, frame) {
      ctx.save();
      ctx.translate(-camX, 0);
      for (const e of enemies) {
        if (e.dead) continue;
        if (drawEnemyBitmap(e, frame) && !e.isBosse && !e.isFinalBoss) continue;
        if (e.isFinalBoss) {
          // ── Ghost final boss ──
          const gx = e.x, gy = e.y, gw = e.w, gh = e.h;
          const t = frame * 0.035;

          // Outer glow pulse
          ctx.globalAlpha = 0.1 + 0.07 * Math.sin(t * 2.5);
          ctx.fillStyle = "#aaddff";
          ctx.fillRect(gx - 22, gy - 22, gw + 44, gh + 44);

          // Ghost body — rounded head + wavy scallop skirt
          ctx.globalAlpha = 0.82;
          ctx.fillStyle = "#cce8ff";
          ctx.beginPath();
          ctx.arc(gx + gw / 2, gy + gh * 0.3, gw / 2, Math.PI, 0);
          ctx.lineTo(gx + gw, gy + gh * 0.75);
          // 4 scallops (quadratic curves from right to left)
          const scN = 4, scW = gw / scN;
          for (let si = scN - 1; si >= 0; si--) {
            const scCx = gx + (si + 0.5) * scW;
            const dip = Math.sin(t * 2.5 + si * 1.4) * 10;
            ctx.quadraticCurveTo(scCx, gy + gh * 0.75 + 22 + dip, scCx - scW / 2, gy + gh * 0.75);
          }
          ctx.lineTo(gx, gy + gh * 0.3);
          ctx.closePath();
          ctx.fill();

          // Inner shimmer
          ctx.globalAlpha = 0.16;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.ellipse(gx + gw * 0.34, gy + gh * 0.18, gw * 0.11, gh * 0.2, -0.3, 0, Math.PI * 2);
          ctx.fill();

          // Glowing eyes — occasional blink
          const blink = Math.sin(t * 8) > 0.93 ? 0.1 : 1;
          const eyeA = (0.7 + 0.3 * Math.sin(t * 4)) * blink;
          ctx.globalAlpha = eyeA;
          ctx.fillStyle = "#00ccff";
          ctx.beginPath(); ctx.ellipse(gx + gw * 0.3, gy + gh * 0.3, 9, 12, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(gx + gw * 0.7, gy + gh * 0.3, 9, 12, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#001830";
          ctx.globalAlpha = blink;
          ctx.beginPath(); ctx.ellipse(gx + gw * 0.3 + 1.5, gy + gh * 0.31, 4, 5.5, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(gx + gw * 0.7 + 1.5, gy + gh * 0.31, 4, 5.5, 0, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;

          // HP bar
          const hpR = (e.hp || 0) / (e.maxHp || 1);
          ctx.fillStyle = "rgba(0,0,0,0.78)";
          ctx.fillRect(gx - 5, gy - 44, gw + 10, 14);
          ctx.fillStyle = hpR > 0.5 ? "#00ccff" : hpR > 0.25 ? "#ffaa00" : "#ff2200";
          ctx.fillRect(gx - 5, gy - 44, (gw + 10) * hpR, 14);
          ctx.strokeStyle = "#88ccff"; ctx.lineWidth = 1;
          ctx.strokeRect(gx - 5, gy - 44, gw + 10, 14);
          ctx.fillStyle = "#88ccff"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center";
          ctx.fillText("☆ JEFE FINAL ☆", gx + gw / 2, gy - 48);

        } else if (e.isBosse) {
          // ── Castle boss — world-themed colors ──
          const wBoss = worldOf(gRef.current.currentLevel);
          const bc = wBoss === 1
            ? { body:"#660000", aura:"#ff3300", tower:"#440000", tip:"#ff6600", eyeBox:"#ff6600", eyeIn:"#ffcc88", pupil:"#330000", jaw:"#1a0000", label:"#ff8800" }
            : wBoss === 2
            ? { body:"#003300", aura:"#00cc44", tower:"#001800", tip:"#00ff44", eyeBox:"#00cc00", eyeIn:"#88ff88", pupil:"#001100", jaw:"#001100", label:"#00ff66" }
            : { body:"#4a0082", aura:"#cc00ff", tower:"#7700cc", tip:"#ff00ff", eyeBox:"#ff0000", eyeIn:"#ff9999", pupil:"#000",    jaw:"#1a0030", label:"#ff00ff" };
          ctx.fillStyle = bc.body; ctx.fillRect(e.x, e.y, e.w, e.h);
          ctx.globalAlpha = 0.15 + 0.08 * Math.sin(frame * 0.1);
          ctx.fillStyle = bc.aura; ctx.fillRect(e.x - 6, e.y - 6, e.w + 12, e.h + 12);
          ctx.globalAlpha = 1;
          ctx.fillStyle = bc.tower; ctx.fillRect(e.x + 6, e.y - 18, 13, 18); ctx.fillRect(e.x + e.w - 19, e.y - 18, 13, 18);
          ctx.fillStyle = bc.tip; ctx.fillRect(e.x + 9, e.y - 22, 7, 7); ctx.fillRect(e.x + e.w - 16, e.y - 22, 7, 7);
          ctx.fillStyle = bc.eyeBox; ctx.fillRect(e.x + 10, e.y + 13, 17, 15); ctx.fillRect(e.x + e.w - 27, e.y + 13, 17, 15);
          ctx.fillStyle = bc.eyeIn; ctx.fillRect(e.x + 14, e.y + 16, 9, 9); ctx.fillRect(e.x + e.w - 23, e.y + 16, 9, 9);
          ctx.fillStyle = bc.pupil; ctx.fillRect(e.x + 17, e.y + 18, 5, 5); ctx.fillRect(e.x + e.w - 22, e.y + 18, 5, 5);
          ctx.fillStyle = bc.jaw; ctx.fillRect(e.x + 11, e.y + e.h - 19, e.w - 22, 11);
          ctx.fillStyle = "#ddd";
          for (let tx = e.x + 13; tx < e.x + e.w - 17; tx += 13) ctx.fillRect(tx, e.y + e.h - 19, 9, 7);
          const hpR = (e.hp || 0) / (e.maxHp || 1);
          ctx.fillStyle = "rgba(0,0,0,0.75)"; ctx.fillRect(e.x - 3, e.y - 34, e.w + 6, 11);
          ctx.fillStyle = hpR > 0.6 ? "#00ee44" : hpR > 0.3 ? "#ffaa00" : "#ff2200";
          ctx.fillRect(e.x - 3, e.y - 34, (e.w + 6) * hpR, 11);
          ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(e.x - 3, e.y - 34, e.w + 6, 11);
          ctx.fillStyle = bc.label; ctx.font = "bold 9px monospace"; ctx.textAlign = "center";
          ctx.fillText("JEFE", e.x + e.w / 2, e.y - 38);

        } else if (e.isFlying) {
          const wFly = worldOf(gRef.current.currentLevel);
          if (wFly === 1) {
            // ── Ember Sprite — flame ball, no wings ──
            const ft = frame * 0.1 + (e.floatPhase || 0);
            const flicker = Math.sin(ft * 3.1) * 3;
            ctx.globalAlpha = 0.2 + 0.1 * Math.sin(ft * 4);
            ctx.fillStyle = "#ff6600"; ctx.fillRect(e.x - 8, e.y - 8, e.w + 16, e.h + 16);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#cc2200";
            ctx.beginPath(); ctx.ellipse(e.x + e.w/2, e.y + e.h*0.58 + flicker, e.w*0.52, e.h*0.52, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = "#ff5500";
            ctx.beginPath(); ctx.ellipse(e.x + e.w/2, e.y + e.h*0.46 + flicker, e.w*0.38, e.h*0.42, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = "#ffaa00";
            ctx.beginPath(); ctx.ellipse(e.x + e.w/2, e.y + e.h*0.36, e.w*0.24, e.h*0.28, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = "#ffee88";
            ctx.beginPath(); ctx.ellipse(e.x + e.w/2, e.y + e.h*0.3, e.w*0.12, e.h*0.16, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = "#fff"; ctx.fillRect(e.x + 7, e.y + 7, 7, 7); ctx.fillRect(e.x + e.w - 14, e.y + 7, 7, 7);
            ctx.fillStyle = "#000"; ctx.fillRect(e.x + 9, e.y + 9, 3, 3); ctx.fillRect(e.x + e.w - 12, e.y + 9, 3, 3);
          } else if (wFly === 2) {
            // ── Shadow Moth — dark wings + green spots, purple body ──
            const flap = Math.sin(frame * 0.18 + (e.floatPhase || 0)) > 0;
            ctx.fillStyle = "#1a0033";
            if (flap) {
              ctx.fillRect(e.x - 22, e.y, 22, 18); ctx.fillRect(e.x + e.w, e.y, 22, 18);
              ctx.fillRect(e.x - 28, e.y - 8, 12, 12); ctx.fillRect(e.x + e.w + 16, e.y - 8, 12, 12);
            } else {
              ctx.fillRect(e.x - 20, e.y + 8, 20, 14); ctx.fillRect(e.x + e.w, e.y + 8, 20, 14);
              ctx.fillRect(e.x - 24, e.y + 18, 10, 10); ctx.fillRect(e.x + e.w + 14, e.y + 18, 10, 10);
            }
            ctx.globalAlpha = 0.7; ctx.fillStyle = "#00aa44";
            if (flap) {
              ctx.beginPath(); ctx.arc(e.x - 11, e.y + 9, 4, 0, Math.PI*2); ctx.fill();
              ctx.beginPath(); ctx.arc(e.x + e.w + 11, e.y + 9, 4, 0, Math.PI*2); ctx.fill();
            } else {
              ctx.beginPath(); ctx.arc(e.x - 10, e.y + 15, 4, 0, Math.PI*2); ctx.fill();
              ctx.beginPath(); ctx.arc(e.x + e.w + 10, e.y + 15, 4, 0, Math.PI*2); ctx.fill();
            }
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#5500aa"; ctx.fillRect(e.x, e.y, e.w, e.h);
            ctx.fillStyle = "#00ff66"; ctx.fillRect(e.x + 6, e.y + 7, 8, 8); ctx.fillRect(e.x + e.w - 14, e.y + 7, 8, 8);
            ctx.fillStyle = "#fff"; ctx.fillRect(e.x + 9, e.y + 9, 3, 3); ctx.fillRect(e.x + e.w - 11, e.y + 9, 3, 3);
            ctx.fillStyle = "#330066"; ctx.fillRect(e.x + 7, e.y - 8, 3, 8); ctx.fillRect(e.x + e.w - 10, e.y - 8, 3, 8);
            ctx.fillStyle = "#cc00ff"; ctx.fillRect(e.x + 5, e.y - 11, 7, 4); ctx.fillRect(e.x + e.w - 12, e.y - 11, 7, 4);
          } else if (e.isVoid || wFly === 4) {
            // ── Void Phantom — flying shooter, dark with purple glow ──
            const vpt = frame * 0.08 + (e.floatPhase || 0);
            const flap = Math.sin(vpt * 2.2) > 0;
            ctx.fillStyle = "#0a0018";
            if (flap) {
              ctx.fillRect(e.x - 24, e.y + 2, 24, 16); ctx.fillRect(e.x + e.w, e.y + 2, 24, 16);
              ctx.fillRect(e.x - 30, e.y - 6, 12, 12); ctx.fillRect(e.x + e.w + 18, e.y - 6, 12, 12);
            } else {
              ctx.fillRect(e.x - 20, e.y + 10, 20, 12); ctx.fillRect(e.x + e.w, e.y + 10, 20, 12);
              ctx.fillRect(e.x - 24, e.y + 20, 10, 8); ctx.fillRect(e.x + e.w + 14, e.y + 20, 10, 8);
            }
            ctx.globalAlpha = 0.5 + 0.3 * Math.sin(vpt * 3);
            ctx.fillStyle = "#9900ff";
            ctx.beginPath(); ctx.arc(e.x - (flap ? 12 : 10), e.y + (flap ? 10 : 16), 5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(e.x + e.w + (flap ? 12 : 10), e.y + (flap ? 10 : 16), 5, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#1a0035"; ctx.fillRect(e.x, e.y, e.w, e.h);
            ctx.fillStyle = "#cc44ff"; ctx.fillRect(e.x + 6, e.y + 6, 10, 10); ctx.fillRect(e.x + e.w - 16, e.y + 6, 10, 10);
            ctx.fillStyle = "#fff"; ctx.fillRect(e.x + 9, e.y + 9, 4, 4); ctx.fillRect(e.x + e.w - 13, e.y + 9, 4, 4);
            if (e.canShoot) {
              ctx.globalAlpha = 0.4 + 0.4 * Math.sin(vpt * 6);
              ctx.fillStyle = "#ff44ff";
              ctx.beginPath(); ctx.arc(e.x + e.w / 2, e.y + e.h / 2, 14, 0, Math.PI * 2); ctx.fill();
              ctx.globalAlpha = 1;
            }
          } else {
            // ── Blue bat (World 0 / World 3 ghost minions) ──
            const flap = Math.sin(frame * 0.22 + (e.floatPhase || 0)) > 0;
            const wingColor = wFly === 3 ? "#003333" : "#003888";
            const bodyColor = wFly === 3 ? "#006655" : "#0055cc";
            const eyeColor  = wFly === 3 ? "#00ffcc" : "#00ffee";
            ctx.fillStyle = wingColor;
            if (flap) {
              ctx.fillRect(e.x - 16, e.y + 4, 16, 12); ctx.fillRect(e.x + e.w, e.y + 4, 16, 12);
              ctx.fillRect(e.x - 20, e.y, 8, 8); ctx.fillRect(e.x + e.w + 12, e.y, 8, 8);
            } else {
              ctx.fillRect(e.x - 14, e.y + 10, 14, 8); ctx.fillRect(e.x + e.w, e.y + 10, 14, 8);
              ctx.fillRect(e.x - 16, e.y + 16, 8, 6); ctx.fillRect(e.x + e.w + 8, e.y + 16, 8, 6);
            }
            ctx.fillStyle = bodyColor; ctx.fillRect(e.x, e.y, e.w, e.h);
            ctx.fillStyle = eyeColor; ctx.fillRect(e.x + 6, e.y + 6, 9, 9); ctx.fillRect(e.x + e.w - 15, e.y + 6, 9, 9);
            ctx.fillStyle = "#fff"; ctx.fillRect(e.x + 8, e.y + 8, 5, 5); ctx.fillRect(e.x + e.w - 13, e.y + 8, 5, 5);
            ctx.fillRect(e.x + 14, e.y + e.h - 8, 5, 8); ctx.fillRect(e.x + e.w - 19, e.y + e.h - 8, 5, 8);
          }

        } else {
          const wGnd = worldOf(gRef.current.currentLevel);
          if (e.isVoid || wGnd === 4) {
            // ── Void Specter — angular dark creature, purple cracks ──
            const vt = frame * 0.06 + (e.x * 0.01);
            ctx.fillStyle = "#0a0018"; ctx.fillRect(e.x, e.y, e.w, e.h);
            ctx.globalAlpha = 0.4 + 0.3 * Math.sin(vt * 2);
            ctx.fillStyle = "#9900ff"; ctx.fillRect(e.x - 4, e.y + 3, 7, 10); ctx.fillRect(e.x + e.w - 3, e.y + 3, 7, 10);
            ctx.globalAlpha = 0.7 + 0.3 * Math.sin(vt * 3);
            ctx.strokeStyle = "#cc44ff"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(e.x + 8, e.y + 4); ctx.lineTo(e.x + 14, e.y + e.h * 0.5); ctx.lineTo(e.x + 9, e.y + e.h * 0.7); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(e.x + e.w - 9, e.y + 6); ctx.lineTo(e.x + e.w - 16, e.y + e.h * 0.48); ctx.lineTo(e.x + e.w - 8, e.y + e.h * 0.72); ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#cc44ff"; ctx.fillRect(e.x + 7, e.y + 8, 10, 8); ctx.fillRect(e.x + e.w - 17, e.y + 8, 10, 8);
            ctx.fillStyle = "#fff"; ctx.fillRect(e.x + 10, e.y + 10, 4, 4); ctx.fillRect(e.x + e.w - 14, e.y + 10, 4, 4);
            if (e.canShoot) {
              const chargeGlow = 0.3 + 0.4 * Math.sin(vt * 8);
              ctx.globalAlpha = chargeGlow;
              ctx.fillStyle = "#ff44ff";
              ctx.beginPath(); ctx.arc(e.x + e.w / 2, e.y - 8, 5, 0, Math.PI * 2); ctx.fill();
              ctx.globalAlpha = 1;
            }
          } else if (wGnd === 1) {
            // ── Lava Golem — dark grey body, orange crack lines, yellow eyes ──
            const gt = frame * 0.05;
            ctx.fillStyle = "#2a2a2a"; ctx.fillRect(e.x, e.y, e.w, e.h);
            ctx.fillStyle = "#333"; ctx.fillRect(e.x - 5, e.y + 4, 8, 12); ctx.fillRect(e.x + e.w - 3, e.y + 4, 8, 12);
            ctx.strokeStyle = "#ff6600"; ctx.lineWidth = 2;
            ctx.globalAlpha = 0.65 + 0.35 * Math.sin(gt * 3.2);
            ctx.beginPath(); ctx.moveTo(e.x + 9, e.y + 4); ctx.lineTo(e.x + 15, e.y + e.h*0.5); ctx.lineTo(e.x + 10, e.y + e.h*0.65); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(e.x + e.w - 10, e.y + 7); ctx.lineTo(e.x + e.w - 17, e.y + e.h*0.48); ctx.lineTo(e.x + e.w - 9, e.y + e.h*0.7); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(e.x + e.w*0.42, e.y + e.h*0.28); ctx.lineTo(e.x + e.w*0.56, e.y + e.h*0.72); ctx.stroke();
            ctx.globalAlpha = 1; ctx.lineWidth = 1;
            ctx.fillStyle = "#ff8800"; ctx.fillRect(e.x + 7, e.y + 8, 9, 8); ctx.fillRect(e.x + e.w - 16, e.y + 8, 9, 8);
            ctx.fillStyle = "#ffee00"; ctx.fillRect(e.x + 9, e.y + 10, 5, 4); ctx.fillRect(e.x + e.w - 14, e.y + 10, 5, 4);
            ctx.globalAlpha = 0.8; ctx.fillStyle = "#ff4400";
            ctx.fillRect(e.x + 8, e.y + e.h - 10, e.w - 16, 4);
            ctx.globalAlpha = 1;
          } else if (wGnd === 2) {
            // ── Dark Knight — black armor, shoulder spikes, green glowing eyes ──
            const kt = frame * 0.04;
            ctx.fillStyle = "#111"; ctx.fillRect(e.x, e.y, e.w, e.h);
            ctx.fillStyle = "#003311"; ctx.fillRect(e.x + 3, e.y + 3, e.w - 6, 5); ctx.fillRect(e.x + 3, e.y + e.h*0.5, e.w - 6, 5);
            ctx.fillStyle = "#222"; ctx.fillRect(e.x - 6, e.y + 2, 9, 14); ctx.fillRect(e.x + e.w - 3, e.y + 2, 9, 14);
            ctx.fillStyle = "#444"; ctx.fillRect(e.x - 5, e.y - 5, 7, 7); ctx.fillRect(e.x + e.w - 2, e.y - 5, 7, 7);
            ctx.fillStyle = "#000"; ctx.fillRect(e.x + 4, e.y + 7, e.w - 8, 8);
            ctx.globalAlpha = 0.85 + 0.15 * Math.sin(kt * 5);
            ctx.fillStyle = "#00ff44"; ctx.fillRect(e.x + 7, e.y + 9, 8, 5); ctx.fillRect(e.x + e.w - 15, e.y + 9, 8, 5);
            ctx.globalAlpha = 0.18 + 0.1 * Math.sin(kt * 4);
            ctx.fillRect(e.x + 3, e.y + 6, e.w - 6, 11);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#1a1a1a"; ctx.fillRect(e.x + 3, e.y + e.h - 12, e.w - 6, 10);
            ctx.fillStyle = "#336633"; ctx.fillRect(e.x + e.w/2 - 4, e.y + e.h - 15, 8, 6);
          } else {
            // ── Red grunt (World 0 + World 3 undead) ──
            ctx.fillStyle = wGnd === 3 ? "#330033" : "#cc0000"; ctx.fillRect(e.x, e.y, e.w, e.h);
            ctx.fillStyle = wGnd === 3 ? "#cc44ff" : "#ff0"; ctx.fillRect(e.x + 7, e.y + 7, 9, 9); ctx.fillRect(e.x + e.w - 16, e.y + 7, 9, 9);
            ctx.fillStyle = "#000"; ctx.fillRect(e.x + 10, e.y + 10, 4, 4); ctx.fillRect(e.x + e.w - 13, e.y + 10, 4, 4);
            ctx.fillStyle = "#fff"; ctx.fillRect(e.x + 8, e.y + e.h - 10, e.w - 16, 5);
          }
        }
      }
      ctx.restore();
    }

    function drawProjectiles(camX, projectiles) {
      if (!projectiles.length) return;
      ctx.save();
      ctx.translate(-camX, 0);
      const theme = worldTheme(gRef.current.currentLevel);
      for (const proj of projectiles) {
        const dir = Math.sign(proj.vx) || 1;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const beam = ctx.createLinearGradient(proj.x - dir * 42, proj.y, proj.x + dir * 12, proj.y);
        beam.addColorStop(0, "rgba(255,255,255,0)");
        beam.addColorStop(0.4, theme.glowSoft);
        beam.addColorStop(1, theme.accent);
        ctx.strokeStyle = beam;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(proj.x - dir * 42, proj.y);
        ctx.lineTo(proj.x + dir * 4, proj.y);
        ctx.stroke();
        ctx.shadowColor = theme.glow;
        ctx.shadowBlur = 28;
        const pg = ctx.createRadialGradient(proj.x - 3, proj.y - 3, 2, proj.x, proj.y, 13);
        pg.addColorStop(0, "#ffffff");
        pg.addColorStop(0.38, theme.accent);
        pg.addColorStop(1, theme.edge);
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(proj.x, proj.y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.35;
        ctx.beginPath(); ctx.arc(proj.x - dir * 21, proj.y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    function drawEnemyProjectiles(camX, enemyProjectiles) {
      if (!enemyProjectiles.length) return;
      ctx.save();
      ctx.translate(-camX, 0);
      for (const ep of enemyProjectiles) {
        const dir = ep.vx >= 0 ? 1 : -1;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.shadowColor = ep.isVoid ? "#cc44ff" : "#ff2200";
        ctx.shadowBlur = 22;
        const beam = ctx.createLinearGradient(ep.x - dir * 32, ep.y, ep.x + dir * 8, ep.y);
        beam.addColorStop(0, "rgba(255,0,0,0)");
        beam.addColorStop(1, ep.isVoid ? "#cc44ff" : "#ff2200");
        ctx.strokeStyle = beam;
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(ep.x - dir * 32, ep.y);
        ctx.lineTo(ep.x + dir * 6, ep.y);
        ctx.stroke();
        const pg = ctx.createRadialGradient(ep.x, ep.y, 1, ep.x, ep.y, 9);
        pg.addColorStop(0, "#ffffff");
        pg.addColorStop(0.4, ep.isVoid ? "#ee88ff" : "#ff6600");
        pg.addColorStop(1, ep.isVoid ? "#aa00ff" : "#cc0000");
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(ep.x, ep.y, 8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    function drawImpacts(camX, impacts) {
      if (!impacts.length) return;
      ctx.save();
      ctx.translate(-camX, 0);
      const theme = worldTheme(gRef.current.currentLevel);
      for (const impact of impacts) {
        const progress = impact.age / impact.maxAge;
        const frame = Math.min(5, Math.floor(progress * 6));
        const size = impact.type === "boss" ? 118 : impact.type === "coin" ? 52 : 82;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 1 - progress;
        if (explosionSheet.complete && explosionSheet.naturalWidth > 0) {
          ctx.drawImage(explosionSheet, frame * 128, 0, 128, 128, impact.x - size / 2, impact.y - size / 2, size, size);
        } else {
          ctx.shadowColor = theme.glow;
          ctx.shadowBlur = 22;
          ctx.fillStyle = impact.type === "coin" ? "#ffd700" : theme.glow;
          ctx.beginPath();
          ctx.arc(impact.x, impact.y, size * (0.12 + progress * 0.38), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.restore();
    }

    function drawParticles(camX, particles) {
      if (!particles.length) return;
      ctx.save();
      ctx.translate(-camX, 0);
      ctx.globalCompositeOperation = "lighter";
      for (const part of particles) {
        const fade = 1 - part.age / part.life;
        ctx.globalAlpha = fade;
        ctx.fillStyle = part.color;
        ctx.shadowColor = part.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size * fade, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    function drawFlag(camX, bossAlive) {
      const f = LEVELS[gRef.current.currentLevel].flag;
      const frame = gRef.current.frame;
      const theme = worldTheme(gRef.current.currentLevel);
      ctx.save();
      ctx.translate(-camX, 0);
      ctx.shadowColor = bossAlive ? "#ff3333" : theme.glow;
      ctx.shadowBlur = 14;
      const pole = ctx.createLinearGradient(f.x, f.y, f.x + 10, f.y);
      pole.addColorStop(0, "#e8edf7");
      pole.addColorStop(0.5, "#7b8494");
      pole.addColorStop(1, "#f8fbff");
      ctx.fillStyle = pole;
      roundRect(f.x + 2, f.y, 7, f.h, 4);
      ctx.fill();
      if (bossAlive) {
        const blocked = ctx.createLinearGradient(f.x + 8, f.y, f.x + 58, f.y + 28);
        blocked.addColorStop(0, "#ff1e1e");
        blocked.addColorStop(1, "#8b0000");
        ctx.fillStyle = blocked;
        ctx.beginPath();
        ctx.moveTo(f.x + 8, f.y);
        ctx.quadraticCurveTo(f.x + 34, f.y + 4 + Math.sin(frame * 0.08) * 3, f.x + 58, f.y);
        ctx.lineTo(f.x + 58, f.y + 28);
        ctx.quadraticCurveTo(f.x + 34, f.y + 24 + Math.sin(frame * 0.08 + 1.2) * 3, f.x + 8, f.y + 28);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 10px monospace"; ctx.textAlign = "center";
        ctx.fillText("¡JEFE!", f.x + 33, f.y + 18);
      } else {
        const free = ctx.createLinearGradient(f.x + 8, f.y, f.x + 58, f.y + 28);
        free.addColorStop(0, theme.accent);
        free.addColorStop(0.52, theme.edge);
        free.addColorStop(1, "#ff5a00");
        ctx.fillStyle = free;
        ctx.beginPath();
        ctx.moveTo(f.x + 8, f.y);
        ctx.quadraticCurveTo(f.x + 34, f.y + 5 + Math.sin(frame * 0.08) * 4, f.x + 58, f.y);
        ctx.lineTo(f.x + 58, f.y + 28);
        ctx.quadraticCurveTo(f.x + 34, f.y + 23 + Math.sin(frame * 0.08 + 1.2) * 4, f.x + 8, f.y + 28);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 14px monospace"; ctx.textAlign = "center";
        ctx.fillText("GO", f.x + 33, f.y + 20);
      }
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    function drawChar(p, frame, camX, invincible, sprinting) {
      if (invincible > 0 && Math.floor(invincible / 5) % 2 === 0) return;
      ctx.save();
      const theme = worldTheme(gRef.current.currentLevel);
      ctx.globalAlpha = 0.32;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.ellipse(p.x - camX + p.w / 2, p.y + p.h + 6, p.w * 0.52, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (sprinting && Math.abs(p.vx) > 3) {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.26; ctx.fillStyle = theme.glow;
        roundRect(p.x - camX - p.vx * 2.1, p.y + 10, p.w, p.h - 10, 10);
        ctx.fill();
        ctx.globalAlpha = 0.11;
        roundRect(p.x - camX - p.vx * 4.3, p.y + 22, p.w, p.h - 22, 10);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.translate(p.x - camX + p.w / 2, p.y + p.h / 2);
      ctx.scale(p.facing, 1);
      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = sprinting ? 18 : 8;
      if (sprite.complete && sprite.naturalWidth > 0) {
        const animFrame = p.grounded ? Math.floor(frame / 5) % SPRITE_FRAMES : 2;
        ctx.drawImage(sprite, animFrame * SPRITE_SRC_W, 0, SPRITE_SRC_W, SPRITE_SRC_H, -p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.fillStyle = "#84cc16"; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    function drawPowerAura(p, camX, frame) {
      ctx.save();
      ctx.translate(p.x - camX + p.w / 2, p.y + p.h / 2);
      ctx.globalCompositeOperation = "lighter";
      const pulse = 0.5 + 0.5 * Math.sin(frame * 0.14);
      // inner glow
      ctx.globalAlpha = 0.13 + pulse * 0.1;
      ctx.fillStyle = "#ffd700";
      ctx.shadowColor = "#ffd700";
      ctx.shadowBlur = 28;
      ctx.beginPath();
      ctx.arc(0, 0, p.w * 0.72, 0, Math.PI * 2);
      ctx.fill();
      // outer ring
      ctx.globalAlpha = 0.22 + pulse * 0.18;
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, 0, p.w * (0.9 + pulse * 0.18), 0, Math.PI * 2);
      ctx.stroke();
      // orbiting sparks
      for (let i = 0; i < 5; i++) {
        const angle = frame * 0.09 + (Math.PI * 2 * i) / 5;
        const r = p.w * (0.95 + pulse * 0.12);
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = i % 2 === 0 ? "#fff" : "#ffd700";
        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r * 0.65, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    function drawDoubleJumpFlash(p, camX, flash) {
      if (flash <= 0) return;
      const progress = 1 - flash / 15;
      ctx.save();
      ctx.translate(p.x - camX + p.w / 2, p.y + p.h / 2);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = flash / 15;
      ctx.shadowColor = "#00ffee";
      ctx.shadowBlur = 20;
      ctx.strokeStyle = "#00ffee"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, p.w * (0.7 + progress * 1.4), 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = (flash / 15) * 0.28;
      ctx.fillStyle = "#00ffee";
      ctx.beginPath(); ctx.arc(0, 0, p.w * (0.55 + progress * 0.9), 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function drawAtmosphere(frame) {
      const theme = worldTheme(gRef.current.currentLevel);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const haze = ctx.createRadialGradient(W * 0.5, H * 0.18, 20, W * 0.5, H * 0.22, W * 0.65);
      haze.addColorStop(0, theme.glowSoft);
      haze.addColorStop(0.5, "rgba(255,255,255,0.025)");
      haze.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 34; i++) {
        const drift = (frame * (0.16 + (i % 5) * 0.028) + i * 113) % (W + 220);
        const px = drift - 110;
        const py = 68 + ((i * 71 + Math.sin(frame * 0.015 + i) * 38) % (H - 175));
        const radius = 1.2 + (i % 4) * 0.9;
        ctx.globalAlpha = 0.08 + (i % 3) * 0.035;
        ctx.fillStyle = i % 5 === 0 ? theme.accent : theme.glow;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      const floorFog = ctx.createLinearGradient(0, H - 165, 0, H);
      floorFog.addColorStop(0, "rgba(0,0,0,0)");
      floorFog.addColorStop(0.5, theme.fog);
      floorFog.addColorStop(1, "rgba(0,0,0,0.26)");
      ctx.fillStyle = floorFog;
      ctx.fillRect(0, H - 165, W, 165);
      const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.72);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.78, "rgba(0,0,0,0.08)");
      vignette.addColorStop(1, "rgba(0,0,0,0.48)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 0.055;
      ctx.fillStyle = "#ffffff";
      for (let y = 1; y < H; y += 4) ctx.fillRect(0, y, W, 1);
      ctx.restore();
    }

    function drawHUD(g) {
      const theme = worldTheme(g.currentLevel);
      const hud = ctx.createLinearGradient(0, 0, W, 46);
      hud.addColorStop(0, "rgba(2,6,16,0.88)");
      hud.addColorStop(0.5, "rgba(7,16,32,0.72)");
      hud.addColorStop(1, "rgba(2,6,16,0.88)");
      ctx.fillStyle = hud; ctx.fillRect(0, 0, W, 46);
      ctx.globalAlpha = 0.75;
      ctx.strokeStyle = theme.glow;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 45.5); ctx.lineTo(W, 45.5); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = "#ff8500"; ctx.textAlign = "left";
      ctx.fillText(LEVELS[g.currentLevel].name.toUpperCase(), 14, 28);
      ctx.fillStyle = "#ffd700"; ctx.textAlign = "center";
      ctx.fillText(`● ${g.coins}   PTS ${calculateScore(g)}`, 345, 28);
      if (g.hasPower) {
        ctx.fillStyle = g.powerCooldown > 0 ? "#888" : "#ffd700";
        ctx.shadowColor = g.powerCooldown > 0 ? "transparent" : "#ffd700";
        ctx.shadowBlur = g.powerCooldown > 0 ? 0 : 10;
        ctx.fillText(g.powerCooldown > 0 ? "⚡ ESPERA..." : "⚡ PODER [X]", 650, 28);
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = "rgba(255,200,0,0.45)";
        ctx.fillText(`poder: ${g.coins}/10`, 640, 28);
      }
      ctx.fillStyle = "#ff4444"; ctx.textAlign = "right";
      ctx.fillText(`♥ ${g.lives}`, W - 14, 28);
      if (g.autoPlay) {
        ctx.shadowColor = "#00ff88"; ctx.shadowBlur = 10;
        ctx.fillStyle = "#00ff88"; ctx.textAlign = "left"; ctx.font = "bold 11px monospace";
        ctx.fillText("⚡ AUTO", 14, 43);
        ctx.shadowBlur = 0;
      }
    }

    // ─── Game loop ─────────────────────────────────────────────────
    function loop() {
      const g = gRef.current;
      if (!g || g.stopped) return;
      try {
      g.frame++;
      const k = keysRef.current;
      const p = g.player;
      const lev = LEVELS[g.currentLevel];
      const spMult = k.sprint ? 2 : 1;

      if (k.left) { p.vx -= p.speed * spMult; p.facing = -1; }
      if (k.right) { p.vx += p.speed * spMult; p.facing = 1; }

      if (k.jumpPressed) {
        k.jumpPressed = false;
        if (p.jumpsLeft > 0) {
          const power = p.jumpsLeft === 2 ? p.jumpPower : p.jumpPower * 0.88;
          p.vy = -power; p.grounded = false;
          if (p.jumpsLeft === 1) g.doubleJumpFlash = 15;
          p.jumpsLeft--;
          playSound("jump");
        }
      }

      p.vx = Math.max(Math.min(p.vx * FRICTION, p.maxSpeed * spMult), -p.maxSpeed * spMult);
      p.vy += GRAVITY;
      if (p.vy > 18) p.vy = 18; // terminal velocity cap
      p.x += p.vx; resolvePlatforms("x");
      p.y += p.vy; p.grounded = false;
      const pvySnap = p.vy; // capture falling speed before platform zeroes it
      resolvePlatforms("y");

      if (p.y > H + 200) {
        if (g.autoPlay) {
          // No life loss — respawn just before where we fell, from above
          p.x = Math.max(80, p.x - 60); p.y = 80;
          p.vx = 4; p.vy = 0; p.grounded = false; p.jumpsLeft = 2;
        } else { loseLife(); if (g.stopped) return; }
      }
      p.x = Math.max(0, Math.min(p.x, lev.width - p.w));
      g.cameraX = Math.max(0, Math.min(p.x - W / 2 + p.w / 2, lev.width - W));

      // Coins
      const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
      for (const c of g.levelCoins) {
        if (!c.collected && Math.hypot(c.x - cx, c.y - cy) < p.w / 2 + 12) {
          c.collected = true;
          const prevCoins = g.coins;
          g.coins++;
          setHudCoins(g.coins);
          playSound("coin");
          spawnImpact(c.x, c.y, "coin");

          // Poder básico al juntar 10 monedas por primera vez
          if (!g.hasPower && g.coins >= 10) {
            g.hasPower = true;
            g.screenShake = 8;
            spawnImpact(p.x + p.w / 2, p.y + p.h / 2, "hit");
          }

          // Cada 50 monedas → +1 vida
          if (Math.floor(g.coins / 50) > Math.floor(prevCoins / 50)) {
            g.lives++;
            setHudLives(g.lives);
            g.screenShake = 12;
            spawnImpact(p.x + p.w / 2, p.y - 10, "boss");
          }

          // Cada 100 monedas → mega poder (triple disparo por 10 segundos)
          if (Math.floor(g.coins / 100) > Math.floor(prevCoins / 100)) {
            g.megaPower = 600; // 10 segundos a 60fps
            g.hasPower = true;
            g.screenShake = 18;
            spawnImpact(p.x + p.w / 2, p.y + p.h / 2, "boss");
            spawnImpact(p.x + p.w / 2, p.y - 20, "boss");
          }
        }
      }

      if (g.invincibleFrames > 0) g.invincibleFrames--;
      if (g.doubleJumpFlash > 0) g.doubleJumpFlash--;
      if (g.bossBlockFlash > 0) g.bossBlockFlash--;

      // Power
      if (g.megaPower > 0) g.megaPower--;
      if (k.power) {
        k.power = false;
        if (g.hasPower && g.powerCooldown <= 0) {
          g.powerCooldown = POWER_COOLDOWN;
          const ox = p.facing > 0 ? p.w + 5 : -22;
          const baseVx = p.facing * 17;
          g.projectiles.push({ x: p.x + ox, y: p.y + p.h * 0.38, vx: baseVx });
          if (g.megaPower > 0) {
            // Triple disparo en abanico
            g.projectiles.push({ x: p.x + ox, y: p.y + p.h * 0.2, vx: baseVx, vy: -3 });
            g.projectiles.push({ x: p.x + ox, y: p.y + p.h * 0.55, vx: baseVx, vy: 3 });
          }
          playSound("shoot");
        }
      }
      if (g.powerCooldown > 0) g.powerCooldown--;

      // Projectiles
      for (const proj of g.projectiles) { proj.x += proj.vx; if (proj.vy) proj.y += proj.vy; }
      g.projectiles = g.projectiles.filter((proj) => {
        if (proj.x < -80 || proj.x > lev.width + 80) return false;
        for (const e of g.levelEnemies) {
          if (e.dead) continue;
          if (overlap({ x: proj.x - 10, y: proj.y - 10, w: 20, h: 20 }, e)) {
            awardKill(e);
            spawnImpact(e.x + e.w / 2, e.y + e.h / 2, e.isBosse ? "boss" : "hit");
            playSound("hit");
            if (e.isBosse) { e.hp--; if (e.hp <= 0) { e.dead = true; spawnDropCoins(e); } }
            else { e.dead = true; spawnDropCoins(e); }
            return false;
          }
        }
        return true;
      });

      // Auto-play cheat (Cmd+2 / Ctrl+2)
      if (g.autoPlay) {
        const bossTarget = g.levelEnemies.find(e => e.isBosse && !e.dead);
        const targetEnemy = bossTarget || g.levelEnemies.find(e =>
          !e.dead &&
          e.x + e.w >= p.x - 70 &&
          e.x <= p.x + 500
        );
        const targetCenter = targetEnemy ? targetEnemy.x + targetEnemy.w / 2 : null;
        const playerCenter = p.x + p.w / 2;
        const chaseBossLeft = bossTarget && targetCenter < playerCenter - 90;
        k.right = !chaseBossLeft; k.left = Boolean(chaseBossLeft); k.sprint = true;
        g.invincibleFrames = 24;

        if (targetEnemy) {
          p.facing = targetCenter >= playerCenter ? 1 : -1;
          const closeX = Math.abs(targetCenter - playerCenter) < 76;
          const closeY = Math.abs((targetEnemy.y + targetEnemy.h / 2) - (p.y + p.h / 2)) < 88;
          if (g.frame % 18 === 0 && g.projectiles.length < 3) {
            g.projectiles.push({
              x: p.x + (p.facing > 0 ? p.w + 5 : -22),
              y: p.y + p.h * 0.38,
              vx: p.facing * 17,
            });
            playSound("shoot");
          }
          if (closeX && closeY) {
            awardKill(targetEnemy);
            spawnImpact(targetEnemy.x + targetEnemy.w / 2, targetEnemy.y + targetEnemy.h / 2, targetEnemy.isBosse ? "boss" : "hit");
            playSound("hit");
            if (targetEnemy.isBosse) {
              targetEnemy.hp--;
              p.vy = -11;
              if (targetEnemy.hp <= 0) { targetEnemy.dead = true; spawnDropCoins(targetEnemy); }
            } else {
              targetEnemy.dead = true;
              spawnDropCoins(targetEnemy);
              p.vy = -11;
            }
          }
        }

        // Look 210px ahead — jump if gap or no ground
        const pFront = p.x + p.w;
        const groundAhead = lev.platforms.some(pl =>
          pl.y >= 455 && pl.x < pFront + 210 && pl.x + pl.w > pFront + 15
        );
        const stuckOrSlow = p.grounded && Math.abs(p.vx) < 1.5;
        const enemyJump = targetEnemy && targetEnemy.x > p.x && targetEnemy.x - pFront < 130 && p.y + p.h > targetEnemy.y;
        if ((!groundAhead || stuckOrSlow || enemyJump) && p.jumpsLeft > 0) {
          k.jumpPressed = true;
        } else if (p.grounded && g.frame % 120 === 0) {
          k.jumpPressed = true; // occasional hop for floating platforms
        }
      }

      // Enemies
      for (const e of g.levelEnemies) {
        if (e.dead) continue;
        if (e.isFinalBoss) {
          const tx = p.x + p.w / 2 - e.w / 2;
          const ty = p.y + p.h / 2 - e.h / 2 - 30;
          e.x += (tx - e.x) * 0.02;
          e.y += (ty - e.y) * 0.016;
          e.y += Math.sin(g.frame * 0.06) * 1.5;
          e.x = Math.max(e.minX, Math.min(e.maxX, e.x));
          e.y = Math.max(55, Math.min(430, e.y));
        } else if (e.isChaser) {
          const dx = (p.x + p.w / 2) - (e.x + e.w / 2);
          const chaserSpd = (e.vx > 0 ? 1 : -1) * Math.abs(e.vx) * 1.15;
          const moveDir = dx > 0 ? 1 : -1;
          e.x += moveDir * Math.abs(chaserSpd);
          e.x = Math.max(e.minX, Math.min(e.maxX - e.w, e.x));
          if (e.isFlying) {
            const dy = (p.y + p.h / 2) - (e.y + e.h / 2);
            e.y += (dy > 0 ? 1 : -1) * Math.abs(chaserSpd) * 0.65;
            e.y = Math.max(55, Math.min(440, e.y));
          } else {
            e.y = 440;
          }
        } else {
          e.x += e.vx;
          if (e.x < e.minX) { e.x = e.minX; e.vx = Math.abs(e.vx); }
          else if (e.x + e.w > e.maxX) { e.x = e.maxX - e.w; e.vx = -Math.abs(e.vx); }
          if (e.isFlying) e.y = e.baseY + Math.sin(g.frame * 0.05 + (e.floatPhase || 0)) * 22;
        }

        // Shooting enemies
        if (e.canShoot) {
          if (e.shootCooldown > 0) {
            e.shootCooldown--;
          } else {
            const dx = (p.x + p.w / 2) - (e.x + e.w / 2);
            const dy = (p.y + p.h / 2) - (e.y + e.h / 2);
            const dist = Math.hypot(dx, dy);
            if (dist < 520) {
              const spd = 5.5 + (g.currentLevel * 0.12);
              g.enemyProjectiles.push({
                x: e.x + e.w / 2,
                y: e.y + e.h / 2,
                vx: (dx / dist) * spd,
                vy: (dy / dist) * spd,
                isVoid: !!e.isVoid,
              });
              playSound("hit");
              e.shootCooldown = e.maxShootCooldown || 100;
            } else {
              e.shootCooldown = 25;
            }
          }
        }

        if (g.invincibleFrames > 0) continue;
        if (overlap(p, e)) {
          // stomp = player was falling AND feet land in the top portion of the enemy
          const stompLine = e.y + (e.isFinalBoss ? e.h * 0.6 : e.isBosse ? e.h * 0.65 : e.h * 0.72);
          if (pvySnap > 0 && p.y + p.h < stompLine) {
            awardKill(e);
            spawnImpact(e.x + e.w / 2, e.y + e.h / 2, e.isBosse ? "boss" : "hit");
            playSound("hit");
            if (e.isBosse) { e.hp--; p.vy = -11; if (e.hp <= 0) { e.dead = true; spawnDropCoins(e); } }
            else { e.dead = true; spawnDropCoins(e); p.vy = -11; }
          } else {
            loseLife(); if (g.stopped) return; break;
          }
        }
      }
      g.levelEnemies = g.levelEnemies.filter((e) => !e.dead);

      // Enemy projectiles — solo eliminan al ser bloqueados, NO dañan al jugador
      for (const ep of g.enemyProjectiles) { ep.x += ep.vx; ep.y += (ep.vy || 0); }
      g.enemyProjectiles = g.enemyProjectiles.filter((ep) => {
        if (ep.x < -100 || ep.x > lev.width + 100 || ep.y < -100 || ep.y > H + 100) return false;
        return true;
      });

      // Boss alive check
      const bossAlive = lev.isBoss && g.levelEnemies.some((e) => e.isBosse);

      // Flag
      const reachedFlag = overlap(p, lev.flag) || (
        g.autoPlay &&
        p.x + p.w >= lev.flag.x &&
        p.x <= lev.flag.x + lev.flag.w + 120
      );
      if (reachedFlag) {
        if (bossAlive) {
          g.bossBlockFlash = 90; // show warning
        } else if (g.currentLevel < LEVELS.length - 1) {
          loadLevel(g.currentLevel + 1);
        } else {
          playSound("win");
          g.stopped = true; setFinalScore(calculateScore(g)); setScreen("win"); return;
        }
      }

      if (g.bossAnnounce > 0) g.bossAnnounce--;
      if (g.levelAnnounce > 0) g.levelAnnounce--;
      if (g.screenShake > 0) g.screenShake--;
      for (const part of g.particles) {
        part.age++;
        part.x += part.vx;
        part.y += part.vy;
        part.vy += 0.08;
      }
      g.particles = g.particles.filter((part) => part.age < part.life);
      for (const impact of g.impacts) impact.age++;
      g.impacts = g.impacts.filter((impact) => impact.age < impact.maxAge);

      // ── Draw ──
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (g.screenShake > 0) {
        const shake = g.screenShake * 0.32;
        ctx.translate(Math.sin(g.frame * 1.9) * shake, Math.cos(g.frame * 1.4) * shake);
      }
      drawBg(g.frame);
      drawPlatforms(g.cameraX);
      drawCoins(g.cameraX, g.levelCoins);
      drawEnemies(g.cameraX, g.levelEnemies, g.frame);
      drawProjectiles(g.cameraX, g.projectiles);
      drawEnemyProjectiles(g.cameraX, g.enemyProjectiles);
      drawImpacts(g.cameraX, g.impacts);
      drawParticles(g.cameraX, g.particles);
      drawFlag(g.cameraX, bossAlive);
      drawDoubleJumpFlash(p, g.cameraX, g.doubleJumpFlash);
      if (g.hasPower) drawPowerAura(p, g.cameraX, g.frame);
      drawChar(p, g.frame, g.cameraX, g.invincibleFrames, k.sprint);
      drawAtmosphere(g.frame);
      drawHUD(g);
      ctx.restore();

      // Progress bar
      const prog = Math.min(1, (p.x + p.w) / lev.width);
      ctx.fillStyle = "rgba(255,133,0,0.22)"; ctx.fillRect(0, 46, W, 4);
      ctx.fillStyle = bossAlive ? "#ff2200" : "#ff8500"; ctx.fillRect(0, 46, W * prog, 4);
      ctx.fillStyle = "#fff"; ctx.fillRect(W - 6, 44, 4, 8);

      // Boss block warning
      if (g.bossBlockFlash > 0) {
        const alpha = g.bossBlockFlash > 15 ? 1 : g.bossBlockFlash / 15;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(160,0,0,0.88)"; ctx.fillRect(W / 2 - 225, H / 2 - 34, 450, 68);
        ctx.strokeStyle = "#ff4444"; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - 225, H / 2 - 34, 450, 68);
        ctx.fillStyle = "#fff"; ctx.font = "bold 20px monospace"; ctx.textAlign = "center";
        ctx.fillText("¡DERROTA AL JEFE PRIMERO!", W / 2, H / 2 + 8);
        ctx.globalAlpha = 1;
      }

      // Boss announce
      if (g.bossAnnounce > 0) {
        const alpha = g.bossAnnounce > 30 ? 1 : g.bossAnnounce / 30;
        ctx.globalAlpha = alpha;
        const isFinal = lev.isFinalLevel;
        ctx.fillStyle = isFinal ? "rgba(0,0,30,0.92)" : "rgba(60,0,110,0.9)";
        ctx.fillRect(W / 2 - 240, H / 2 - 62, 480, 124);
        ctx.strokeStyle = isFinal ? "#88ccff" : "#ff00ff"; ctx.lineWidth = 3;
        ctx.strokeRect(W / 2 - 240, H / 2 - 62, 480, 124);
        ctx.fillStyle = isFinal ? "#aaddff" : "#ff00ff";
        ctx.font = "bold 38px monospace"; ctx.textAlign = "center";
        ctx.fillText(isFinal ? "☆ JEFE FINAL ☆" : "! JEFE !", W / 2, H / 2 - 8);
        ctx.font = "bold 15px monospace"; ctx.fillStyle = "#ffffff";
        ctx.fillText(isFinal ? "DERROTA AL FANTASMA PARA GANAR" : "CASTILLO — DERROTA AL MONSTRUO", W / 2, H / 2 + 32);
        ctx.globalAlpha = 1;
      }

      // Level announce
      if (g.levelAnnounce > 0) {
        const alpha = g.levelAnnounce > 15 ? 1 : g.levelAnnounce / 15;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(0,0,0,0.72)"; ctx.fillRect(W / 2 - 155, H - 96, 310, 50);
        ctx.fillStyle = "#ff8500"; ctx.font = "bold 20px monospace"; ctx.textAlign = "center";
        ctx.fillText(LEVELS[g.currentLevel].name.toUpperCase(), W / 2, H - 64);
        ctx.globalAlpha = 1;
      }

      } catch (err) { console.error("[game]", err); }
      rafRef.current = requestAnimationFrame(loop);
    }

    function onKeyDown(e) {
      const k = keysRef.current;
      if ((e.metaKey || e.ctrlKey) && e.key === "2") {
        e.preventDefault();
        if (gRef.current) gRef.current.autoPlay = !gRef.current.autoPlay;
        return;
      }
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") k.left = true;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") k.right = true;
      if (e.code === "Space" || e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        e.preventDefault(); k.jump = true; k.jumpPressed = true;
      }
      if (e.key.toLowerCase() === "x") { e.preventDefault(); k.power = true; }
      if (e.key.toLowerCase() === "z") { e.preventDefault(); k.sprint = true; }
    }
    function onKeyUp(e) {
      const k = keysRef.current;
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") k.left = false;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") k.right = false;
      if (e.code === "Space" || e.key === "ArrowUp" || e.key.toLowerCase() === "w") k.jump = false;
      if (e.key.toLowerCase() === "z") k.sprint = false;
    }
    function onBlur() {
      const k = keysRef.current;
      k.left = false; k.right = false; k.jump = false;
      k.jumpPressed = false; k.sprint = false; k.power = false;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
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
  function mobileJumpHandlers() {
    return {
      onTouchStart: (e) => { e.preventDefault(); keysRef.current.jump = true; keysRef.current.jumpPressed = true; },
      onTouchEnd: (e) => { e.preventDefault(); keysRef.current.jump = false; },
      onMouseDown: () => { keysRef.current.jump = true; keysRef.current.jumpPressed = true; },
      onMouseUp: () => { keysRef.current.jump = false; },
      onMouseLeave: () => { keysRef.current.jump = false; },
    };
  }
  function mobilePowerHandler() {
    return {
      onTouchStart: (e) => { e.preventDefault(); keysRef.current.power = true; },
      onMouseDown: () => { keysRef.current.power = true; },
    };
  }

  return (
    <main style={{ minHeight: "100vh", background: "#050505" }}>
      <SiteHeader />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px 80px" }}>
        <p style={{ color: "rgba(255,255,255,0.35)", margin: "0 0 20px", fontSize: "0.82rem", textAlign: "center", letterSpacing: "0.08em" }}>
          <kbd style={kbdStyle}>←→</kbd> mover &nbsp;·&nbsp;
          <kbd style={kbdStyle}>↑/W</kbd> saltar &nbsp;·&nbsp;
          <kbd style={kbdStyle}>Z</kbd> sprint &nbsp;·&nbsp;
          <kbd style={kbdStyle}>X</kbd> poder
        </p>
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 0 80px rgba(132,204,22,0.18), 0 0 0 1px rgba(132,204,22,0.25)" }}>
          <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", maxWidth: "100%" }} />

          {screen === "start" && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "32px 40px", gap: 0, overflow: "hidden",
            }}>
              {/* GIF background */}
              <img src="/portal-gateway.gif" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }} />
              {/* Dark overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(2,8,2,0.88) 0%, rgba(3,18,3,0.82) 100%)" }} />
              {/* Green radial glow */}
              <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 300, background: "radial-gradient(ellipse, rgba(132,204,22,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
              {/* Content on top */}
              <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              {/* Portal header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#84cc16", boxShadow: "0 0 8px #84cc16", display: "inline-block" }} />
                <span style={{ color: "#84cc16", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase" }}>Portal Drokex</span>
              </div>
              <p style={{ color: "rgba(132,204,22,0.6)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.18em", margin: "0 0 28px", textTransform: "uppercase" }}>
                GATEWAY ACTIVO / MODO JUEGO
              </p>

              {/* Big title */}
              <div style={{ textAlign: "center", marginBottom: 32, lineHeight: 0.9 }}>
                <div style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.08)", fontFamily: "monospace", lineHeight: 0.88 }}>
                  DROKEX
                </div>
                <div style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900, letterSpacing: "-0.02em", color: "#84cc16", fontFamily: "monospace", lineHeight: 0.88 }}>
                  PLATFORM
                </div>
              </div>

              {/* Top 3 scores */}
              <div style={{ width: "min(420px, 100%)", marginBottom: 32 }}>
                <p style={{ color: "rgba(132,204,22,0.55)", fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px", textAlign: "center" }}>
                  — Top agentes —
                </p>
                {highScores.length === 0 ? (
                  <div style={{ border: "1px solid rgba(132,204,22,0.12)", borderRadius: 10, padding: "14px 18px", textAlign: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.82rem" }}>Sin puntajes aún — sé el primero</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {highScores.slice(0, 3).map((s, i) => (
                      <div key={s.id ?? i} style={{
                        display: "flex", alignItems: "center", gap: 14,
                        border: `1px solid ${i === 0 ? "rgba(132,204,22,0.35)" : "rgba(255,255,255,0.07)"}`,
                        borderRadius: 10, padding: "11px 16px",
                        background: i === 0 ? "rgba(132,204,22,0.06)" : "rgba(255,255,255,0.02)",
                      }}>
                        <span style={{
                          fontSize: "0.65rem", fontWeight: 900, fontFamily: "monospace",
                          color: i === 0 ? "#84cc16" : "rgba(255,255,255,0.3)",
                          letterSpacing: "0.1em", minWidth: 22,
                        }}>0{i + 1}</span>
                        <span style={{ flex: 1, fontSize: "0.88rem", fontWeight: 700, color: i === 0 ? "#fff" : "rgba(255,255,255,0.6)" }}>{s.name}</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 900, fontFamily: "monospace", color: i === 0 ? "#84cc16" : "rgba(255,255,255,0.4)" }}>
                          {s.score.toLocaleString()} pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <button onClick={startGame} style={{
                background: "#84cc16", color: "#050505", border: "none",
                borderRadius: 10, padding: "15px 48px",
                fontSize: "0.9rem", fontWeight: 900, cursor: "pointer",
                letterSpacing: "0.12em", textTransform: "uppercase",
                boxShadow: "0 0 32px rgba(132,204,22,0.4)",
                transition: "box-shadow 0.2s",
              }}>
                Iniciar misión →
              </button>
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.68rem", marginTop: 14, letterSpacing: "0.08em" }}>
                15 niveles · jefe final · doble salto · sprint
              </p>
              </div>{/* end content wrapper */}
            </div>
          )}
          {screen === "dead" && (
            <div style={overlayStyle}>
              <p style={{ ...tagStyle, color: "#ff4500" }}>Game Over</p>
              <h2 style={titleStyle}>¡Sin vidas!</h2>
              <p style={subStyle}>Puntaje: {finalScore} pts · Monedas: {hudCoins}</p>
              <form onSubmit={saveHighScore} style={{ ...scoreFormStyle, marginBottom: 14 }}>
                <input value={playerName} onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Tu nombre (opcional)" maxLength={18} style={scoreInputStyle} autoFocus disabled={savingScore} />
                <button type="submit" style={{ ...btnStyle, opacity: savingScore ? 0.6 : 1 }} disabled={savingScore}>
                  {savingScore ? "Guardando..." : "Guardar puntaje"}
                </button>
              </form>
              <button onClick={startGame} style={{ ...btnStyle, background: "rgba(255,255,255,0.1)", fontSize: "0.85rem", padding: "10px 28px" }}>
                Intentar de nuevo
              </button>
            </div>
          )}
          {screen === "win" && (
            <div style={overlayStyle}>
              <p style={{ ...tagStyle, color: "#84cc16" }}>¡Completado!</p>
              <h2 style={titleStyle}>¡Ganaste!</h2>
              <p style={subStyle}>Derrotaste al Jefe Final con {finalScore} puntos.</p>
              <form onSubmit={saveHighScore} style={scoreFormStyle}>
                <input value={playerName} onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Tu nombre" maxLength={18} style={scoreInputStyle} autoFocus disabled={savingScore} />
                <button type="submit" style={{ ...btnStyle, opacity: savingScore ? 0.6 : 1 }} disabled={savingScore}>
                  {savingScore ? "Guardando..." : "Guardar puntaje"}
                </button>
              </form>
            </div>
          )}
          {screen === "scores" && (
            <div style={overlayStyle}>
              <p style={{ ...tagStyle, color: "#84cc16" }}>Ranking Global</p>
              <h2 style={titleStyle}>Top 10 Drokex</h2>
              <div style={scoreListStyle}>
                {highScores.length === 0
                  ? <p style={{ opacity: 0.5 }}>Sin puntajes aún</p>
                  : highScores.map((s, i) => <p key={s.id ?? i}>{i + 1}. {s.name} · {s.score} pts</p>)
                }
              </div>
              <button onClick={startGame} style={btnStyle}>Jugar de nuevo</button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button style={mobileBtnStyle} {...mobileHandlers("left")}>←</button>
          <button style={mobileBtnStyle} {...mobileJumpHandlers()}>↑↑</button>
          <button style={mobileBtnStyle} {...mobileHandlers("right")}>→</button>
          <button style={{ ...mobileBtnStyle, background: "#0055cc" }} {...mobileHandlers("sprint")}>Z</button>
          <button style={{ ...mobileBtnStyle, background: "#6600aa", fontSize: 15 }} {...mobilePowerHandler()}>POW</button>
        </div>
      </div>
    </main>
  );
}

const kbdStyle = { background: "rgba(132,204,22,0.1)", color: "#84cc16", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(132,204,22,0.3)", fontFamily: "monospace", fontSize: "0.8rem" };
const overlayStyle = { position: "absolute", inset: 0, background: "rgba(6,13,26,0.88)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 };
const tagStyle = { color: "#ff8500", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px" };
const titleStyle = { color: "#fff", fontSize: "2rem", fontWeight: 800, margin: "0 0 8px" };
const subStyle = { color: "rgba(255,255,255,0.6)", margin: "0 0 28px", fontSize: "0.95rem", textAlign: "center" };
const scoreListStyle = { minWidth: 260, margin: "0 0 24px", padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.95rem", lineHeight: 1.7, textAlign: "left" };
const scoreFormStyle = { display: "flex", flexDirection: "column", gap: 14, width: "min(320px, 100%)" };
const scoreInputStyle = { width: "100%", border: "1px solid rgba(255,255,255,0.24)", borderRadius: 12, background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 16px", fontSize: "1rem", outline: "none" };
const btnStyle = { background: "#ff8500", color: "#fff", border: "none", borderRadius: 12, padding: "14px 40px", fontSize: "1rem", fontWeight: 800, cursor: "pointer", letterSpacing: "0.05em" };
const mobileBtnStyle = { width: 60, height: 52, border: "none", borderRadius: 14, background: "#ff8500", fontSize: 20, fontWeight: "bold", cursor: "pointer", color: "#fff", touchAction: "none" };
