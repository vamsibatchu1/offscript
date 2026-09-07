// Each character is a stroke graph in a 60 × 100 design space.
// No font file, system glyph, or traced font outline is used here.
import { FONT_NAMES } from './font-names';
export type Parameters = {
  weight: number; pressure: number; tremor: number; irregularity: number;
  width: number; slant: number; roundness: number; xHeight: number;
  bounce: number; spacing: number; flare: number; grain: number;
};
export const DEFAULTS: Parameters = { weight: 3.8, pressure: 48, tremor: 28, irregularity: 36, width: 82, slant: 2, roundness: 70, xHeight: 64, bounce: 25, spacing: 13, flare: 8, grain: 20 };
export const PRESETS: Record<string, Parameters> = {
  Notebook: DEFAULTS,
  'Felt tip': { ...DEFAULTS, weight: 9, pressure: 28, tremor: 44, irregularity: 45, width: 90, roundness: 92, flare: 0, grain: 8 },
  Manifesto: { ...DEFAULTS, weight: 2.8, pressure: 70, tremor: 40, irregularity: 30, width: 60, slant: 13, roundness: 27, spacing: 6, grain: 62 },
  Bookplate: { ...DEFAULTS, weight: 4.6, pressure: 92, tremor: 11, irregularity: 17, width: 82, slant: 0, roundness: 90, flare: 85, bounce: 9, spacing: 14, grain: 18 },
  'First letters': { ...DEFAULTS, weight: 5.8, pressure: 27, tremor: 35, irregularity: 75, width: 105, slant: -3, roundness: 56, xHeight: 70, bounce: 58, spacing: 16, flare: 0, grain: 9 },
};

