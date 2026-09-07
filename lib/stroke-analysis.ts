import { DEFAULTS, type Parameters } from './type-engine';

export type StrokePoint = { x: number; y: number; t: number };
export type Stroke = StrokePoint[];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mean(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function stdev(values: number[]) {
  if (values.length < 2) return 0;
  const average = mean(values);
  return Math.sqrt(mean(values.map(value => (value - average) ** 2)));
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function segments(stroke: Stroke) {
  const items: { length: number; dt: number; dx: number; dy: number }[] = [];
  for (let i = 1; i < stroke.length; i++) {
    const dx = stroke[i].x - stroke[i - 1].x;
    const dy = stroke[i].y - stroke[i - 1].y;
    const length = Math.hypot(dx, dy);
    const dt = Math.max(1, stroke[i].t - stroke[i - 1].t);
    if (length > .2) items.push({ length, dt, dx, dy });
  }
  return items;
}

function turning(stroke: Stroke) {
  const angles: number[] = [];
  for (let i = 1; i < stroke.length - 1; i++) {
    const ax = stroke[i].x - stroke[i - 1].x, ay = stroke[i].y - stroke[i - 1].y;
    const bx = stroke[i + 1].x - stroke[i].x, by = stroke[i + 1].y - stroke[i].y;
    const a = Math.hypot(ax, ay), b = Math.hypot(bx, by);
    if (a < .8 || b < .8) continue;
    const cos = clamp((ax * bx + ay * by) / (a * b), -1, 1);
    angles.push(Math.acos(cos));
  }
  return angles;
}

function residual(stroke: Stroke, window = 5) {
  if (stroke.length < window * 2) return 0;
  let error = 0, count = 0;
  for (let i = window; i < stroke.length - window; i++) {
    let x = 0, y = 0;
    for (let j = i - window; j <= i + window; j++) { x += stroke[j].x; y += stroke[j].y; }
    const size = window * 2 + 1;
    error += Math.hypot(stroke[i].x - x / size, stroke[i].y - y / size);
    count += 1;
  }
  return count ? error / count : 0;
}

export function analyzeStrokes(strokes: Stroke[], fallback: Parameters = DEFAULTS): Parameters | null {
  const ink = strokes.filter(stroke => stroke.length >= 3);
  const parts = ink.flatMap(segments);
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  if (length < 36) return null;

  const speeds = parts.map(part => part.length / part.dt);
  const medianSpeed = median(speeds);
  const speedMean = mean(speeds) || 1;
  const turns = ink.flatMap(turning);
  const sharp = turns.filter(angle => angle > .7).length / Math.max(1, turns.length);
  const wobble = mean(ink.map(stroke => residual(stroke)));
  const boxes = ink.map(stroke => {
    const xs = stroke.map(point => point.x), ys = stroke.map(point => point.y);
    return { w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys), minY: Math.min(...ys), maxY: Math.max(...ys) };
  });
  const allX = ink.flatMap(stroke => stroke.map(point => point.x));
  const allY = ink.flatMap(stroke => stroke.map(point => point.y));
  const spanX = Math.max(...allX) - Math.min(...allX);
  const spanY = Math.max(...allY) - Math.min(...allY) || 1;
  const vertical = parts.filter(part => Math.abs(part.dy) > Math.abs(part.dx) * .55 && part.length > 6);
  const slantDeg = mean(vertical.map(part => Math.atan2(part.dx, -part.dy) * 180 / Math.PI));
  const heights = boxes.map(box => box.h).filter(height => height > 8);
  const tall = Math.max(...heights, 1);
  const short = median(heights);
  const starts = [...ink].sort((a, b) => a[0].x - b[0].x);
  const gaps = starts.slice(1).map((stroke, index) => stroke[0].x - starts[index][0].x).filter(gap => gap > 0);
  const midSpeeds = ink.map(stroke => {
    const items = segments(stroke);
    if (items.length < 6) return { start: medianSpeed, mid: medianSpeed, end: medianSpeed };
    const third = Math.max(1, Math.floor(items.length / 3));
    const speedAt = (from: number, to: number) => mean(items.slice(from, to).map(item => item.length / item.dt)) || medianSpeed;
    return { start: speedAt(0, third), mid: speedAt(third, items.length - third), end: speedAt(items.length - third, items.length) };
  });

  return {
    weight: +clamp(10.6 - medianSpeed * 7.2, 1.4, 11.5).toFixed(1),
    pressure: Math.round(clamp(stdev(speeds) / speedMean * 140, 8, 96)),
    tremor: Math.round(clamp(wobble * 14, 4, 92)),
    grain: Math.round(clamp(wobble * 9 + sharp * 28, 4, 90)),
    width: Math.round(clamp(45 + (spanX / spanY) * 38, 48, 118)),
    slant: Math.round(clamp(Number.isFinite(slantDeg) ? slantDeg : fallback.slant, -18, 24)),
    roundness: Math.round(clamp(92 - sharp * 95 - wobble * 4, 8, 96)),
    xHeight: heights.length >= 3 ? Math.round(clamp(45 + (short / tall) * 42, 46, 80)) : fallback.xHeight,
    bounce: Math.round(clamp(stdev(boxes.map(box => box.minY)) / spanY * 160, 4, 92)),
    spacing: Math.round(clamp(gaps.length ? median(gaps) / 6 : fallback.spacing, 3, 30)),
    flare: Math.round(clamp(mean(midSpeeds.map(item => item.mid / Math.max(.05, (item.start + item.end) / 2))) * 36 - 18, 0, 92)),
    irregularity: Math.round(clamp((stdev(ink.map(stroke => segments(stroke).reduce((sum, part) => sum + part.length, 0))) / Math.max(1, mean(ink.map(stroke => segments(stroke).reduce((sum, part) => sum + part.length, 0))))) * 90 + (stdev(heights) / tall) * 70, 10, 94)),
  };
}
