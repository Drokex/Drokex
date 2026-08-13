"use client";

const NA = `M 686,81
  C 720,55 790,42 850,38
  L 1000,34 L 1150,36 L 1264,65
  L 1407,131 L 1486,155
  C 1450,165 1410,174 1364,178
  L 1336,186 L 1300,235 L 1286,258
  Q 1295,278 1271,305
  Q 1252,285 1243,268
  L 1186,252 L 1107,248
  L 1079,262 L 1064,278
  Q 1090,290 1107,278
  L 1129,292 L 1114,308
  L 1143,322 L 1164,338
  L 1179,350 L 1186,358 L 1200,362
  L 1193,360 L 1157,352 L 1143,342
  L 1129,330 L 1107,318
  L 1079,302 L 1057,292 L 1043,282
  L 1036,272 L 1021,258
  L 1036,232 L 1050,255 L 1057,278
  L 1043,265 L 1029,248
  L 1021,218 L 993,204 L 993,158
  L 986,149 L 950,131 L 900,103
  L 840,108 L 780,120
  L 750,115 L 720,100 L 700,88
  Z`;

const SA = `M 1200,362
  L 1221,358 L 1264,355
  L 1321,348 L 1386,345
  L 1443,358 L 1500,375
  L 1571,398 L 1607,420
  L 1586,458 L 1550,490
  L 1493,520 L 1450,558
  L 1436,590 L 1421,625
  L 1400,645 L 1371,638
  L 1350,622 L 1343,598
  L 1343,530 L 1329,498
  L 1314,470 L 1300,448
  L 1286,425 L 1271,398
  L 1264,378 L 1264,362
  Z`;

function Pin({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r="18" fill={color} opacity="0.15"/>
      <circle r="8" fill={color} opacity="0.35"/>
      <path
        d="M0,-14 C-7,-14 -12,-9 -12,-3 C-12,6 0,16 0,16 C0,16 12,6 12,-3 C12,-9 7,-14 0,-14 Z"
        fill={color}
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1"
      />
      <circle cx="0" cy="-3" r="4" fill="white" opacity="0.9"/>
    </g>
  );
}

function Radar({ cx, cy, color }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="0" fill="none" stroke={color} strokeWidth="1.5" opacity="0">
        <animate attributeName="r" values="8;55" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx={cx} cy={cy} r="0" fill="none" stroke={color} strokeWidth="1" opacity="0">
        <animate attributeName="r" values="8;35" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;0" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
      </circle>
    </g>
  );
}

export default function AmericasMap() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <defs>
        <radialGradient id="am-bg" cx="62%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#0d1a28"/>
          <stop offset="100%" stopColor="#060810"/>
        </radialGradient>
        <radialGradient id="am-orange-r" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF8500" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#FF8500" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="am-green-r" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FF88" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#00FF88" stopOpacity="0"/>
        </radialGradient>
        <filter id="am-glow4">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="am-glow12">
          <feGaussianBlur stdDeviation="12" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="am-soft">
          <feGaussianBlur stdDeviation="22"/>
        </filter>
        <clipPath id="am-clip">
          <rect width="1920" height="700"/>
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="1920" height="700" fill="url(#am-bg)"/>

      {/* Grid */}
      {[...Array(13)].map((_, i) => (
        <line key={`gh${i}`} x1="0" y1={i*58} x2="1920" y2={i*58}
          stroke="rgba(0,200,100,0.055)" strokeWidth="1"/>
      ))}
      {[...Array(33)].map((_, i) => (
        <line key={`gv${i}`} x1={i*60} y1="0" x2={i*60} y2="700"
          stroke="rgba(0,200,100,0.055)" strokeWidth="1"/>
      ))}

      {/* Ambient glow blobs */}
      <ellipse cx="1086" cy="210" rx="300" ry="200"
        fill="rgba(255,133,0,0.09)" filter="url(#am-soft)" clipPath="url(#am-clip)"/>
      <ellipse cx="1420" cy="480" rx="320" ry="240"
        fill="rgba(0,255,136,0.08)" filter="url(#am-soft)" clipPath="url(#am-clip)"/>

      {/* Scattered particles */}
      {[[120,80,1],[380,150,0],[520,420,1],[720,50,0],[860,580,1],
        [1820,100,0],[1750,550,1],[1680,200,0],[1560,640,1],[1100,80,0],
        [950,650,1],[260,490,0],[440,310,1],[180,380,0],[1870,400,1]
      ].map(([cx, cy, t], i) => (
        <circle key={`pt${i}`} cx={cx} cy={cy} r="2"
          fill={t ? "#00FF88" : "#FF8500"} opacity="0.45"/>
      ))}

      {/* 3D shadow (extrusion) */}
      <path d={NA} fill="#0a101e" transform="translate(5,8)" clipPath="url(#am-clip)"/>
      <path d={SA} fill="#0a101e" transform="translate(5,8)" clipPath="url(#am-clip)"/>

      {/* North + Central America — base */}
      <path d={NA} fill="#1d2840" stroke="rgba(255,255,255,0.2)" strokeWidth="1" clipPath="url(#am-clip)"/>

      {/* South America — base */}
      <path d={SA} fill="#1d2840" stroke="rgba(255,255,255,0.2)" strokeWidth="1" clipPath="url(#am-clip)"/>

      {/* Caribbean islands */}
      <ellipse cx="1288" cy="307" rx="54" ry="11" fill="#1d2840" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <ellipse cx="1357" cy="316" rx="26" ry="10" fill="#1d2840" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <ellipse cx="1393" cy="320" rx="14" ry="7" fill="#1d2840" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>

      {/* USA/North America orange glow */}
      <ellipse cx="1107" cy="188" rx="260" ry="115"
        fill="url(#am-orange-r)" clipPath="url(#am-clip)"/>

      {/* Mexico + Central America orange glow */}
      <ellipse cx="1086" cy="300" rx="140" ry="90"
        fill="url(#am-orange-r)" clipPath="url(#am-clip)"/>

      {/* Colombia / NW South America green glow */}
      <ellipse cx="1290" cy="385" rx="140" ry="100"
        fill="url(#am-green-r)" clipPath="url(#am-clip)"/>

      {/* Brazil / South America green glow */}
      <ellipse cx="1500" cy="450" rx="180" ry="130"
        fill="url(#am-green-r)" clipPath="url(#am-clip)"/>

      {/* Connection lines */}
      <g stroke="rgba(255,133,0,0.3)" strokeWidth="1.5" strokeDasharray="6,5" fill="none">
        <line x1="1336" y1="186" x2="1086" y2="290"/>
        <line x1="1086" y1="290" x2="1300" y2="360"/>
        <line x1="1300" y1="360" x2="1536" y2="490"/>
      </g>

      {/* Radar pulses */}
      <Radar cx={1336} cy={186} color="#FF8500"/>
      <Radar cx={1086} cy={290} color="#FF8500"/>
      <Radar cx={1300} cy={360} color="#00FF88"/>

      {/* Location pins */}
      <Pin cx={1021} cy={218} color="#FF8500"/>
      <Pin cx={1336} cy={186} color="#FF8500"/>
      <Pin cx={1086} cy={290} color="#FF8500"/>
      <Pin cx={1300} cy={360} color="#00FF88"/>
      <Pin cx={1536} cy={490} color="#00FF88"/>
      <Pin cx={1450} cy={558} color="#00FF88"/>
    </svg>
  );
}
