import sharp from "sharp";

const out = "public";

function svg(width, height, body, defs = "") {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs}</defs>
      ${body}
    </svg>
  `);
}

async function writePng(name, width, height, body, defs = "") {
  await sharp(svg(width, height, body, defs)).png().toFile(`${out}/${name}`);
}

function stars(color = "#fff", count = 95) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const x = (i * 137) % 1280;
    const y = 18 + ((i * 79) % 360);
    const r = 0.9 + (i % 4) * 0.35;
    const opacity = 0.28 + (i % 5) * 0.12;
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
  }
  return s;
}

function skyline(color, glow, offset = 0) {
  let s = "";
  for (let i = 0; i < 18; i++) {
    const x = i * 78 - offset;
    const w = 42 + (i % 4) * 15;
    const h = 150 + ((i * 53) % 150);
    const y = 720 - h;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="${0.72 - (i % 3) * 0.08}"/>`;
    for (let wy = y + 24; wy < 690; wy += 30) {
      for (let wx = x + 9; wx < x + w - 8; wx += 17) {
        if (((wx + wy + i) % 5) < 2) s += `<rect x="${wx}" y="${wy}" width="7" height="12" fill="${glow}" opacity="0.42"/>`;
      }
    }
  }
  return s;
}

async function backgrounds() {
  await writePng("aprende-bg-city.png", 1280, 720, `
    <rect width="1280" height="720" fill="url(#sky)"/>
    <circle cx="1000" cy="108" r="74" fill="#ff9b21" opacity="0.11"/>
    <circle cx="1000" cy="108" r="112" fill="#ff9b21" opacity="0.05"/>
    ${stars("#ffffff", 120)}
    ${skyline("#07152a", "#ff9b21", 20)}
    ${skyline("#030914", "#ff7a00", -24)}
    <rect y="606" width="1280" height="114" fill="url(#floor)"/>
    <path d="M0 560 C210 530 320 595 490 562 C690 520 800 598 1000 558 C1120 532 1210 552 1280 540 L1280 720 L0 720 Z" fill="#020712" opacity="0.72"/>
  `, `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#050b17"/><stop offset="0.52" stop-color="#08182d"/><stop offset="1" stop-color="#03101f"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#12213a" stop-opacity="0"/><stop offset="1" stop-color="#01050b"/>
    </linearGradient>
  `);

  await writePng("aprende-bg-volcano.png", 1280, 720, `
    <rect width="1280" height="720" fill="url(#sky)"/>
    ${stars("#ffb070", 80)}
    <path d="M0 615 L190 310 L285 615 Z" fill="#170501"/>
    <path d="M118 424 L188 310 L248 424 Z" fill="#ff4d00" opacity="0.22"/>
    <path d="M330 620 L620 235 L905 620 Z" fill="#210800"/>
    <path d="M520 362 L620 235 L728 362 Z" fill="#ff3c00" opacity="0.28"/>
    <path d="M830 620 L1110 278 L1280 620 Z" fill="#160402"/>
    <path d="M1018 390 L1110 278 L1190 390 Z" fill="#ff6a00" opacity="0.22"/>
    <path d="M0 602 C130 574 230 640 360 602 C540 548 700 652 870 596 C1030 548 1150 620 1280 584 L1280 720 L0 720 Z" fill="#170201"/>
    <path d="M0 646 C190 620 280 686 460 644 C610 610 740 680 900 640 C1060 596 1165 656 1280 626 L1280 720 L0 720 Z" fill="url(#lava)"/>
    <g opacity="0.5">
      <path d="M120 640 L210 684 L330 650" stroke="#ff6a00" stroke-width="3" fill="none"/>
      <path d="M590 626 L682 674 L760 640" stroke="#ff9a00" stroke-width="3" fill="none"/>
      <path d="M990 612 L1075 676 L1210 630" stroke="#ff6a00" stroke-width="3" fill="none"/>
    </g>
  `, `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#170000"/><stop offset="0.58" stop-color="#330800"/><stop offset="1" stop-color="#160200"/>
    </linearGradient>
    <linearGradient id="lava" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#ff6a00" stop-opacity="0.65"/><stop offset="0.42" stop-color="#441000"/><stop offset="1" stop-color="#080000"/>
    </linearGradient>
  `);

  await writePng("aprende-bg-forest.png", 1280, 720, `
    <rect width="1280" height="720" fill="url(#sky)"/>
    <circle cx="990" cy="98" r="72" fill="#5dff7a" opacity="0.17"/>
    <circle cx="990" cy="98" r="120" fill="#5dff7a" opacity="0.06"/>
    ${stars("#9dffb7", 80)}
    ${Array.from({ length: 22 }, (_, i) => {
      const x = i * 62 - 16;
      const h = 300 + (i % 5) * 46;
      const y = 720 - h;
      return `<path d="M${x + 22} 720 L${x + 28} ${y} Q${x - 18} ${y + 62} ${x + 8} ${y + 122} Q${x + 74} ${y + 60} ${x + 52} ${y + 168} L${x + 58} 720 Z" fill="#010d05" opacity="${0.8 - (i % 3) * 0.08}"/>`;
    }).join("")}
    <path d="M0 612 C170 565 310 650 490 605 C650 566 780 654 970 600 C1110 560 1210 615 1280 592 L1280 720 L0 720 Z" fill="#001208"/>
    <g opacity="0.17">
      <circle cx="190" cy="430" r="95" fill="#00ff66"/>
      <circle cx="730" cy="455" r="135" fill="#00ff66"/>
      <circle cx="1090" cy="415" r="100" fill="#00ff66"/>
    </g>
  `, `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#000904"/><stop offset="0.55" stop-color="#001b0a"/><stop offset="1" stop-color="#000a04"/>
    </linearGradient>
  `);

  await writePng("aprende-bg-ghost.png", 1280, 720, `
    <rect width="1280" height="720" fill="url(#sky)"/>
    ${stars("#bdeaff", 120)}
    <circle cx="1050" cy="128" r="84" fill="#84d8ff" opacity="0.13"/>
    <circle cx="1050" cy="128" r="132" fill="#84d8ff" opacity="0.05"/>
    ${Array.from({ length: 15 }, (_, i) => {
      const x = i * 95 - 30;
      const y = 300 + (i % 4) * 36;
      return `<path d="M${x} 720 L${x + 26} ${y} Q${x + 48} ${y - 38} ${x + 72} ${y} L${x + 110} 720 Z" fill="#04091f" opacity="${0.52 - (i % 3) * 0.08}"/>`;
    }).join("")}
    <g opacity="0.18">
      <path d="M180 210 C240 150 320 240 380 180 C450 108 520 210 600 155" stroke="#84d8ff" stroke-width="2" fill="none"/>
      <path d="M720 250 C780 190 860 275 920 210 C1000 130 1080 245 1160 170" stroke="#84d8ff" stroke-width="2" fill="none"/>
    </g>
    <path d="M0 610 C160 575 320 650 480 612 C680 562 820 650 1000 606 C1160 570 1225 610 1280 594 L1280 720 L0 720 Z" fill="#020416"/>
  `, `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#00000c"/><stop offset="0.54" stop-color="#06001c"/><stop offset="1" stop-color="#010413"/>
    </linearGradient>
  `);
}

