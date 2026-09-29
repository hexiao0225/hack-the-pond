import type { CharacterKind } from '../game/types';

const INK = '#2b2230';

/** Shared SVG defs: a wobble filter that makes clean vector lines look hand-inked. */
export function SketchDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="sketch" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" />
        </filter>
      </defs>
    </svg>
  );
}

interface Props {
  size?: number;
  className?: string;
}

function Frame({ size = 96, className, children, label }: Props & { children: React.ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={label}
      stroke={INK}
      strokeWidth={3.2}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <g filter="url(#sketch)">{children}</g>
    </svg>
  );
}

/** Heavy-lidded, slightly unimpressed eyes — the signature of the art style. */
function SleepyEye({ x, y, r = 4.2 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" strokeWidth={2} />
      <circle cx={x} cy={y + 1} r={r * 0.45} fill={INK} stroke="none" />
      <path d={`M${x - r - 1} ${y - 1} Q${x} ${y - r - 2} ${x + r + 1} ${y - 1}`} fill="none" strokeWidth={2.4} />
    </g>
  );
}

function Speckles({ dots, color }: { dots: Array<[number, number, number]>; color: string }) {
  return (
    <g fill={color} stroke="none">
      {dots.map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.75} transform={`rotate(${(i * 37) % 90} ${x} ${y})`} />
      ))}
    </g>
  );
}