const GRAPHS: Record<string, string> = {
  A: 'M3 100 L28 3 L58 100 M12 66 L47 63',
  B: 'M6 100 L6 3 C62 -3 66 46 7 47 C70 41 70 108 6 100',
  C: 'M56 12 C-10 -31 -16 130 57 88',
  D: 'M7 100 L7 2 C76 -2 77 105 7 100',
  E: 'M54 4 L8 5 L7 99 L55 96 M8 48 L47 46',
  F: 'M8 101 L8 5 L57 2 M9 49 L47 46',
  G: 'M57 16 C-5 -34 -19 129 57 91 L58 53 L34 54',
  H: 'M6 3 L5 99 M56 1 L55 100 M6 49 L56 47',
  I: 'M15 3 L46 3 M30 4 L29 98 M13 100 L46 99',
  J: 'M26 4 L56 2 M48 3 L47 77 C49 110 5 111 4 79',
  K: 'M7 3 L6 100 M56 1 L8 54 L58 99',
  L: 'M8 2 L8 99 L57 97',
  M: 'M4 100 L7 3 L31 58 L55 2 L59 100',
  N: 'M6 100 L7 4 L55 99 L54 1',
  O: 'M31 2 C-7 -1 -8 99 29 99 C70 103 70 -2 31 2',
  P: 'M8 100 L8 4 C70 -6 72 61 8 55',
  Q: 'M29 2 C-8 0 -7 103 30 99 C71 101 69 -2 29 2 M35 74 L65 112',
  R: 'M7 100 L8 3 C69 -5 69 56 8 52 M29 53 L61 101',
  S: 'M55 10 C10 -18 -11 38 28 49 C81 67 51 123 3 90',
  T: 'M1 5 L61 2 M32 4 L29 100',
  U: 'M5 2 L6 74 C5 114 58 112 56 73 L55 1',
  V: 'M3 2 L29 100 L58 2',
  W: 'M1 2 L13 99 L31 41 L47 100 L61 1',
  X: 'M4 3 L58 99 M57 2 L3 100',
  Y: 'M2 2 L29 51 L58 1 M29 51 L28 100',
  Z: 'M4 5 L59 2 L3 99 L58 98',
  a: 'M49 47 C5 16 -12 103 30 98 C48 97 52 76 49 47 M50 36 L51 96 L58 100',
  b: 'M8 1 L7 100 M8 52 C66 2 74 110 27 99 C15 98 8 89 8 79',
  c: 'M54 45 C6 9 -11 118 53 94',
  d: 'M50 51 C5 10 -13 107 30 98 C49 95 52 76 51 57 M52 1 L51 100',
  e: 'M7 68 L54 62 C53 15 1 32 6 74 C8 102 36 106 54 91',
  f: 'M17 102 L23 23 C26 -1 43 -8 55 6 M5 43 L45 41',
  g: 'M50 47 C9 13 -12 102 29 95 C43 95 50 79 50 57 M51 37 L48 112 C44 139 11 137 5 119',
  h: 'M7 1 L7 100 M8 60 C31 21 52 29 52 58 L53 99',
  i: 'M29 39 L30 100 M28 12 L29 14',
  j: 'M39 40 L38 112 C39 137 10 137 5 121 M39 12 L40 14',
  k: 'M9 2 L8 100 M50 37 L10 73 L54 100',
  l: 'M24 1 L23 85 C23 100 31 104 42 95',
  m: 'M4 100 L5 36 M6 54 C15 26 30 28 30 54 L30 98 M30 55 C40 25 57 31 57 56 L58 100',
  n: 'M8 100 L8 36 M9 57 C29 23 51 29 51 57 L53 100',
  o: 'M30 36 C-5 32 -6 102 31 99 C67 100 64 34 30 36',
  p: 'M9 132 L8 37 M9 51 C57 10 77 100 33 98 C21 100 14 94 9 86',
  q: 'M51 46 C6 13 -9 108 30 99 C44 99 51 83 51 69 M51 37 L51 131 L62 122',
  r: 'M10 100 L9 36 M10 59 C22 34 36 29 51 39',
  s: 'M52 41 C14 19 -9 63 29 67 C68 72 52 112 7 93',
  t: 'M24 12 L23 80 C23 105 41 105 52 94 M5 40 L47 38',
  u: 'M7 36 L8 80 C8 112 43 100 50 80 M51 36 L51 100',
  v: 'M4 36 L28 100 L57 36',
  w: 'M2 36 L14 100 L31 62 L46 100 L60 35',
  x: 'M5 38 L55 100 M55 36 L4 99',
  y: 'M5 37 L27 95 M55 35 L27 115 C23 127 13 133 5 126',
  z: 'M6 40 L55 37 L4 99 L56 97',
  '0': 'M31 3 C-4 0 -6 101 30 99 C66 99 65 0 31 3',
  '1': 'M15 24 L32 4 L31 99 M13 100 L51 99',
  '2': 'M5 24 C17 -16 62 -1 56 31 C54 49 24 78 5 99 L59 97',
  '3': 'M7 9 C48 -11 74 33 31 46 C77 42 71 116 4 93',
  '4': 'M42 100 L43 1 L3 67 L62 65',
  '5': 'M55 4 L12 5 L8 47 C69 25 73 112 6 94',
  '6': 'M53 8 C7 -16 -8 105 30 99 C72 102 60 37 28 47 C11 50 7 65 9 77',
  '7': 'M4 5 L58 4 L23 100 M17 53 L47 52',
  '8': 'M29 3 C-6 1 -1 39 28 48 C73 61 66 105 28 100 C-10 100 -4 61 28 48 C61 34 64 0 29 3',
  '9': 'M9 92 C61 127 70 -2 30 3 C-7 0 -7 64 30 58 C49 57 56 43 55 29',
  '.': 'M29 97 L30 99', ',': 'M32 93 Q36 104 24 116',
  ':': 'M29 42 L30 44 M29 96 L30 98', ';': 'M29 42 L30 44 M32 92 Q35 104 24 115',
  '!': 'M30 3 L29 72 M29 96 L30 99',
  '?': 'M6 23 C9 -9 61 -7 55 27 C54 45 29 48 30 72 M29 97 L30 99',
  "'": 'M30 2 L28 23', '"': 'M20 2 L18 23 M42 2 L40 23',
  '#': 'M22 8 L12 99 M48 7 L38 99 M3 37 L59 35 M0 71 L56 69',
  '$': 'M53 17 C11 -10 -3 45 30 51 C76 61 50 116 6 89 M33 -9 L27 111',
  '%': 'M4 101 L58 0 M16 3 C-2 2 -1 40 16 38 C34 39 35 1 16 3 M47 62 C28 59 29 100 46 99 C66 99 65 59 47 62',
  '&': 'M55 99 C38 71 1 39 12 16 C27 -12 64 18 35 41 C-24 77 18 134 60 64',
  '(': 'M43 0 C7 17 7 86 43 106', ')': 'M17 0 C53 17 53 86 17 106',
  '*': 'M30 18 L30 66 M7 30 L52 55 M9 55 L51 30',
  '+': 'M30 28 L30 88 M3 58 L57 58', '-': 'M7 60 L54 58',
  '/': 'M6 105 L54 -2', '\\': 'M6 -2 L54 105',
  '<': 'M52 26 L8 58 L53 90', '>': 'M8 26 L52 58 L7 90',
  '=': 'M6 42 L55 41 M6 75 L55 74',
  '@': 'M42 42 C9 19 0 97 30 87 C41 84 45 63 43 43 M46 35 L42 75 C41 100 66 93 63 48 C62 -7 -1 -1 0 62 C0 105 36 116 60 101',
  '[': 'M43 1 L19 1 L19 103 L43 103', ']': 'M17 1 L41 1 L41 103 L17 103',
  '{': 'M48 0 C21 -1 30 31 25 41 L11 52 L25 62 C30 73 21 105 48 104',
  '}': 'M12 0 C39 -1 30 31 35 41 L49 52 L35 62 C30 73 39 105 12 104',
  '^': 'M7 37 L30 5 L53 37', '_': 'M3 104 L59 104',
  '`': 'M24 1 L36 21', '|': 'M30 -2 L30 110',
  '~': 'M3 58 C20 26 40 88 58 51',
};

