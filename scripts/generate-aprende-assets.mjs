import sharp from "sharp";

const out = "public";

function svg(width, height, body, defs = "", crisp = false) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"${crisp ? ' shape-rendering="crispEdges"' : ""}>
      <defs>${defs}</defs>
      ${body}
    </svg>
  `);
}

async function writePng(name, width, height, body, defs = "", crisp = false) {
  await sharp(svg(width, height, body, defs, crisp)).png().toFile(`${out}/${name}`);
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

function px(x, y, w, h, fill, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity}"/>`;
}

function pixelEnemyCell(x, y, type) {
  const r = (rx, ry, rw, rh, fill, opacity = 1) => px(rx, ry, rw, rh, fill, opacity);
  const p = (points, fill, opacity = 1) => `<polygon points="${points}" fill="${fill}" opacity="${opacity}"/>`;
  const body = {
    jaguar: `
      ${r(8,88,76,8,"#090909",0.28)}
      ${r(14,58,58,22,"#d89105")}${r(24,48,28,16,"#f0aa0a")}${r(10,50,18,12,"#f6b310")}
      ${r(50,52,18,12,"#f6b310")}${r(66,60,14,8,"#c97505")}${r(78,64,18,6,"#d89105")}
      ${r(18,78,10,18,"#a75b02")}${r(54,78,10,18,"#a75b02")}${r(30,76,10,15,"#f1b018")}${r(68,75,9,16,"#f1b018")}
      ${r(2,62,10,7,"#d89105")}${r(0,54,7,9,"#d89105")}${r(80,58,10,7,"#f0aa0a")}${r(88,54,8,7,"#f0aa0a")}
      ${r(24,42,8,8,"#ffbf1e")}${r(42,40,8,9,"#ffbf1e")}${r(28,51,8,6,"#f7d477")}
      ${r(21,56,5,5,"#111")}${r(43,54,5,5,"#111")}${r(18,70,7,5,"#fff")}${r(25,74,9,4,"#5a2400")}
      ${[18,36,52,62,72].map((sx, i) => r(sx, 61 + (i % 2) * 9, 6, 5, "#1d1004")).join("")}
      ${[28,44,57].map((sx, i) => r(sx, 51 + (i % 2) * 12, 5, 4, "#1d1004")).join("")}
    `,
    toucan: `
      ${r(28,90,58,8,"#090909",0.24)}
      ${r(42,42,30,46,"#101010")}${r(34,58,12,30,"#2d2d2d")}${r(56,58,14,28,"#2d2d2d")}
      ${r(46,36,22,18,"#101010")}${r(48,52,18,28,"#f6f1d8")}
      ${r(62,34,46,18,"#ffbd13")}${r(94,42,18,10,"#ffcf27")}${r(66,55,42,9,"#f05b16")}
      ${r(60,43,7,9,"#f9f9ff")}${r(63,45,3,5,"#101010")}${r(56,71,10,9,"#315f8b")}${r(70,72,10,8,"#315f8b")}
      ${r(40,84,9,10,"#5a2a05")}${r(70,84,9,10,"#5a2a05")}
      ${r(72,31,14,5,"#fff",0.65)}
    `,
    cactus: `
      ${r(36,92,56,8,"#c98b2f")}${r(51,20,25,72,"#78b916")}${r(42,32,10,50,"#5f9f10")}${r(66,26,10,60,"#97d51f")}
      ${r(24,48,20,12,"#79bd16")}${r(24,38,11,30,"#79bd16")}${r(76,48,22,12,"#79bd16")}${r(88,36,11,33,"#79bd16")}
      ${r(54,24,5,63,"#b6ee34",0.42)}${r(69,28,4,54,"#4d8d0e",0.48)}
      ${r(58,46,5,5,"#111")}${r(69,46,5,5,"#111")}${r(60,59,14,4,"#2f5f08")}
      ${r(56,9,7,12,"#ff657f")}${r(62,4,8,17,"#ff4d71")}${r(70,10,7,11,"#ff6d87")}
      ${r(28,30,7,8,"#ff6d87")}${r(86,28,7,8,"#ff6d87")}
      ${[34,46,81,94].map((sx) => r(sx, 56, 5, 2, "#e9ffd1")).join("")}
    `,
    eagle: `
      ${r(31,88,62,8,"#090909",0.25)}
      ${p("22,54 76,28 76,48 30,70", "#8b4c12")}${p("56,32 102,8 94,36 64,60", "#a96219")}
      ${r(48,55,28,25,"#8a4a13")}${r(36,75,11,13,"#f5b300")}${r(68,76,11,13,"#f5b300")}
      ${r(42,42,24,20,"#fff")}${r(58,39,18,16,"#f7f7f7")}${r(69,47,17,7,"#f5ad00")}${r(80,50,9,6,"#e69000")}
      ${r(58,47,6,6,"#111")}${r(54,44,5,5,"#fff")}
      ${r(92,26,10,8,"#c7802a")}${r(82,35,10,8,"#c7802a")}${r(72,44,10,8,"#c7802a")}
      ${r(35,83,8,6,"#ffe199")}${r(77,84,8,6,"#ffe199")}
    `,
    goldenIdol: `
      ${r(24,92,80,8,"#090909",0.23)}
      ${r(42,32,44,54,"#d6a21a")}${r(35,45,58,11,"#f4c22d")}${r(38,80,52,12,"#9b5a08")}
      ${r(48,20,32,17,"#f8cf37")}${r(42,26,8,16,"#c4870d")}${r(78,26,8,16,"#c4870d")}
      ${r(52,43,8,9,"#101010")}${r(68,43,8,9,"#101010")}${r(55,61,18,6,"#7a3b05")}
      ${r(44,59,7,15,"#8b4a07")}${r(78,59,7,15,"#8b4a07")}${r(32,54,8,26,"#b8750b")}${r(88,54,8,26,"#b8750b")}
      ${r(54,72,20,8,"#f8cf37")}${r(59,12,10,10,"#7cff2f")}${r(57,8,14,6,"#d6ff6f")}
    `,
    pyramidMexico: `
      ${r(16,92,96,8,"#090909",0.22)}
      ${r(28,78,72,14,"#b17b33")}${r(36,64,56,14,"#c8913d")}${r(44,50,40,14,"#dba24b")}${r(52,36,24,14,"#e2b45c")}
      ${r(59,67,12,25,"#3a1d08")}${r(32,76,16,4,"#8a561f")}${r(80,76,16,4,"#8a561f")}
      ${r(40,62,12,4,"#9b6629")}${r(76,62,12,4,"#9b6629")}${r(50,48,10,4,"#a96f2e")}
      ${r(24,43,10,11,"#0f8a3a")}${r(34,40,8,13,"#ffffff")}${r(42,43,10,11,"#d71920")}
      ${r(70,22,18,8,"#ffe082")}${r(86,25,22,6,"#c77820")}
    `,
    moaiChile: `
      ${r(28,92,72,8,"#090909",0.23)}
      ${r(44,28,38,64,"#858585")}${r(39,40,48,38,"#9d9d9d")}${r(47,22,32,12,"#b2b2b2")}
      ${r(50,44,10,7,"#202020")}${r(68,44,10,7,"#202020")}${r(60,51,8,19,"#5f5f5f")}
      ${r(51,75,25,6,"#3b3b3b")}${r(42,84,44,8,"#6d6d6d")}
      ${r(25,13,20,10,"#0039a6")}${r(45,13,20,10,"#ffffff")}${r(65,13,20,10,"#d52b1e")}${r(30,10,6,22,"#71410c")}
    `,
    incaGate: `
      ${r(22,90,84,8,"#090909",0.22)}
      ${r(20,70,88,18,"#8c6b35")}${r(28,56,72,14,"#a77a3a")}${r(36,42,56,14,"#bc8d46")}${r(48,28,32,14,"#d2a85b")}
      ${r(55,62,18,30,"#2c1608")}${r(28,71,14,7,"#6d4f26")}${r(86,71,14,7,"#6d4f26")}
      ${r(43,49,9,6,"#704f1e")}${r(76,49,9,6,"#704f1e")}${r(60,35,8,6,"#704f1e")}
      ${r(31,15,8,27,"#7a4b0a")}${r(39,17,22,10,"#d71920")}${r(61,17,18,10,"#fff")}
    `,
    chili: `
      ${r(24,91,58,8,"#090909",0.24)}
      ${p("22,60 38,42 76,41 86,54 76,72 48,82 27,76", "#e20d07")}
      ${p("18,69 30,78 50,84 68,79 52,93 27,88 11,77", "#ff160e")}
      ${r(58,31,13,18,"#7bd31d")}${r(66,23,10,16,"#91db27")}${r(71,18,8,18,"#73b416")}
      ${r(39,50,8,13,"#ff5a33")}${r(31,57,7,9,"#ffd1c7",0.65)}
      ${r(48,56,6,6,"#fff")}${r(63,55,6,6,"#fff")}${r(51,58,3,4,"#111")}${r(65,57,3,4,"#111")}
      ${r(52,71,15,4,"#8f0502")}
    `,
    condor: `
      ${r(28,91,58,8,"#090909",0.24)}
      ${p("20,58 56,43 54,61 19,76", "#101010")}${p("63,45 103,55 100,73 60,62", "#101010")}
      ${r(45,55,28,32,"#171717")}${r(36,76,12,10,"#f3bb12")}${r(68,77,12,10,"#f3bb12")}
      ${r(36,42,30,14,"#f7f1df")}${r(45,31,18,16,"#d84a52")}${r(60,39,16,7,"#f1dfc8")}
      ${r(61,43,14,6,"#efefef")}${r(71,45,11,5,"#d0d0d0")}
      ${r(57,37,5,5,"#111")}${r(37,68,10,6,"#dedede")}${r(83,67,11,6,"#dedede")}
    `,
    llama: `
      ${r(34,92,58,8,"#090909",0.22)}
      ${r(38,55,44,27,"#ead49b")}${r(62,41,16,37,"#f4dfaa")}${r(69,32,19,17,"#f4dfaa")}
      ${r(68,20,6,15,"#d6b77a")}${r(82,19,6,15,"#d6b77a")}${r(71,23,3,8,"#ffb6a3")}${r(84,22,3,8,"#ffb6a3")}
      ${r(43,80,7,18,"#bf8842")}${r(57,81,7,17,"#bf8842")}${r(73,80,7,18,"#bf8842")}${r(21,64,18,7,"#ead49b")}
      ${r(60,56,25,17,"#b36a07")}${r(64,59,17,11,"#d58a10")}${r(70,58,5,11,"#7a3e04")}
      ${r(74,38,5,5,"#111")}${r(68,47,10,4,"#6b3a0b")}
    `,
    condorAndino: `
      ${r(28,91,58,8,"#090909",0.24)}
      ${p("18,57 54,44 53,61 20,77", "#111")}${p("62,44 102,54 99,72 61,62", "#111")}
      ${r(45,56,28,31,"#151515")}${r(36,77,12,10,"#f2b000")}${r(69,78,12,10,"#f2b000")}
      ${r(37,43,30,14,"#f2ede0")}${r(45,31,18,16,"#e7575e")}${r(42,28,12,8,"#f06d6f")}
      ${r(62,42,16,7,"#f0f0f0")}${r(73,44,11,5,"#ddd")}
      ${r(57,37,5,5,"#111")}${r(37,67,10,6,"#e5e5e5")}${r(84,67,11,6,"#e5e5e5")}
    `,
    castleLima: ``,
    gaucho: `
      ${r(20,92,76,8,"#090909",0.25)}
      ${r(22,68,52,19,"#8a480d")}${r(70,58,19,16,"#9e5d1d")}${r(83,55,10,9,"#f4e0be")}
      ${r(15,62,11,10,"#6c3304")}${r(25,84,8,15,"#4b2302")}${r(55,84,8,15,"#4b2302")}${r(74,75,7,15,"#4b2302")}
      ${r(47,45,14,26,"#f7f4e8")}${r(50,31,14,14,"#f5c172")}${r(41,26,32,5,"#202020")}${r(47,16,18,12,"#303030")}
      ${r(47,52,14,6,"#d71920")}${r(43,70,20,9,"#222")}${r(56,67,14,7,"#111")}
      ${r(55,35,3,3,"#111")}${r(63,35,3,3,"#111")}${r(86,60,4,4,"#111")}
    `,
    obeliskArgentina: `
      ${r(18,90,90,8,"#090909",0.22)}
      ${r(54,28,20,64,"#d8d8d8")}${r(50,84,28,8,"#b9b9b9")}${r(47,92,34,5,"#909090")}
      ${r(58,18,12,10,"#f0f0f0")}${p("58,18 64,6 70,18", "#ffffff")}
      ${r(58,40,4,42,"#efefef",0.58)}${r(70,38,4,44,"#9c9c9c",0.45)}
      ${r(30,26,7,32,"#7c5a2d")}${r(37,29,16,8,"#74c7ff")}${r(53,29,14,8,"#fff")}${r(67,29,16,8,"#74c7ff")}${r(58,30,5,5,"#ffcf35")}
      ${r(36,67,12,7,"#74c7ff")}${r(80,67,12,7,"#74c7ff")}
    `,
    hornero: `
      ${r(34,91,54,8,"#090909",0.23)}
      ${r(39,56,40,24,"#985217")}${r(31,60,16,12,"#6f3510")}${r(70,52,22,13,"#bd7835")}
      ${r(51,43,22,16,"#8f4714")}${r(69,49,15,6,"#d69b45")}${r(81,50,9,4,"#7b3a10")}
      ${r(45,72,8,17,"#5a2708")}${r(68,72,8,17,"#5a2708")}${r(58,63,20,13,"#c48642")}
      ${r(64,48,5,5,"#111")}${r(36,51,10,6,"#6f3510")}${r(30,47,9,7,"#6f3510")}
    `,
  }[type] || "";

  return `<g transform="translate(${x} ${y})">${body}</g>`;
}

async function sheets() {
  await writePng("aprende-enemies.png", 1920, 128, `
    ${pixelEnemyCell(0, 0, "jaguar")}
    ${pixelEnemyCell(128, 0, "toucan")}
    ${pixelEnemyCell(256, 0, "cactus")}
    ${pixelEnemyCell(384, 0, "eagle")}
    ${pixelEnemyCell(512, 0, "goldenIdol")}
    ${pixelEnemyCell(640, 0, "chili")}
    ${pixelEnemyCell(768, 0, "condor")}
    ${pixelEnemyCell(896, 0, "llama")}
    ${pixelEnemyCell(1024, 0, "condorAndino")}
    ${pixelEnemyCell(1152, 0, "incaGate")}
    ${pixelEnemyCell(1280, 0, "gaucho")}
    ${pixelEnemyCell(1408, 0, "obeliskArgentina")}
    ${pixelEnemyCell(1536, 0, "hornero")}
    ${pixelEnemyCell(1664, 0, "pyramidMexico")}
    ${pixelEnemyCell(1792, 0, "moaiChile")}
  `, "", true);

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
