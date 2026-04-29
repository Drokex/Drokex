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
const TOTAL_LEVELS = 10;
const HIGH_SCORE_STORAGE_KEY = "drokex-game-high-scores";
const POWER_COST = 40;
const POWER_COOLDOWN = 50;

function buildLevel(index) {
  const difficulty = index + 1;
  const isFinalLevel = index === 9;
  const isBoss = (difficulty % 3 === 0) || isFinalLevel;
  const castleNum = isFinalLevel ? 4 : (isBoss ? Math.ceil(difficulty / 3) : 0);
  const width = 2500 + index * 400;

  const platforms = [];
  const groundSegments = Math.min(3 + Math.floor(index * 0.65), 10);
  const gap = 72 + index * 15;
  const minGroundWidth = 260;
  const totalGapWidth = gap * (groundSegments - 1);
  const segmentWidth = Math.max(minGroundWidth, Math.floor((width - totalGapWidth) / groundSegments));
  let x = 0;
  for (let i = 0; i < groundSegments; i++) {
    const isLast = i === groundSegments - 1;
    platforms.push({ x, y: 480, w: isLast ? width - x : segmentWidth, h: 60 });
    x += segmentWidth + gap;
  }

  const floatingCount = 5 + Math.floor(index * 1.3);
  for (let i = 0; i < floatingCount; i++) {
    const px = 300 + i * Math.max(190, Math.floor((width - 620) / Math.max(1, floatingCount - 1)));
    const yPattern = [375, 315, 350, 290, 335, 300];
    const py = yPattern[(i + index) % yPattern.length] - Math.min(index * 4, 32);
    platforms.push({
      x: Math.min(px, width - 280),
      y: Math.max(245, py),
      w: Math.max(90, 178 - index * 8),
      h: 28,
    });
  }

  const coins = [];
  const coinCount = 12 + index * 2;
  for (let i = 0; i < coinCount; i++) {
    const basePlatform = platforms[3 + (i % floatingCount)] || platforms[i % platforms.length];
    coins.push({
      x: Math.min(basePlatform.x + basePlatform.w / 2 + (i % 3 - 1) * 22, width - 140),
      y: basePlatform.y - 38,
    });
  }
  coins.push({ x: width - 220, y: 430 });

  const enemies = [];
  const enemyCount = Math.min(3 + Math.floor(index * 0.85), 12);
  for (let i = 0; i < enemyCount; i++) {
    const ground = platforms[i % groundSegments];
    const minX = ground.x + 45;
    const maxX = Math.max(minX + 130, ground.x + ground.w - 80);
    // Keep enemies far from player spawn (x=80) — push them to safe start
    const startX = ground.x < 300 ? Math.max(minX + 30, Math.min(500, maxX - 10)) : minX + 30;
    enemies.push({ x: startX, y: 440, w: 42, h: 40, minX, maxX, vx: 2.6 + index * 0.42 + i * 0.22 });
  }

  const flyingCount = Math.floor(index * 0.65);
  for (let i = 0; i < flyingCount; i++) {
    const fx = 600 + i * Math.floor((width - 800) / Math.max(1, flyingCount));
    const baseY = 185 + (i % 4) * 58;
    enemies.push({
      x: Math.min(fx, width - 200), y: baseY, w: 40, h: 34,
      minX: Math.max(300, fx - 240), maxX: Math.min(width - 100, fx + 240),
      vx: 3 + index * 0.38 + i * 0.16, isFlying: true, baseY, floatPhase: i * (Math.PI / 2.2),
    });
  }

  if (isFinalLevel) {
    // Ghost final boss — chases the player
    const midX = Math.floor(width * 0.5);
    enemies.push({
      x: midX, y: 220, w: 96, h: 96,
      minX: 80, maxX: width - 160,
      vx: 0, hp: 12, maxHp: 12,
      isBosse: true, isFinalBoss: true,
    });
  } else if (isBoss) {
    const midX = Math.floor(width * 0.55);
    const bossHP = 2 * castleNum + 1;
    const bossW = 60 + castleNum * 14;
    const bossH = 60 + castleNum * 9;
    enemies.push({
      x: midX, y: 480 - bossH, w: bossW, h: bossH,
      minX: midX - 270, maxX: midX + 270,
      vx: 1.8 + index * 0.18, hp: bossHP, maxHp: bossHP,
      isBosse: true, castleNum,
    });
    for (let fi = 0; fi < castleNum - 1; fi++) {
      const fmx = midX + (fi % 2 === 0 ? -380 : 380);
      const fmy = 205 + fi * 55;
      enemies.push({
        x: fmx, y: fmy, w: 42, h: 36,
        minX: midX - 550, maxX: midX + 550,
        vx: 3.2 + castleNum * 0.55, isFlying: true, baseY: fmy, floatPhase: fi * Math.PI,
      });
    }
  }

  return {
    name: isFinalLevel ? "Jefe Final" : isBoss ? `Castillo ${castleNum}` : `Nivel ${difficulty}`,
    isBoss, isFinalLevel, castleNum, width, platforms, coins, enemies,
    flag: { x: width - 160, y: 380, w: 44, h: 100 },
  };
}

