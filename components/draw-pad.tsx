'use client';

import { useEffect, useRef } from 'react';
import { analyzeStrokes, type Stroke, type StrokePoint } from '@/lib/stroke-analysis';
import type { Parameters } from '@/lib/type-engine';

type DrawPadProps = {
  onHandChange: (parameters: Parameters) => void;
  fallback: Parameters;
};

function pointFromEvent(event: PointerEvent, canvas: HTMLCanvasElement): StrokePoint {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top, t: performance.now() };
}

function paint(ctx: CanvasRenderingContext2D, strokes: Stroke[], current: Stroke | null, width: number, height: number, dpr: number) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#292b28';
  ctx.lineWidth = 2.15;
  for (const stroke of current ? [...strokes, current] : strokes) {
    if (stroke.length < 2) continue;
    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x, stroke[i].y);
    ctx.stroke();
  }
}

export function DrawPad({ onHandChange, fallback }: DrawPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const frameRef = useRef(0);
  const fallbackRef = useRef(fallback);
  const onHandChangeRef = useRef(onHandChange);
  fallbackRef.current = fallback;
  onHandChangeRef.current = onHandChange;

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    paint(ctx, strokesRef.current, currentRef.current, canvas.clientWidth, canvas.clientHeight, dpr);
  };

  const publish = (strokes: Stroke[]) => {
    const next = analyzeStrokes(strokes, fallbackRef.current);
    if (next) onHandChangeRef.current(next);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth, height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      redraw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      canvas.setPointerCapture(event.pointerId);
      currentRef.current = [pointFromEvent(event, canvas)];
    };
    const onMove = (event: PointerEvent) => {
      if (!currentRef.current) return;
      const last = currentRef.current[currentRef.current.length - 1];
      const next = pointFromEvent(event, canvas);
      if (Math.hypot(next.x - last.x, next.y - last.y) < .6) return;
      currentRef.current.push(next);
      if (!frameRef.current) frameRef.current = requestAnimationFrame(() => {
        frameRef.current = 0;
        redraw();
        publish([...strokesRef.current, currentRef.current!]);
      });
    };
    const onUp = () => {
      if (!currentRef.current) return;
      if (currentRef.current.length > 1) strokesRef.current = [...strokesRef.current, currentRef.current];
      currentRef.current = null;
      redraw();
      publish(strokesRef.current);
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    return () => {
      observer.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <div className="draw-pad">
    <div className="draw-surface"><canvas ref={canvasRef} aria-label="Draw a few letters to shape the hand" /></div>
    <div className="draw-toolbar">
      <span>Draw a few letters</span>
      <button type="button" className="reset-button" onClick={() => { strokesRef.current = []; currentRef.current = null; redraw(); }}>Clear</button>
    </div>
  </div>;
}
