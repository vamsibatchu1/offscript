'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { measureLine, type Glyph } from '@/lib/type-engine';

type Alphabet = Record<string, Glyph & { left?: number }>;

function caretOffset(text: string, index: number, glyphs: Alphabet) {
  let x = 12;
  for (let i = 0; i < index; i++) x += (glyphs[text[i]] || glyphs['?']).advance;
  return x;
}

function indexAt(text: string, x: number, glyphs: Alphabet) {
  let position = 12, best = 0, distance = Infinity;
  for (let i = 0; i <= text.length; i++) {
    const gap = Math.abs(x - position);
    if (gap < distance) { distance = gap; best = i; }
    if (i < text.length) position += (glyphs[text[i]] || glyphs['?']).advance;
  }
  return best;
}

function lineCaret(text: string, caret: number) {
  const lines = text.split('\n');
  let remaining = caret;
  return lines.map(line => {
    if (remaining < 0) return -1;
    if (remaining <= line.length) { const at = remaining; remaining = -1; return at; }
    remaining -= line.length + 1;
    return -1;
  });
}

function GlyphLine({ text, glyphs, guides, caretAt, showCaret, onSeek }: { text: string; glyphs: Alphabet; guides: boolean; caretAt: number; showCaret: boolean; onSeek: (event: PointerEvent<SVGSVGElement>) => void }) {
  let position = 12;
  const lineWidth = measureLine(text || ' ', glyphs);
  const viewWidth = Math.max(750, lineWidth + 48);
  return <svg className="glyph-line" viewBox={`0 -22 ${viewWidth} 162`} role="img" aria-hidden onPointerDown={event => { event.stopPropagation(); onSeek(event); }}>
    {guides && <g className="guide-lines" fill="none" stroke="currentColor" strokeWidth=".6"><path d={`M0 0H${viewWidth} M0 100H${viewWidth}`} /><path strokeDasharray="3 5" d={`M0 36H${viewWidth}`} /></g>}
    {[...text].map((char, index) => {
      const glyph = glyphs[char] || glyphs['?'];
      const x = position - (glyph.left || 0); position += glyph.advance;
      return <path key={index} d={glyph.path} transform={`translate(${x} 0)`} fill="currentColor" />;
    })}
    {showCaret && caretAt >= 0 && <rect className="tester-caret" x={caretOffset(text, caretAt, glyphs)} y={-8} width="2.4" height="118" />}
  </svg>;
}

export function TypeTester({ glyphs, guides, value, onChange, active }: { glyphs: Alphabet; guides: boolean; value: string; onChange: (text: string) => void; active: boolean }) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [caret, setCaret] = useState(value.length);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!active) return;
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    setCaret(input.value.length);
  }, [active]);

  const syncCaret = () => {
    const input = inputRef.current;
    if (input) setCaret(input.selectionStart ?? input.value.length);
  };

  const jumpTo = (lineIndex: number, event: PointerEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const viewWidth = Number(svg.viewBox.baseVal.width || 750);
    const x = (event.clientX - rect.left) / rect.width * viewWidth;
    const lines = value.split('\n');
    const start = lines.slice(0, lineIndex).reduce((sum, line) => sum + line.length + 1, 0);
    const next = start + indexAt(lines[lineIndex] || '', x, glyphs);
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(next, next);
    setCaret(next);
  };

  const lines = value.split('\n');
  const carets = lineCaret(value, caret);

  return <div className={`tester-view ${focused ? 'is-focused' : ''}`} onPointerDown={() => inputRef.current?.focus()}>
    <textarea
      ref={inputRef}
      className="tester-input"
      value={value}
      maxLength={600}
      spellCheck={false}
      aria-label="Type tester"
      onChange={event => { onChange(event.target.value); setCaret(event.target.selectionStart ?? event.target.value.length); }}
      onSelect={syncCaret}
      onKeyUp={syncCaret}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
    <div className="tester-render">
      {lines.map((line, index) => (
        <GlyphLine key={index} text={line} glyphs={glyphs} guides={guides} caretAt={carets[index]} showCaret={focused} onSeek={event => jumpTo(index, event)} />
      ))}
    </div>
  </div>;
}
