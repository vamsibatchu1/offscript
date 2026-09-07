'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { generateGlyph, seededParameters } from '@/lib/type-engine';
import { PAPER_TEXTURES } from '@/textures';

const WORD = 'offscript';
const SEEDS = [417208, 902113, 184433, 551902, 773014, 229188, 880441, 331067, 664520];

export function Landing({ onEnter }: { onEnter: () => void }) {
  const [paperIndex, setPaperIndex] = useState(1);
  const paper = PAPER_TEXTURES[paperIndex];
  const word = useMemo(() => {
    let cursor = 0;
    const letters = [...WORD].map((char, index) => {
      const seed = SEEDS[index];
      const glyph = generateGlyph(char, seed, seededParameters(seed));
      const x = cursor - glyph.left;
      cursor += glyph.advance;
      return { char, seed, glyph, x };
    });
    return { width: cursor, letters };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPaperIndex(current => {
        let next = Math.floor(Math.random() * PAPER_TEXTURES.length);
        if (next === current) next = (next + 1) % PAPER_TEXTURES.length;
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`landing ${paper.surfaceClassName}`} style={{ '--paper': paper.paper, '--ink': paper.ink } as CSSProperties}>
      {PAPER_TEXTURES.map(item => <style key={item.id} data-paper-texture={item.id}>{item.css}</style>)}
      <div className="paper landing-sheet">
        <div className="landing-center">
          <h1 className="landing-word" aria-label="offscript">
            <svg viewBox={`0 -12 ${word.width} 124`} preserveAspectRatio="xMidYMid meet" role="img" aria-hidden>
              {word.letters.map((letter, index) => (
                <path key={`${letter.char}-${index}`} d={letter.glyph.path} transform={`translate(${letter.x} 0)`} fill="currentColor" />
              ))}
            </svg>
          </h1>
          <p className="landing-copy">
            Offscript invents a handwritten alphabet from a seed and a handful of parameters — pressure, tremor, bounce, flare — then lets you walk away with a real OpenType font. Each run is a different hand. Tune the roughness, draw a gesture to shape it, try it on paper, and download a typeface that did not exist an hour ago. This is not a foundry. It is a studio for the scratch, the wobble, and the letter that sits a little off the line. Have fun with it. Make something ugly. Keep something you want.
          </p>
          <button type="button" className="landing-enter" onClick={onEnter}>let&apos;s create some fonts</button>
        </div>
      </div>
    </div>
  );
}
