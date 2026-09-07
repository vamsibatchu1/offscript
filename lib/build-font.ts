import * as opentype from 'opentype.js';
import { CHARACTERS, type Glyph } from './type-engine';

const SCALE = 8;
const BASELINE = 100;

function mapX(x: number, left: number) {
  return (x - left) * SCALE;
}

function mapY(y: number) {
  return (BASELINE - y) * SCALE;
}

function svgPathToFontPath(d: string, left: number) {
  const path = new opentype.Path();
  const tokens = d.match(/[MLQZ]|-?\d+\.?\d*/g) || [];
  let i = 0;
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === 'M') {
      path.moveTo(mapX(+tokens[i++], left), mapY(+tokens[i++]));
      continue;
    }
    if (command === 'L') {
      path.lineTo(mapX(+tokens[i++], left), mapY(+tokens[i++]));
      continue;
    }
    if (command === 'Q') {
      path.quadraticCurveTo(mapX(+tokens[i++], left), mapY(+tokens[i++]), mapX(+tokens[i++], left), mapY(+tokens[i++]));
      continue;
    }
    if (command === 'Z') path.close();
  }
  return path;
}

function glyphName(char: string) {
  if (char === ' ') return 'space';
  if (/[A-Za-z0-9]/.test(char)) return char;
  return `uni${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
}

function notdefPath() {
  const path = new opentype.Path();
  path.moveTo(80, 0);
  path.lineTo(80, 700);
  path.lineTo(520, 700);
  path.lineTo(520, 0);
  path.close();
  return path;
}

export function buildFontBuffer(glyphs: Record<string, Glyph>, familyName: string) {
  const fontGlyphs: opentype.Glyph[] = [
    new opentype.Glyph({ name: '.notdef', unicode: 0, advanceWidth: 600, path: notdefPath() }),
  ];

  let top = 800;
  let bottom = -200;

  for (const char of [...CHARACTERS, ' ']) {
    const glyph = glyphs[char];
    if (!glyph) continue;
    const path = glyph.path ? svgPathToFontPath(glyph.path, glyph.left) : new opentype.Path();
    if (glyph.path) {
      const box = path.getBoundingBox();
      top = Math.max(top, box.y2);
      bottom = Math.min(bottom, box.y1);
    }
    fontGlyphs.push(new opentype.Glyph({
      name: glyphName(char),
      unicode: char.charCodeAt(0),
      advanceWidth: Math.max(40, Math.round(glyph.advance * SCALE)),
      path,
    }));
  }

  const font = new opentype.Font({
    familyName,
    styleName: 'Regular',
    unitsPerEm: 1000,
    ascender: Math.min(1200, Math.ceil(top + 40)),
    descender: Math.max(-500, Math.floor(bottom - 40)),
    glyphs: fontGlyphs,
  });

  return font.toArrayBuffer();
}

export function fontFileName(familyName: string) {
  return `${familyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.otf`;
}
