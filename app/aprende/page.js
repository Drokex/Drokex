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
const POWER_COST = 10;
const POWER_COOLDOWN = 45;

function buildLevel(index) {
  const difficulty = index + 1;
  const isBoss = difficulty % 3 === 0; // Levels 3, 6, 9
  const width = 1700 + index * 230;
  const platforms = [];
  const groundSegments = Math.min(2 + Math.floor(index / 2), 7);
  const gap = 45 + index * 8;
  const minGroundWidth = 320;
  const totalGapWidth = gap * (groundSegments - 1);
  const segmentWidth = Math.max(
    minGroundWidth,
    Math.floor((width - totalGapWidth) / groundSegments),
  );
  let x = 0;

  for (let i = 0; i < groundSegments; i++) {
    const isLast = i === groundSegments - 1;
    const remainingWidth = width - x;
    platforms.push({ x, y: 480, w: isLast ? remainingWidth : segmentWidth, h: 60 });
    x += segmentWidth + gap;
  }

  const floatingCount = 4 + Math.floor(index * 0.8);
  for (let i = 0; i < floatingCount; i++) {
    const px = 280 + i * Math.max(230, Math.floor((width - 620) / Math.max(1, floatingCount - 1)));
    const yPattern = [380, 330, 365, 310, 350];
    const py = yPattern[(i + index) % yPattern.length] - Math.min(index * 3, 22);
    platforms.push({
      x: Math.min(px, width - 330),
      y: Math.max(270, py),
      w: Math.max(130, 190 - index * 5),
      h: 28,
    });
  }

  const coins = [];
  const coinCount = 5 + index;
  for (let i = 0; i < coinCount; i++) {
    const basePlatform = platforms[3 + (i % floatingCount)] || platforms[i % platforms.length];
    coins.push({
      x: Math.min(basePlatform.x + basePlatform.w / 2, width - 160),
      y: basePlatform.y - 40,
    });
  }
  coins.push({ x: width - 210, y: 430 });

  const enemies = [];
  const enemyCount = Math.min(2 + Math.floor(index / 2), 6);
  for (let i = 0; i < enemyCount; i++) {
    const ground = platforms[i % groundSegments];
    const minX = ground.x + 45;
    const maxX = Math.max(minX + 120, ground.x + ground.w - 80);
    enemies.push({
      x: minX + 25,
      y: 440,
      w: 42,
      h: 40,
      minX,
      maxX,
      vx: 2 + index * 0.32 + i * 0.18,
    });
  }

  if (isBoss) {
    const midX = Math.floor(width * 0.55);
    enemies.push({
      x: midX,
      y: 415,
      w: 72,
      h: 65,
      minX: midX - 200,
      maxX: midX + 200,
      vx: 1.6 + index * 0.12,
      hp: 3,
      isBosse: true,
    });
  }

  return {
    name: isBoss ? `Castillo ${Math.ceil(difficulty / 3)}` : `Nivel ${difficulty}`,
    isBoss,
    width,
    platforms,
    coins,
    enemies,
    flag: { x: width - 150, y: 380, w: 44, h: 100 },
  };
}

const LEVELS = Array.from({ length: TOTAL_LEVELS }, (_, index) => buildLevel(index));