const LEVELS = Array.from({ length: TOTAL_LEVELS }, (_, i) => buildLevel(i));

function newState() {
  return {
    stopped: false, currentLevel: 0, coins: 0, lives: 3,
    cameraX: 0, frame: 0, projectiles: [],
    powerCooldown: 0, bossAnnounce: 0, levelAnnounce: 90,
    invincibleFrames: 80, // grace period at game start
    doubleJumpFlash: 0, killScore: 0, bossBlockFlash: 0,
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

  const [screen, setScreen] = useState("start");
  const [hudCoins, setHudCoins] = useState(0);
  const [hudLives, setHudLives] = useState(3);
  const [finalScore, setFinalScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY) || "[]");
      setHighScores(Array.isArray(saved) ? saved.slice(0, 3) : []);
    } catch { setHighScores([]); }
  }, []);

  function calculateScore(game) {
    return game.coins * 25 + game.lives * 150 + (game.currentLevel + 1) * 120 + (game.killScore || 0);
  }

  function startGame() {
    gRef.current = newState();
    setHudCoins(0); setHudLives(3); setFinalScore(0); setPlayerName("");
    setScreen("playing");
  }

  function saveHighScore(e) {
    e.preventDefault();
    const name = playerName.trim() || "Jugador";
    const next = [...highScores, { name, score: finalScore }].sort((a, b) => b.score - a.score).slice(0, 3);
    window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, JSON.stringify(next));
    setHighScores(next);
    setScreen("scores");
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
      g.powerCooldown = 0;
      g.invincibleFrames = 80; // grace period on level entry
      g.doubleJumpFlash = 0;
      g.bossBlockFlash = 0;
      g.bossAnnounce = LEVELS[idx].isBoss ? (LEVELS[idx].isFinalLevel ? 220 : 180) : 0;
      g.levelAnnounce = LEVELS[idx].isBoss ? 0 : 90;
      Object.assign(g.player, { x: 80, y: 200, vx: 0, vy: 0, grounded: false, jumpsLeft: 2 });
    }

    function loseLife() {
      const g = gRef.current;
      g.lives--;
      if (g.lives <= 0) { g.stopped = true; setScreen("dead"); }
      else {
        setHudLives(g.lives);
        g.projectiles = [];
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
        g.killScore += 200; // per hit
      } else if (e.isBosse) {
        g.killScore += 100; // per hit on castle boss
      } else if (e.isFlying) {
        g.killScore += 80;
      } else {
        g.killScore += 50;
      }
    }

    // ─── Draw helpers ──────────────────────────────────────────────
    function drawBg(frame) {
      const lev = LEVELS[gRef.current.currentLevel];
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      if (lev.isFinalLevel) {
        grad.addColorStop(0, "#000008");
        grad.addColorStop(1, "#060018");
      } else if (lev.isBoss) {
        grad.addColorStop(0, "#110020");
        grad.addColorStop(1, "#1e0038");
      } else {
        grad.addColorStop(0, "#060d1a");
        grad.addColorStop(1, "#0d1f35");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const stars = [
        [50,30],[120,80],[200,20],[320,60],[450,30],[600,70],[720,25],
        [760,90],[80,110],[400,100],[550,50],[850,40],[900,100],
        [150,150],[700,140],[350,170],[480,60],[230,130],[810,55],[660,120],
      ];
      for (const [sx, sy] of stars) {
        ctx.globalAlpha = 0.28 + 0.45 * Math.sin(frame * 0.05 + sx);
        ctx.fillStyle = lev.isFinalLevel ? "#aaddff" : lev.isBoss ? "#ff88ff" : "#fff";
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.globalAlpha = 1;

      if (lev.isFinalLevel) {
        // Ethereal floating orbs background
        for (let oi = 0; oi < 12; oi++) {
          const ox = (oi * 137 + frame * 0.18) % W;
          const oy = 60 + ((oi * 83 + frame * 0.12) % (H - 160));
          ctx.globalAlpha = 0.05 + 0.03 * Math.sin(frame * 0.04 + oi);
          ctx.fillStyle = "#88ccff";
          ctx.beginPath();
          ctx.arc(ox, oy, 5 + (oi % 3) * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      } else if (lev.isBoss) {
        const towers = [
          [0,175,82],[92,148,56],[162,172,72],[282,138,94],
          [412,158,62],[502,128,84],[622,153,66],[724,143,78],[832,163,72],[922,138,62],
        ];
        for (const [cx, cy, cw] of towers) {
          ctx.fillStyle = "#19002a";
          ctx.fillRect(cx, cy, cw, H - cy);
          ctx.fillStyle = "#110020";
          for (let bx = cx; bx < cx + cw - 8; bx += 17) ctx.fillRect(bx, cy - 16, 10, 16);
          ctx.fillStyle = "rgba(180,0,255,0.18)";
          for (let wy = cy + 18; wy < cy + 105; wy += 24)
            for (let wx = cx + 8; wx < cx + cw - 8; wx += 18)
              if (Math.sin(wx * 3 + wy * 5) > 0.25) ctx.fillRect(wx, wy, 8, 12);
        }
      } else {
        const buildings = [
          [0,200,60],[70,220,50],[130,180,70],[210,210,40],[260,170,55],
          [325,195,45],[380,160,65],[455,205,50],[515,175,60],[585,190,55],
          [650,165,70],[730,200,70],[820,180,60],[900,210,55],
        ];
        for (const [bx, by, bw] of buildings) {
          ctx.fillStyle = "#0a1628";
          ctx.fillRect(bx, by, bw, H - by);
          ctx.fillStyle = "rgba(255,133,0,0.18)";
          for (let wy = by + 10; wy < by + 120; wy += 18)
            for (let wx = bx + 6; wx < bx + bw - 6; wx += 12)
              if (Math.sin(wx * 3 + wy * 7) > 0.3) ctx.fillRect(wx, wy, 6, 8);
        }
      }
    }

    function drawPlatforms(camX) {
      ctx.save();
      ctx.translate(-camX, 0);
      const lev = LEVELS[gRef.current.currentLevel];
      for (const p of lev.platforms) {
        ctx.fillStyle = lev.isBoss ? "#1a0028" : "#1a0a00";
        ctx.fillRect(p.x, p.y, p.w, p.h);
        const g2 = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y);
        const c1 = lev.isFinalLevel ? "#4488cc" : lev.isBoss ? "#aa00ff" : "#ff8500";
        const c2 = lev.isFinalLevel ? "#88ccff" : lev.isBoss ? "#dd44ff" : "#ffb347";
        g2.addColorStop(0, c1); g2.addColorStop(0.5, c2); g2.addColorStop(1, c1);
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
        ctx.beginPath(); ctx.arc(c.x, c.y, 11, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center";
        ctx.fillText("$", c.x, c.y + 3);
      }
      ctx.restore();
    }

    function drawEnemies(camX, enemies, frame) {
      ctx.save();
      ctx.translate(-camX, 0);
      for (const e of enemies) {
        if (e.dead) continue;
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
          // ── Castle boss ──
          ctx.fillStyle = "#4a0082"; ctx.fillRect(e.x, e.y, e.w, e.h);
          ctx.globalAlpha = 0.15 + 0.08 * Math.sin(frame * 0.1);
          ctx.fillStyle = "#cc00ff"; ctx.fillRect(e.x - 6, e.y - 6, e.w + 12, e.h + 12);
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#7700cc"; ctx.fillRect(e.x + 6, e.y - 18, 13, 18); ctx.fillRect(e.x + e.w - 19, e.y - 18, 13, 18);
          ctx.fillStyle = "#ff00ff"; ctx.fillRect(e.x + 9, e.y - 22, 7, 7); ctx.fillRect(e.x + e.w - 16, e.y - 22, 7, 7);
          ctx.fillStyle = "#ff0000"; ctx.fillRect(e.x + 10, e.y + 13, 17, 15); ctx.fillRect(e.x + e.w - 27, e.y + 13, 17, 15);
          ctx.fillStyle = "#ff9999"; ctx.fillRect(e.x + 14, e.y + 16, 9, 9); ctx.fillRect(e.x + e.w - 23, e.y + 16, 9, 9);
          ctx.fillStyle = "#000"; ctx.fillRect(e.x + 17, e.y + 18, 5, 5); ctx.fillRect(e.x + e.w - 22, e.y + 18, 5, 5);
          ctx.fillStyle = "#1a0030"; ctx.fillRect(e.x + 11, e.y + e.h - 19, e.w - 22, 11);
          ctx.fillStyle = "#ddd";
          for (let tx = e.x + 13; tx < e.x + e.w - 17; tx += 13) ctx.fillRect(tx, e.y + e.h - 19, 9, 7);
          const hpR = (e.hp || 0) / (e.maxHp || 1);
          ctx.fillStyle = "rgba(0,0,0,0.75)"; ctx.fillRect(e.x - 3, e.y - 34, e.w + 6, 11);
          ctx.fillStyle = hpR > 0.6 ? "#00ee44" : hpR > 0.3 ? "#ffaa00" : "#ff2200";
          ctx.fillRect(e.x - 3, e.y - 34, (e.w + 6) * hpR, 11);
          ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(e.x - 3, e.y - 34, e.w + 6, 11);
          ctx.fillStyle = "#ff00ff"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center";
          ctx.fillText("JEFE", e.x + e.w / 2, e.y - 38);

        } else if (e.isFlying) {
          // ── Flying bat enemy ──
          const flap = Math.sin(frame * 0.22 + (e.floatPhase || 0)) > 0;
          ctx.fillStyle = "#003888";
          if (flap) {
            ctx.fillRect(e.x - 16, e.y + 4, 16, 12); ctx.fillRect(e.x + e.w, e.y + 4, 16, 12);
            ctx.fillRect(e.x - 20, e.y, 8, 8); ctx.fillRect(e.x + e.w + 12, e.y, 8, 8);
          } else {
            ctx.fillRect(e.x - 14, e.y + 10, 14, 8); ctx.fillRect(e.x + e.w, e.y + 10, 14, 8);
            ctx.fillRect(e.x - 16, e.y + 16, 8, 6); ctx.fillRect(e.x + e.w + 8, e.y + 16, 8, 6);
          }
          ctx.fillStyle = "#0055cc"; ctx.fillRect(e.x, e.y, e.w, e.h);
          ctx.fillStyle = "#00ffee"; ctx.fillRect(e.x + 6, e.y + 6, 9, 9); ctx.fillRect(e.x + e.w - 15, e.y + 6, 9, 9);
          ctx.fillStyle = "#fff"; ctx.fillRect(e.x + 8, e.y + 8, 5, 5); ctx.fillRect(e.x + e.w - 13, e.y + 8, 5, 5);
          ctx.fillRect(e.x + 14, e.y + e.h - 8, 5, 8); ctx.fillRect(e.x + e.w - 19, e.y + e.h - 8, 5, 8);

        } else {
          // ── Regular ground enemy ──
          ctx.fillStyle = "#cc0000"; ctx.fillRect(e.x, e.y, e.w, e.h);
          ctx.fillStyle = "#ff0"; ctx.fillRect(e.x + 7, e.y + 7, 9, 9); ctx.fillRect(e.x + e.w - 16, e.y + 7, 9, 9);
          ctx.fillStyle = "#000"; ctx.fillRect(e.x + 10, e.y + 10, 4, 4); ctx.fillRect(e.x + e.w - 13, e.y + 10, 4, 4);
          ctx.fillStyle = "#fff"; ctx.fillRect(e.x + 8, e.y + e.h - 10, e.w - 16, 5);
        }
      }
      ctx.restore();
    }

    function drawProjectiles(camX, projectiles) {
      if (!projectiles.length) return;
      ctx.save();
      ctx.translate(-camX, 0);
      for (const proj of projectiles) {
        ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 20;
        ctx.fillStyle = "#ff8500";
        ctx.beginPath(); ctx.arc(proj.x, proj.y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(proj.x - 2, proj.y - 2, 4, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.4; ctx.fillStyle = "#ff8500";
        ctx.beginPath(); ctx.arc(proj.x - proj.vx * 0.5, proj.y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.18;
        ctx.beginPath(); ctx.arc(proj.x - proj.vx, proj.y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    }

    function drawFlag(camX, bossAlive) {
      const f = LEVELS[gRef.current.currentLevel].flag;
      ctx.save();
      ctx.translate(-camX, 0);
      ctx.fillStyle = "#888"; ctx.fillRect(f.x + 2, f.y, 6, f.h);
      if (bossAlive) {
        // Blocked — red flag
        ctx.fillStyle = "#cc0000"; ctx.fillRect(f.x + 8, f.y, 50, 28);
        ctx.fillStyle = "#fff"; ctx.font = "bold 10px monospace"; ctx.textAlign = "center";
        ctx.fillText("¡JEFE!", f.x + 33, f.y + 18);
      } else {
        ctx.fillStyle = "#ff8500"; ctx.fillRect(f.x + 8, f.y, 50, 28);
        ctx.fillStyle = "#fff"; ctx.font = "bold 14px monospace"; ctx.textAlign = "center";
        ctx.fillText("GO", f.x + 33, f.y + 20);
      }
      ctx.restore();
    }

    function drawChar(p, frame, camX, invincible, sprinting) {
      if (invincible > 0 && Math.floor(invincible / 5) % 2 === 0) return;
      ctx.save();
      if (sprinting && Math.abs(p.vx) > 3) {
        ctx.globalAlpha = 0.22; ctx.fillStyle = "#84cc16";
        ctx.fillRect(p.x - camX - p.vx * 2.2, p.y + 12, p.w, p.h - 12);
        ctx.globalAlpha = 0.1;
        ctx.fillRect(p.x - camX - p.vx * 4.4, p.y + 24, p.w, p.h - 24);
        ctx.globalAlpha = 1;
      }
      ctx.translate(p.x - camX + p.w / 2, p.y + p.h / 2);
      ctx.scale(p.facing, 1);
      if (sprite.complete && sprite.naturalWidth > 0) {
        const animFrame = p.grounded ? Math.floor(frame / 5) % SPRITE_FRAMES : 2;
        ctx.drawImage(sprite, animFrame * SPRITE_SRC_W, 0, SPRITE_SRC_W, SPRITE_SRC_H, -p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.fillStyle = "#84cc16"; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }

    function drawDoubleJumpFlash(p, camX, flash) {
      if (flash <= 0) return;
      const progress = 1 - flash / 15;
      ctx.save();
      ctx.translate(p.x - camX + p.w / 2, p.y + p.h / 2);
      ctx.globalAlpha = flash / 15;
      ctx.strokeStyle = "#00ffee"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, p.w * (0.7 + progress * 1.4), 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function drawHUD(g) {
      ctx.fillStyle = "rgba(0,0,0,0.58)"; ctx.fillRect(0, 0, W, 46);
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = "#ff8500"; ctx.textAlign = "left";
      ctx.fillText(LEVELS[g.currentLevel].name.toUpperCase(), 14, 28);
      ctx.fillStyle = "#ffd700"; ctx.textAlign = "center";
      ctx.fillText(`● ${g.coins}   PTS ${calculateScore(g)}`, 345, 28);
      if (g.coins >= POWER_COST) {
        ctx.fillStyle = g.powerCooldown > 0 ? "#888" : "#00ff88";
        ctx.fillText(g.powerCooldown > 0 ? "** ESPERA **" : "** PODER [X] **", 650, 28);
      } else {
        ctx.fillStyle = "rgba(255,200,0,0.45)";
        ctx.fillText(`poder: ${g.coins}/${POWER_COST}`, 640, 28);
      }
      ctx.fillStyle = "#ff4444"; ctx.textAlign = "right";
      ctx.fillText(`♥ ${g.lives}`, W - 14, 28);
    }

    // ─── Game loop ─────────────────────────────────────────────────
    function loop() {
      const g = gRef.current;
      if (!g || g.stopped) return;

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
        }
      }

      p.vx = Math.max(Math.min(p.vx * FRICTION, p.maxSpeed * spMult), -p.maxSpeed * spMult);
      p.vy += GRAVITY;
      p.x += p.vx; resolvePlatforms("x");
      p.y += p.vy; p.grounded = false; resolvePlatforms("y");

      if (p.y > H + 200) { loseLife(); if (g.stopped) return; }
      p.x = Math.max(0, Math.min(p.x, lev.width - p.w));
      g.cameraX = Math.max(0, Math.min(p.x - W / 2 + p.w / 2, lev.width - W));

      // Coins
      const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
      for (const c of g.levelCoins) {
        if (!c.collected && Math.hypot(c.x - cx, c.y - cy) < p.w / 2 + 12) {
          c.collected = true; g.coins++; setHudCoins(g.coins);
        }
      }

      if (g.invincibleFrames > 0) g.invincibleFrames--;
      if (g.doubleJumpFlash > 0) g.doubleJumpFlash--;
      if (g.bossBlockFlash > 0) g.bossBlockFlash--;

      // Power
      if (k.power) {
        k.power = false;
        if (g.coins >= POWER_COST && g.powerCooldown <= 0) {
          g.coins -= POWER_COST; setHudCoins(g.coins);
          g.powerCooldown = POWER_COOLDOWN;
          g.projectiles.push({ x: p.x + (p.facing > 0 ? p.w + 5 : -22), y: p.y + p.h * 0.38, vx: p.facing * 17 });
        }
      }
      if (g.powerCooldown > 0) g.powerCooldown--;

      // Projectiles
      for (const proj of g.projectiles) proj.x += proj.vx;
      g.projectiles = g.projectiles.filter((proj) => {
        if (proj.x < -80 || proj.x > lev.width + 80) return false;
        for (const e of g.levelEnemies) {
          if (e.dead) continue;
          if (overlap({ x: proj.x - 10, y: proj.y - 10, w: 20, h: 20 }, e)) {
            awardKill(e);
            if (e.isBosse) { e.hp--; if (e.hp <= 0) e.dead = true; }
            else e.dead = true;
            return false;
          }
        }
        return true;
      });

      // Enemies
      for (const e of g.levelEnemies) {
        if (e.dead) continue;
        if (e.isFinalBoss) {
          // Ghost chases player slowly
          const tx = p.x + p.w / 2 - e.w / 2;
          const ty = p.y + p.h / 2 - e.h / 2 - 30;
          e.x += (tx - e.x) * 0.016;
          e.y += (ty - e.y) * 0.013;
          e.y += Math.sin(g.frame * 0.06) * 1.5; // eerie floating
          e.x = Math.max(e.minX, Math.min(e.maxX, e.x));
          e.y = Math.max(55, Math.min(430, e.y));
        } else {
          e.x += e.vx;
          if (e.x < e.minX || e.x > e.maxX) e.vx *= -1;
          if (e.isFlying) e.y = e.baseY + Math.sin(g.frame * 0.05 + (e.floatPhase || 0)) * 22;
        }

        if (g.invincibleFrames > 0) continue;
        if (overlap(p, e)) {
          const thresh = e.isFinalBoss ? 55 : e.isBosse ? 38 : 26;
          if (p.vy > 2 && p.y + p.h - e.y < thresh) {
            awardKill(e);
            if (e.isBosse) { e.hp--; p.vy = -11; if (e.hp <= 0) e.dead = true; }
            else { e.dead = true; p.vy = -11; }
          } else {
            loseLife(); if (g.stopped) return; break;
          }
        }
      }
      g.levelEnemies = g.levelEnemies.filter((e) => !e.dead);

      // Boss alive check
      const bossAlive = lev.isBoss && g.levelEnemies.some((e) => e.isBosse);

      // Flag
      if (overlap(p, lev.flag)) {
        if (bossAlive) {
          g.bossBlockFlash = 90; // show warning
        } else if (g.currentLevel < LEVELS.length - 1) {
          loadLevel(g.currentLevel + 1);
        } else {
          g.stopped = true; setFinalScore(calculateScore(g)); setScreen("win"); return;
        }
      }

      if (g.bossAnnounce > 0) g.bossAnnounce--;
      if (g.levelAnnounce > 0) g.levelAnnounce--;

      // ── Draw ──
      ctx.clearRect(0, 0, W, H);
      drawBg(g.frame);
      drawPlatforms(g.cameraX);
      drawCoins(g.cameraX, g.levelCoins);
      drawEnemies(g.cameraX, g.levelEnemies, g.frame);
      drawProjectiles(g.cameraX, g.projectiles);
      drawFlag(g.cameraX, bossAlive);
      drawDoubleJumpFlash(p, g.cameraX, g.doubleJumpFlash);
      drawChar(p, g.frame, g.cameraX, g.invincibleFrames, k.sprint);
      drawHUD(g);

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

      rafRef.current = requestAnimationFrame(loop);
    }

    function onKeyDown(e) {
      const k = keysRef.current;
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
    <main style={{ minHeight: "100vh", background: "#060d1a" }}>
      <SiteHeader />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 16px 80px" }}>
        <p style={{ color: "#ff8500", fontWeight: 800, letterSpacing: "0.14em", fontSize: "0.75rem", textTransform: "uppercase", margin: "0 0 8px" }}>
          Aprende Drokex
        </p>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, margin: "0 0 6px", textAlign: "center" }}>
          Drokex Platform
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 32px", fontSize: "0.9rem", textAlign: "center" }}>
          <kbd style={kbdStyle}>←</kbd> <kbd style={kbdStyle}>→</kbd> moverse &nbsp;·&nbsp;
          <kbd style={kbdStyle}>↑/W</kbd> saltar (doble) &nbsp;·&nbsp;
          <kbd style={kbdStyle}>Z</kbd> correr &nbsp;·&nbsp;
          <kbd style={kbdStyle}>X</kbd> poder (40 monedas)
        </p>
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 0 60px rgba(255,133,0,0.2), 0 0 0 2px rgba(255,133,0,0.3)" }}>
          <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", maxWidth: "100%" }} />

          {screen === "start" && (
            <div style={overlayStyle}>
              <p style={tagStyle}>Drokex Platform</p>
              <h2 style={titleStyle}>¿Listo para jugar?</h2>
              <p style={subStyle}>10 niveles · castillos cada 3 · fantasma final · doble salto · sprint · poder</p>
              {highScores.length > 0 && (
                <div style={scoreListStyle}>
                  <strong>Mejores puntajes</strong>
                  {highScores.map((s, i) => <p key={i}>{i + 1}. {s.name} · {s.score} pts</p>)}
                </div>
              )}
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
              <h2 style={titleStyle}>¡Ganaste!</h2>
              <p style={subStyle}>Derrotaste al Jefe Final con {finalScore} puntos.</p>
              <form onSubmit={saveHighScore} style={scoreFormStyle}>
                <input value={playerName} onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Tu nombre" maxLength={18} style={scoreInputStyle} autoFocus />
                <button type="submit" style={btnStyle}>Guardar puntaje</button>
              </form>
            </div>
          )}
          {screen === "scores" && (
            <div style={overlayStyle}>
              <p style={{ ...tagStyle, color: "#84cc16" }}>Ranking</p>
              <h2 style={titleStyle}>Top 3 Drokex</h2>
              <div style={scoreListStyle}>
                {highScores.map((s, i) => <p key={i}>{i + 1}. {s.name} · {s.score} pts</p>)}
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

const kbdStyle = { background: "#1a2a1a", color: "#ff8500", padding: "2px 8px", borderRadius: 6, border: "1px solid #ff8500" };
const overlayStyle = { position: "absolute", inset: 0, background: "rgba(6,13,26,0.88)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 };
const tagStyle = { color: "#ff8500", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px" };
const titleStyle = { color: "#fff", fontSize: "2rem", fontWeight: 800, margin: "0 0 8px" };
const subStyle = { color: "rgba(255,255,255,0.6)", margin: "0 0 28px", fontSize: "0.95rem", textAlign: "center" };
const scoreListStyle = { minWidth: 260, margin: "0 0 24px", padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: "0.95rem", lineHeight: 1.7, textAlign: "left" };
const scoreFormStyle = { display: "flex", flexDirection: "column", gap: 14, width: "min(320px, 100%)" };
const scoreInputStyle = { width: "100%", border: "1px solid rgba(255,255,255,0.24)", borderRadius: 12, background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 16px", fontSize: "1rem", outline: "none" };
const btnStyle = { background: "#ff8500", color: "#fff", border: "none", borderRadius: 12, padding: "14px 40px", fontSize: "1rem", fontWeight: 800, cursor: "pointer", letterSpacing: "0.05em" };
const mobileBtnStyle = { width: 60, height: 52, border: "none", borderRadius: 14, background: "#ff8500", fontSize: 20, fontWeight: "bold", cursor: "pointer", color: "#fff", touchAction: "none" };