export const CHARACTERS = Object.keys(GRAPHS);
export type Point = { x: number; y: number };
export type Glyph = { path: string; advance: number; left: number };
type Stroke = Point[];
export function random(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
export function newSeed(): number { return crypto.getRandomValues(new Uint32Array(1))[0]; }
export function seededParameters(seed: number): Parameters {
  const r = random(seed);
  const base = PRESETS[Object.keys(PRESETS)[Math.floor(r() * 5)]];
  return { ...base, weight: +(base.weight * (.8 + r() * .4)).toFixed(1), width: Math.round(base.width * (.9 + r() * .17)), slant: Math.round(base.slant + (r() - .5) * 10), tremor: Math.round(15 + r() * 35), irregularity: Math.round(20 + r() * 40), bounce: Math.round(12 + r() * 30) };
}
export function familyName(seed: number): string {
  const r = random(seed ^ 98765);
  return FONT_NAMES[Math.floor(r() * FONT_NAMES.length)];
}

function sampleGraph(graph: string, roundness: number): Stroke[] {
  const parts = graph.match(/[MLQC]|-?\d+(?:\.\d+)?/g)!;
  let i = 0, current: Point = { x: 0, y: 0 }, stroke: Stroke = [];
  const strokes: Stroke[] = [];
  const point = () => ({ x: +parts[i++], y: +parts[i++] });
  while (i < parts.length) {
    const command = parts[i++];
    if (command === 'M') { if (stroke.length) strokes.push(stroke); current = point(); stroke = [current]; continue; }
    const start = current;
    const a = point(); const b = command === 'Q' || command === 'C' ? point() : a;
    const c = command === 'C' ? point() : b;
    const steps = command === 'L' ? Math.max(3, Math.ceil(Math.hypot(c.x - start.x, c.y - start.y) / 3)) : 32;
    for (let j = 1; j <= steps; j++) {
      const t = j / steps;
      const at = (v: number): Point => {
        const u = 1 - v;
        if (command === 'Q') return { x: u*u*start.x + 2*u*v*a.x + v*v*b.x, y: u*u*start.y + 2*u*v*a.y + v*v*b.y };
        if (command === 'C') return { x: u*u*u*start.x + 3*u*u*v*a.x + 3*u*v*v*b.x + v*v*v*c.x, y: u*u*u*start.y + 3*u*u*v*a.y + 3*u*v*v*b.y + v*v*v*c.y };
        return { x: start.x*u + c.x*v, y: start.y*u + c.y*v };
      };
      // Interpolate between polygonal bowls and continuous Bézier curves.
      const segments = 4, step = t * segments, lower = Math.floor(step);
      const from = at(lower / segments), to = at(Math.min(1, (lower + 1) / segments));
      const amount = step - lower, curved = at(t), blend = roundness / 100;
      const angular = { x: from.x + (to.x - from.x) * amount, y: from.y + (to.y - from.y) * amount };
      stroke.push({ x: angular.x * (1 - blend) + curved.x * blend, y: angular.y * (1 - blend) + curved.y * blend });
    }
    current = c;
  }
  if (stroke.length) strokes.push(stroke);
  return strokes;
}

function glyphGraph(char: string, seed: number): string {
  const r = random(seed ^ Math.imul(char.charCodeAt(0), 1664525));
  const alternate = r() > .55;
  if (char === 'a' && alternate) return 'M9 46 C45 19 54 42 51 67 L51 100 M50 66 C-5 42 -4 107 29 99 C44 96 50 87 51 80';
  if (char === 'E' && alternate) return 'M54 6 C-12 -15 -10 110 55 96 M3 51 L47 49';
  if (char === 'I' && alternate) return 'M29 2 L31 100';
  if (char === 't' && alternate) return 'M29 11 L27 101 M5 41 L53 39';
  if (char === '4' && alternate) return 'M17 3 L6 64 L60 62 M45 3 L44 100';
  return GRAPHS[char] || GRAPHS['?'];
}

export function generateGlyph(char: string, seed: number, p: Parameters): Glyph {
  if (char === ' ') return { path: '', advance: 30 + p.spacing, left: 0 };
  const rand = random(seed ^ Math.imul(char.charCodeAt(0), 2654435761));
  const phase = rand() * Math.PI * 2, phase2 = rand() * Math.PI * 2;
  const widthVariance = 1 + (rand() - .5) * p.irregularity / 220;
  const heightVariance = 1 + (rand() - .5) * p.irregularity / 480;
  const lean = Math.tan((p.slant + (rand() - .5) * p.irregularity / 10) * Math.PI / 180);
  const offset = (rand() - .5) * p.bounce / 4;
  const strokes = sampleGraph(glyphGraph(char, seed), p.roundness);
  const lower = /[a-z]/.test(char);
  const f = (n: number) => n.toFixed(2);
  let minX = Infinity, maxX = -Infinity;
  const paths: string[] = [];
  for (const stroke of strokes) {
    const points = stroke.map(({ x, y }) => {
      if (lower) y = y >= 100 ? y : y >= 36 ? 100 - (100 - y) * p.xHeight / 64 : y * (100 - p.xHeight) / 36;
      const driftX = (Math.sin(y / 38 + phase) + .4 * Math.sin(x / 29 + phase2)) * p.irregularity / 24;
      const driftY = Math.sin(x / 30 + phase2) * p.irregularity / 32;
      const tremor = (Math.sin(y * .24 + x * .14 + phase) + .4 * Math.sin(y * .53 + phase2)) * p.tremor / 85;
      const gx = (x + driftX + tremor - 30) * p.width / 100 * widthVariance + 30 + (100 - y) * lean;
      const gy = (y + driftY + tremor * .35 - 100) * heightVariance + 100 + offset;
      return { x: gx, y: gy };
    });
    const left: Point[] = [], right: Point[] = [], radii: number[] = [];
    for (let n = 0; n < points.length; n++) {
      const point = points[n], previous = points[Math.max(0, n - 1)], next = points[Math.min(points.length - 1, n + 1)];
      const dx = next.x - previous.x, dy = next.y - previous.y, distance = Math.hypot(dx, dy) || 1;
      const t = n / (points.length - 1);
      const contrast = Math.abs(dy / distance);
      const pressure = 1 + p.pressure / 100 * (.5 * Math.sin(t * Math.PI * 2 + phase) + .7 * (contrast - .5));
      const flare = p.flare / 100 * 2.1 * (Math.exp(-t * 22) + Math.exp(-(1 - t) * 22));
      const edge = p.grain / 100 * (.18 * Math.sin(n * 2.3 + phase) + .13 * Math.sin(n * 4.1 + phase2));
      const radius = Math.max(.25, p.weight / 2 * (pressure + flare + edge));
      radii.push(radius);
      const normalX = -dy / distance * radius, normalY = dx / distance * radius;
      const a = { x: point.x + normalX, y: point.y + normalY }, b = { x: point.x - normalX, y: point.y - normalY };
      left.push(a); right.push(b);
      minX = Math.min(minX, a.x, b.x); maxX = Math.max(maxX, a.x, b.x);
    }
    const start = points[0], end = points[points.length - 1];
    const cap = (tip: Point, adjacent: Point, radius: number) => {
      const distance = Math.hypot(tip.x - adjacent.x, tip.y - adjacent.y) || 1;
      return { x: tip.x + (tip.x - adjacent.x) / distance * radius * 2, y: tip.y + (tip.y - adjacent.y) / distance * radius * 2 };
    };
    const startCap = cap(start, points[1], radii[0]), endCap = cap(end, points[points.length - 2], radii[radii.length - 1]);
    minX = Math.min(minX, (start.x + startCap.x) / 2, (end.x + endCap.x) / 2);
    maxX = Math.max(maxX, (start.x + startCap.x) / 2, (end.x + endCap.x) / 2);
    paths.push(`M${f(left[0].x)} ${f(left[0].y)} ` + left.slice(1).map(v => `L${f(v.x)} ${f(v.y)}`).join(' ') + ` Q${f(endCap.x)} ${f(endCap.y)} ${f(right[right.length - 1].x)} ${f(right[right.length - 1].y)} ` + right.slice(0, -1).reverse().map(v => `L${f(v.x)} ${f(v.y)}`).join(' ') + ` Q${f(startCap.x)} ${f(startCap.y)} ${f(left[0].x)} ${f(left[0].y)} Z`);
  }
  // Rebase ink bounds, with a little breathing room on either side.
  return { path: paths.join(' '), advance: maxX - minX + p.spacing + 5, left: minX - 2.5 };
}

export function generateAlphabet(seed: number, p: Parameters): Record<string, Glyph> {
  return Object.fromEntries([...CHARACTERS, ' '].map(char => [char, generateGlyph(char, seed, p)]));
}

export function measureLine(text: string, glyphs: Record<string, Glyph>): number {
  return [...text].reduce((sum, char) => sum + (glyphs[char] || glyphs['?']).advance, 0);
}