function Hatch({ lines }: { lines: Array<[number, number, number, number]> }) {
  return (
    <g strokeWidth={1.4} opacity={0.55}>
      {lines.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </g>
  );
}

export function Frog(props: Props) {
  return (
    <Frame {...props} label="Pip the frog">
      <ellipse cx="60" cy="112" rx="34" ry="5" fill="#000" opacity="0.12" stroke="none" />
      <path d="M28 104 q-10 2 -12 -4 q6 -4 16 -2 Z" fill="#7cc46a" />
      <path d="M92 104 q10 2 12 -4 q-6 -4 -16 -2 Z" fill="#7cc46a" />
      <path d="M20 78 Q18 44 40 40 Q60 36 80 40 Q102 44 100 78 Q100 108 60 108 Q20 108 20 78 Z" fill="#8fd27a" />
      <path d="M34 84 Q60 104 86 84 Q84 102 60 103 Q36 102 34 84 Z" fill="#e9f3c9" strokeWidth={2.2} />
      <circle cx="40" cy="36" r="15" fill="#8fd27a" />
      <circle cx="80" cy="36" r="15" fill="#8fd27a" />
      <Speckles color="#4f9a47" dots={[[27, 66, 4], [92, 70, 3.5], [30, 88, 2.6], [88, 90, 3], [60, 50, 2.4], [48, 58, 2], [74, 57, 2.6]]} />
      <SleepyEye x={40} y={36} r={7} />
      <SleepyEye x={80} y={36} r={7} />
      <path d="M46 68 Q60 76 74 68" fill="none" strokeWidth={2.6} />
      <ellipse cx="36" cy="66" rx="5" ry="3" fill="#f4a3a8" stroke="none" opacity="0.8" />
      <ellipse cx="84" cy="66" rx="5" ry="3" fill="#f4a3a8" stroke="none" opacity="0.8" />
      <Hatch lines={[[24, 74, 27, 70], [96, 74, 93, 70], [24, 82, 27, 78]]} />
    </Frame>
  );
}

export function Dog(props: Props) {
  return (
    <Frame {...props} label="Biscuit the dog">
      <ellipse cx="60" cy="113" rx="32" ry="5" fill="#000" opacity="0.12" stroke="none" />
      <path d="M32 110 Q26 70 44 62 L76 62 Q94 70 88 110 Z" fill="#e2b77c" />
      <path d="M48 110 Q46 86 60 84 Q74 86 72 110 Z" fill="#f6e3c0" strokeWidth={2.2} />
      <path d="M36 68 Q60 76 84 68 L82 74 Q60 82 38 74 Z" fill="#d9493f" strokeWidth={2.4} />
      <circle cx="60" cy="80" r="4.5" fill="#f2c94c" strokeWidth={2} />
      <path d="M28 40 Q28 14 60 14 Q92 14 92 40 Q94 66 60 68 Q26 66 28 40 Z" fill="#e2b77c" />
      <path d="M30 22 Q14 24 12 50 Q14 60 22 56 Q26 40 34 30 Z" fill="#8a5a36" />
      <path d="M90 22 Q106 24 108 50 Q106 60 98 56 Q94 40 86 30 Z" fill="#8a5a36" />
      <Speckles color="#b98651" dots={[[38, 26, 3], [80, 22, 2.6], [70, 30, 1.8], [44, 96, 3], [80, 98, 2.4]]} />
      <path d="M42 48 Q60 38 78 48 Q80 64 60 64 Q40 64 42 48 Z" fill="#f6e3c0" strokeWidth={2.4} />
      <path d="M52 46 Q60 40 68 46 Q66 53 60 53 Q54 53 52 46 Z" fill="#e8766a" />
      <path d="M60 53 L60 58 M53 59 Q60 63 67 59" fill="none" strokeWidth={2.2} />
      <SleepyEye x={46} y={34} />
      <SleepyEye x={74} y={34} />
      <Hatch lines={[[34, 88, 37, 84], [86, 88, 83, 84], [33, 98, 36, 94]]} />
    </Frame>
  );
}

export function Axolotl(props: Props) {
  return (
    <Frame {...props} label="Lottie the axolotl">
      <ellipse cx="60" cy="113" rx="30" ry="5" fill="#000" opacity="0.12" stroke="none" />
      <path d="M78 96 Q104 96 108 76 Q100 88 82 86 Z" fill="#f3e6ef" />
      <path d="M36 110 Q30 72 44 60 L76 60 Q90 72 84 110 Z" fill="#f3e6ef" />
      <g fill="#f29bbd">
        <path d="M30 32 Q12 22 8 30 Q18 32 28 38 Z" />
        <path d="M28 42 Q8 42 6 50 Q16 48 28 48 Z" />
        <path d="M30 52 Q14 60 16 66 Q22 60 32 56 Z" />
        <path d="M90 32 Q108 22 112 30 Q102 32 92 38 Z" />
        <path d="M92 42 Q112 42 114 50 Q104 48 92 48 Z" />
        <path d="M90 52 Q106 60 104 66 Q98 60 88 56 Z" />
      </g>
      <path d="M28 44 Q28 18 60 18 Q92 18 92 44 Q92 66 60 66 Q28 66 28 44 Z" fill="#f3e6ef" />
      <Speckles color="#e7c9da" dots={[[40, 28, 3], [82, 30, 2.6], [50, 90, 3], [74, 100, 2.4], [42, 100, 2]]} />
      <circle cx="44" cy="40" r="2.8" fill={INK} stroke="none" />
      <circle cx="76" cy="40" r="2.8" fill={INK} stroke="none" />
      <path d="M50 52 Q60 58 70 52" fill="none" strokeWidth={2.4} />
      <ellipse cx="38" cy="50" rx="4.5" ry="2.6" fill="#f29bbd" stroke="none" opacity="0.7" />
      <ellipse cx="82" cy="50" rx="4.5" ry="2.6" fill="#f29bbd" stroke="none" opacity="0.7" />
      <path d="M44 72 Q34 80 40 88 M76 72 Q88 76 84 84" fill="none" strokeWidth={2.6} />
      <Hatch lines={[[40, 94, 43, 90], [80, 94, 77, 90]]} />
    </Frame>
  );
}

export function Lobster(props: Props) {
  return (
    <Frame {...props} label="Clawdia the lobster">
      <ellipse cx="60" cy="113" rx="34" ry="5" fill="#000" opacity="0.12" stroke="none" />
      <path d="M52 22 Q40 4 22 6 M68 22 Q80 4 98 6" fill="none" strokeWidth={2.4} />
      <path d="M40 62 Q26 60 20 44 Q8 36 10 22 Q18 16 24 26 Q26 14 36 16 Q38 30 30 36 Q34 48 44 52 Z" fill="#7aa6dc" />
      <path d="M80 62 Q94 60 100 44 Q112 36 110 22 Q102 16 96 26 Q94 14 84 16 Q82 30 90 36 Q86 48 76 52 Z" fill="#7aa6dc" />
      <path d="M40 108 Q34 60 44 38 Q60 22 76 38 Q86 60 80 108 Z" fill="#7aa6dc" />
      <path d="M42 70 Q60 76 78 70 M42 84 Q60 90 78 84 M42 98 Q60 104 78 98" fill="none" strokeWidth={2.2} />
      <Speckles
        color="#2f4f9a"
        dots={[[50, 50, 2.6], [70, 46, 2.2], [48, 78, 2.4], [72, 80, 3], [60, 92, 2.2], [16, 30, 2.4], [104, 30, 2.2], [28, 44, 1.8], [94, 44, 2]]}
      />
      <SleepyEye x={52} y={40} r={4} />
      <SleepyEye x={68} y={40} r={4} />
      <path d="M54 56 Q60 60 66 56" fill="none" strokeWidth={2.2} />
    </Frame>
  );
}

export function Bear(props: Props) {
  return (
    <Frame {...props} label="Bruno the bear">
      <ellipse cx="60" cy="113" rx="36" ry="5" fill="#000" opacity="0.12" stroke="none" />
      <circle cx="32" cy="22" r="11" fill="#9a5b34" />
      <circle cx="88" cy="22" r="11" fill="#9a5b34" />
      <path d="M22 110 Q16 60 24 34 Q40 14 60 14 Q80 14 96 34 Q104 60 98 110 Z" fill="#a8663b" />
      <path d="M40 46 Q60 38 80 46 Q86 72 60 76 Q34 72 40 46 Z" fill="#cf9453" strokeWidth={2.4} />
      <path d="M52 46 Q60 40 68 46 Q66 54 60 54 Q54 54 52 46 Z" fill="#ef8a73" />
      <path d="M60 54 L60 62 M50 64 Q60 70 70 64" fill="none" strokeWidth={2.2} />
      <SleepyEye x={46} y={32} r={3.6} />
      <SleepyEye x={74} y={32} r={3.6} />
      <path d="M28 104 l4 6 l3 -6 M86 104 l3 6 l4 -6" fill="#f3e3b3" strokeWidth={2} />
      <Hatch lines={[[26, 60, 30, 56], [92, 60, 88, 56], [28, 78, 32, 74], [90, 80, 86, 76], [60, 90, 63, 86], [40, 96, 43, 92], [76, 96, 79, 92]]} />
      <rect x="70" y="80" width="18" height="12" rx="3" fill="#8fd27a" strokeWidth={2.2} />
      <path d="M74 80 L74 74 Q79 70 84 74 L84 80" fill="none" strokeWidth={2.2} />
    </Frame>
  );
}

export function Raccoon(props: Props) {
  return (
    <Frame {...props} label="Rocco the raccoon">
      <ellipse cx="60" cy="113" rx="34" ry="5" fill="#000" opacity="0.12" stroke="none" />
      <path d="M86 98 Q112 92 110 64 Q100 80 84 84 Z" fill="#9aa0a8" />
      <path d="M102 76 l6 -4 M96 86 l6 -2" strokeWidth={4} stroke="#3d3a42" />
      <path d="M34 110 Q28 72 42 60 L78 60 Q92 72 86 110 Z" fill="#9aa0a8" />
      <path d="M26 30 L30 8 L46 22 Z M94 30 L90 8 L74 22 Z" fill="#9aa0a8" />
      <path d="M26 42 Q26 18 60 18 Q94 18 94 42 Q94 66 60 68 Q26 66 26 42 Z" fill="#b4b9c0" />
      <path d="M28 40 Q44 30 58 40 Q60 50 60 50 Q62 40 62 40 Q76 30 92 40 Q88 52 74 50 Q62 50 60 48 Q58 50 46 50 Q32 52 28 40 Z" fill="#3d3a42" />
      <path d="M46 52 Q60 60 74 52 Q72 66 60 66 Q48 66 46 52 Z" fill="#eef0f2" strokeWidth={2.2} />
      <ellipse cx="60" cy="54" rx="4" ry="3" fill={INK} stroke="none" />
      <path d="M54 61 Q60 64 66 61" fill="none" strokeWidth={2} />
      <circle cx="44" cy="42" r="3.4" fill="#fff" stroke="none" />
      <circle cx="76" cy="42" r="3.4" fill="#fff" stroke="none" />
      <circle cx="44.6" cy="42.6" r="1.6" fill={INK} stroke="none" />
      <circle cx="76.6" cy="42.6" r="1.6" fill={INK} stroke="none" />
      <rect x="40" y="76" width="40" height="26" rx="4" fill="#f2c94c" />
      <path d="M44 84 h14 M44 92 h24" strokeWidth={2} />
    </Frame>
  );
}

const BY_KIND: Record<CharacterKind, (p: Props) => React.ReactElement> = {
  dog: Dog,
  axolotl: Axolotl,
  lobster: Lobster,
  bear: Bear,
  raccoon: Raccoon,
};

export function Npc({ kind, ...props }: Props & { kind: CharacterKind }) {
  const Component = BY_KIND[kind];
  return <Component {...props} />;
}