function newState() {
  return {
    stopped: false,
    currentLevel: 0,
    coins: 0,
    lives: 3,
    cameraX: 0,
    frame: 0,
    projectiles: [],
    powerCooldown: 0,
    bossAnnounce: 0,
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
  const keysRef = useRef({ left: false, right: false, jump: false, power: false });
  const rafRef = useRef(null);

  const [screen, setScreen] = useState("start");
  const [hudCoins, setHudCoins] = useState(0);
  const [hudLevel, setHudLevel] = useState("Nivel 1");
  const [hudLives, setHudLives] = useState(3);
  const [finalScore, setFinalScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    try {
      const savedScores = JSON.parse(window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY) || "[]");
      setHighScores(Array.isArray(savedScores) ? savedScores.slice(0, 3) : []);
    } catch {
      setHighScores([]);
    }
  }, []);

  function calculateScore(game) {
    const levelBonus = (game.currentLevel + 1) * 100;
    return game.coins * 25 + game.lives * 150 + levelBonus;
  }

  function startGame() {
    gRef.current = newState();
    setHudCoins(0);
    setHudLevel("Nivel 1");
    setHudLives(3);
    setFinalScore(0);
    setPlayerName("");
    setScreen("playing");
  }

  function saveHighScore(e) {
    e.preventDefault();
    const name = playerName.trim() || "Jugador";
    const nextScores = [...highScores, { name, score: finalScore }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, JSON.stringify(nextScores));
    setHighScores(nextScores);
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
      g.projectiles = [];
      g.powerCooldown = 0;
      g.bossAnnounce = LEVELS[idx].isBoss ? 180 : 0;
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
        g.projectiles = [];
        Object.assign(g.player, { x: 80, y: 200, vx: 0, vy: 0, grounded: false });
        g.cameraX = 0;
      }
    }

    // ─── Draw helpers ──────────────────────────────────────────────
    function drawBg(frame) {
      const isBoss = LEVELS[gRef.current.currentLevel].isBoss;
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      if (isBoss) {
        grad.addColorStop(0, "#120020");
        grad.addColorStop(1, "#200040");
      } else {
        grad.addColorStop(0, "#060d1a");
        grad.addColorStop(1, "#0d1f35");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const stars = [
        [50,30],[120,80],[200,20],[320,60],[450,30],[600,70],[720,25],
        [760,90],[80,110],[400,100],[550,50],[850,40],[900,100],
        [150,150],[700,140],[350,170],[480,60],[230,130],
      ];
      for (const [sx, sy] of stars) {
        ctx.globalAlpha = 0.3 + 0.4 * Math.sin(frame * 0.05 + sx);
        ctx.fillStyle = isBoss ? "#ff88ff" : "#fff";
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.globalAlpha = 1;

      if (isBoss) {
        const castles = [
          [0, 180, 80], [90, 150, 55], [160, 170, 70], [280, 140, 90],
          [410, 160, 60], [500, 130, 80], [620, 155, 65], [720, 145, 75],
          [830, 165, 70], [920, 140, 60],
        ];
        for (const [cx, cy, cw] of castles) {
          ctx.fillStyle = "#1a0028";
          ctx.fillRect(cx, cy, cw, H - cy);
          ctx.fillStyle = "#120020";
          for (let bx = cx; bx < cx + cw - 8; bx += 16) {
            ctx.fillRect(bx, cy - 14, 9, 14);
          }
          ctx.fillStyle = "rgba(200,0,255,0.2)";
          for (let wy = cy + 20; wy < cy + 100; wy += 22) {
            for (let wx = cx + 8; wx < cx + cw - 8; wx += 16) {
              if (Math.sin(wx * 3 + wy * 5) > 0.3) ctx.fillRect(wx, wy, 8, 11);
            }
          }
        }
      } else {
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
        if (e.isBosse) {
          // Castle boss
          ctx.fillStyle = "#4a0080";
          ctx.fillRect(e.x, e.y, e.w, e.h);
          // Horns
          ctx.fillStyle = "#6600aa";
          ctx.fillRect(e.x + 6, e.y - 16, 12, 16);
          ctx.fillRect(e.x + e.w - 18, e.y - 16, 12, 16);
          ctx.fillStyle = "#ff00ff";
          ctx.fillRect(e.x + 9, e.y - 20, 6, 6);
          ctx.fillRect(e.x + e.w - 15, e.y - 20, 6, 6);
          // Eyes
          ctx.fillStyle = "#ff0000";
          ctx.fillRect(e.x + 10, e.y + 12, 16, 14);
          ctx.fillRect(e.x + e.w - 26, e.y + 12, 16, 14);
          ctx.fillStyle = "#ff8888";
          ctx.fillRect(e.x + 14, e.y + 15, 8, 8);
          ctx.fillRect(e.x + e.w - 22, e.y + 15, 8, 8);
          ctx.fillStyle = "#000";
          ctx.fillRect(e.x + 17, e.y + 17, 4, 4);
          ctx.fillRect(e.x + e.w - 21, e.y + 17, 4, 4);
          // Mouth
          ctx.fillStyle = "#1a0030";
          ctx.fillRect(e.x + 12, e.y + e.h - 18, e.w - 24, 10);
          ctx.fillStyle = "#ddd";
          for (let tx = e.x + 14; tx < e.x + e.w - 18; tx += 12) {
            ctx.fillRect(tx, e.y + e.h - 18, 8, 6);
          }
          // HP bar
          ctx.fillStyle = "rgba(0,0,0,0.7)";
          ctx.fillRect(e.x - 2, e.y - 32, e.w + 4, 10);
          const hpRatio = (e.hp || 0) / 3;
          ctx.fillStyle = hpRatio > 0.6 ? "#00ff44" : hpRatio > 0.3 ? "#ffaa00" : "#ff2200";
          ctx.fillRect(e.x - 2, e.y - 32, (e.w + 4) * hpRatio, 10);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1;
          ctx.strokeRect(e.x - 2, e.y - 32, e.w + 4, 10);
          ctx.fillStyle = "#ff00ff";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText("JEFE", e.x + e.w / 2, e.y - 36);
        } else {
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
      }
      ctx.restore();
    }

    function drawProjectiles(camX, projectiles) {
      if (!projectiles.length) return;
      ctx.save();
      ctx.translate(-camX, 0);
      for (const proj of projectiles) {
        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#ff8500";
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(proj.x - 2, proj.y - 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "#ff8500";
        ctx.beginPath();
        ctx.arc(proj.x - proj.vx * 0.5, proj.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(proj.x - proj.vx, proj.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
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
      ctx.fillText(`● ${g.coins}   PTS ${calculateScore(g)}`, 350, 28);
      // Power charge indicator
      if (g.coins >= POWER_COST) {
        ctx.fillStyle = g.powerCooldown > 0 ? "#888888" : "#00ff88";
        ctx.fillText(g.powerCooldown > 0 ? "** ESPERA **" : "** PODER [X] **", 650, 28);
      } else {
        ctx.fillStyle = "rgba(255,200,0,0.5)";
        ctx.fillText(`poder: ${g.coins}/${POWER_COST}`, 640, 28);
      }
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

      // Power firing
      if (k.power) {
        k.power = false;
        if (g.coins >= POWER_COST && g.powerCooldown <= 0) {
          g.coins -= POWER_COST;
          setHudCoins(g.coins);
          g.powerCooldown = POWER_COOLDOWN;
          g.projectiles.push({
            x: p.x + (p.facing > 0 ? p.w + 4 : -20),
            y: p.y + p.h * 0.4,
            vx: p.facing * 16,
          });
        }
      }
      if (g.powerCooldown > 0) g.powerCooldown--;

      // Move and collide projectiles
      for (const proj of g.projectiles) {
        proj.x += proj.vx;
      }
      g.projectiles = g.projectiles.filter((proj) => {
        if (proj.x < -60 || proj.x > lev.width + 60) return false;
        for (const e of g.levelEnemies) {
          if (e.dead) continue;
          if (overlap({ x: proj.x - 9, y: proj.y - 9, w: 18, h: 18 }, e)) {
            if (e.isBosse) {
              e.hp--;
              if (e.hp <= 0) e.dead = true;
            } else {
              e.dead = true;
            }
            return false;
          }
        }
        return true;
      });

      // Enemies
      for (const e of g.levelEnemies) {
        if (e.dead) continue;
        e.x += e.vx;
        if (e.x < e.minX || e.x > e.maxX) e.vx *= -1;
        if (overlap(p, e)) {
          const stompThreshold = e.isBosse ? 35 : 25;
          if (p.vy > 2 && p.y + p.h - e.y < stompThreshold) {
            if (e.isBosse) {
              e.hp--;
              p.vy = -10;
              if (e.hp <= 0) e.dead = true;
            } else {
              e.dead = true;
              p.vy = -10;
            }
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
          setFinalScore(calculateScore(g));
          setScreen("win");
          return;
        }
      }

      // Boss announce countdown
      if (g.bossAnnounce > 0) g.bossAnnounce--;

      ctx.clearRect(0, 0, W, H);
      drawBg(g.frame);
      drawPlatforms(g.cameraX);
      drawCoins(g.cameraX, g.levelCoins);
      drawEnemies(g.cameraX, g.levelEnemies);
      drawProjectiles(g.cameraX, g.projectiles);
      drawFlag(g.cameraX);
      drawChar(p, g.frame, g.cameraX);
      drawHUD(g);

      // Boss level announcement overlay
      if (g.bossAnnounce > 0) {
        const alpha = g.bossAnnounce > 30 ? 1 : g.bossAnnounce / 30;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(74,0,128,0.88)";
        ctx.fillRect(W / 2 - 230, H / 2 - 58, 460, 116);
        ctx.strokeStyle = "#ff00ff";
        ctx.lineWidth = 3;
        ctx.strokeRect(W / 2 - 230, H / 2 - 58, 460, 116);
        ctx.fillStyle = "#ff00ff";
        ctx.font = "bold 38px monospace";
        ctx.textAlign = "center";
        ctx.fillText("! JEFE !", W / 2, H / 2 - 8);
        ctx.font = "bold 15px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("CASTILLO — DERROTA AL MONSTRUO", W / 2, H / 2 + 32);
        ctx.globalAlpha = 1;
      }

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
      if (e.key.toLowerCase() === "x") {
        e.preventDefault();
        k.power = true;
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
        <p style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 32px", fontSize: "0.95rem" }}>
          <kbd style={kbdStyle}>←</kbd> <kbd style={kbdStyle}>→</kbd> moverse &nbsp;·&nbsp;{" "}
          <kbd style={kbdStyle}>Espacio</kbd> / <kbd style={kbdStyle}>↑</kbd> saltar &nbsp;·&nbsp;{" "}
          <kbd style={kbdStyle}>X</kbd> poder (10 monedas)
        </p>

        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 0 60px rgba(255,133,0,0.2), 0 0 0 2px rgba(255,133,0,0.3)" }}>
          <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", maxWidth: "100%" }} />

          {screen === "start" && (
            <div style={overlayStyle}>
              <p style={tagStyle}>Drokex Platform</p>
              <h2 style={titleStyle}>¿Listo para jugar?</h2>
              <p style={subStyle}>10 niveles · castillos cada 3 · poder especial con 10 monedas</p>
              {highScores.length > 0 && (
                <div style={scoreListStyle}>
                  <strong>Mejores puntajes</strong>
                  {highScores.map((score, index) => (
                    <p key={`${score.name}-${index}`}>
                      {index + 1}. {score.name} · {score.score} pts
                    </p>
                  ))}
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
              <p style={subStyle}>Terminaste los 10 niveles con {finalScore} puntos.</p>
              <form onSubmit={saveHighScore} style={scoreFormStyle}>
                <input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Tu nombre"
                  maxLength={18}
                  style={scoreInputStyle}
                  autoFocus
                />
                <button type="submit" style={btnStyle}>Guardar puntaje</button>
              </form>
            </div>
          )}

          {screen === "scores" && (
            <div style={overlayStyle}>
              <p style={{ ...tagStyle, color: "#84cc16" }}>Ranking</p>
              <h2 style={titleStyle}>Top 3 Drokex</h2>
              <div style={scoreListStyle}>
                {highScores.map((score, index) => (
                  <p key={`${score.name}-${index}`}>
                    {index + 1}. {score.name} · {score.score} pts
                  </p>
                ))}
              </div>
              <button onClick={startGame} style={btnStyle}>Jugar de nuevo</button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          <button style={mobileBtnStyle} {...mobileHandlers("left")}>←</button>
          <button style={mobileBtnStyle} {...mobileHandlers("jump")}>↑</button>
          <button style={mobileBtnStyle} {...mobileHandlers("right")}>→</button>
          <button style={{ ...mobileBtnStyle, background: "#6600aa", fontSize: 18 }} {...mobilePowerHandler()}>X</button>
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
const scoreListStyle = {
  minWidth: 260,
  margin: "0 0 24px",
  padding: "14px 18px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  textAlign: "left",
};
const scoreFormStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
  width: "min(320px, 100%)",
};
const scoreInputStyle = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.24)",
  borderRadius: 12,
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  padding: "14px 16px",
  fontSize: "1rem",
  outline: "none",
};
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