function enemyCell(x, y, type) {
  if (type === "grunt") return `
    <g transform="translate(${x} ${y})">
      <ellipse cx="64" cy="104" rx="36" ry="10" fill="#000" opacity=".25"/>
      <rect x="32" y="36" width="64" height="62" rx="12" fill="#d90013"/>
      <rect x="24" y="48" width="16" height="24" rx="7" fill="#97000b"/>
      <rect x="88" y="48" width="16" height="24" rx="7" fill="#97000b"/>
      <rect x="43" y="52" width="14" height="12" fill="#fff06a"/><rect x="71" y="52" width="14" height="12" fill="#fff06a"/>
      <rect x="48" y="56" width="5" height="5" fill="#130000"/><rect x="76" y="56" width="5" height="5" fill="#130000"/>
      <rect x="45" y="80" width="38" height="7" fill="#fff"/>
    </g>`;
  if (type === "bat") return `
    <g transform="translate(${x} ${y})">
      <path d="M31 62 L4 44 L12 78 Z" fill="#002d88"/>
      <path d="M97 62 L124 44 L116 78 Z" fill="#002d88"/>
      <rect x="34" y="40" width="60" height="46" rx="14" fill="#0062d8"/>
      <rect x="46" y="52" width="13" height="13" fill="#00ffee"/><rect x="69" y="52" width="13" height="13" fill="#00ffee"/>
      <rect x="50" y="56" width="5" height="5" fill="#fff"/><rect x="73" y="56" width="5" height="5" fill="#fff"/>
      <path d="M50 84 L56 100 L62 84 ZM70 84 L76 100 L82 84 Z" fill="#fff"/>
    </g>`;
  if (type === "golem") return `
    <g transform="translate(${x} ${y})">
      <ellipse cx="64" cy="104" rx="38" ry="10" fill="#000" opacity=".3"/>
      <rect x="30" y="28" width="68" height="74" rx="10" fill="#2b2b2b"/>
      <path d="M44 32 L52 70 L43 86M80 36 L70 72 L86 96M62 40 L70 98" stroke="#ff6a00" stroke-width="5" fill="none"/>
      <rect x="43" y="50" width="14" height="11" fill="#ff9a00"/><rect x="72" y="50" width="14" height="11" fill="#ff9a00"/>
      <rect x="48" y="53" width="6" height="4" fill="#fff36a"/><rect x="77" y="53" width="6" height="4" fill="#fff36a"/>
    </g>`;
  if (type === "knight") return `
    <g transform="translate(${x} ${y})">
      <ellipse cx="64" cy="104" rx="34" ry="9" fill="#000" opacity=".32"/>
      <rect x="31" y="29" width="66" height="73" rx="8" fill="#101010"/>
      <path d="M30 30 L18 52 L34 50 ZM98 30 L110 52 L94 50 Z" fill="#383838"/>
      <rect x="40" y="49" width="48" height="13" fill="#000"/>
      <rect x="45" y="53" width="14" height="5" fill="#00ff66"/><rect x="69" y="53" width="14" height="5" fill="#00ff66"/>
      <path d="M42 74 H86 L78 92 H50 Z" fill="#1b1b1b"/>
    </g>`;
  if (type === "boss") return `
    <g transform="translate(${x} ${y})">
      <ellipse cx="64" cy="108" rx="45" ry="10" fill="#000" opacity=".28"/>
      <rect x="22" y="30" width="84" height="76" rx="12" fill="#4b0082"/>
      <rect x="30" y="10" width="17" height="28" fill="#7700cc"/><rect x="81" y="10" width="17" height="28" fill="#7700cc"/>
      <rect x="38" y="52" width="19" height="16" fill="#ff1b1b"/><rect x="72" y="52" width="19" height="16" fill="#ff1b1b"/>
      <rect x="43" y="56" width="8" height="7" fill="#fff"/><rect x="77" y="56" width="8" height="7" fill="#fff"/>
      <rect x="38" y="83" width="52" height="12" fill="#17001f"/>
      <rect x="43" y="83" width="8" height="8" fill="#fff"/><rect x="59" y="83" width="8" height="8" fill="#fff"/><rect x="75" y="83" width="8" height="8" fill="#fff"/>
    </g>`;
  return `
    <g transform="translate(${x} ${y})">
      <ellipse cx="64" cy="106" rx="42" ry="10" fill="#000" opacity=".2"/>
      <path d="M23 88 Q24 26 64 24 Q104 26 105 88 Q94 76 84 88 Q74 100 64 88 Q54 76 44 88 Q34 100 23 88 Z" fill="#d8f4ff" opacity=".92"/>
      <rect x="45" y="51" width="14" height="18" rx="7" fill="#00ccff"/><rect x="70" y="51" width="14" height="18" rx="7" fill="#00ccff"/>
      <rect x="50" y="57" width="5" height="7" fill="#001830"/><rect x="75" y="57" width="5" height="7" fill="#001830"/>
    </g>`;
}

async function sheets() {
  await writePng("aprende-enemies.png", 768, 128, `
    ${enemyCell(0, 0, "grunt")}
    ${enemyCell(128, 0, "bat")}
    ${enemyCell(256, 0, "golem")}
    ${enemyCell(384, 0, "knight")}
    ${enemyCell(512, 0, "boss")}
    ${enemyCell(640, 0, "ghost")}
  `);

  let explosions = "";
  for (let i = 0; i < 6; i++) {
    const x = i * 128;
    const r = 14 + i * 9;
    explosions += `
      <g transform="translate(${x} 0)">
        <circle cx="64" cy="64" r="${r + 16}" fill="#ff8500" opacity="${0.08 + i * 0.025}"/>
        <circle cx="64" cy="64" r="${r}" fill="#ffcf5a" opacity="${0.8 - i * 0.08}"/>
        <circle cx="58" cy="58" r="${Math.max(5, r * 0.38)}" fill="#fff" opacity="${0.9 - i * 0.09}"/>
        ${Array.from({ length: 10 }, (_, p) => {
          const a = (Math.PI * 2 * p) / 10 + i * 0.35;
          const x1 = 64 + Math.cos(a) * (r * 0.8);
          const y1 = 64 + Math.sin(a) * (r * 0.8);
          const x2 = 64 + Math.cos(a) * (r * 1.6);
          const y2 = 64 + Math.sin(a) * (r * 1.6);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ff6a00" stroke-width="${Math.max(2, 7 - i)}" stroke-linecap="round" opacity="${0.7 - i * 0.08}"/>`;
        }).join("")}
      </g>`;
  }
  await writePng("aprende-explosions.png", 768, 128, explosions);
}

await backgrounds();
await sheets();
