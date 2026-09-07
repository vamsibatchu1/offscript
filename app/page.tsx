'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowDownToLine, ArrowUpRight, Check, Grid2X2, PenLine, RotateCcw, Shuffle, SlidersHorizontal, Type, X } from 'lucide-react';
import { InstrumentSlider } from '@/components/instrument-slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { DrawPad } from '@/components/draw-pad';
import { TypeTester } from '@/components/type-tester';
import { DEFAULTS, PRESETS, familyName, generateAlphabet, measureLine, newSeed, seededParameters, type Glyph, type Parameters } from '@/lib/type-engine';
import { buildFontBuffer, fontFileName } from '@/lib/build-font';
import { PRESET_ICONS } from '@/app/preset-icons';
import { PAPER_TEXTURES } from '@/textures';

type Alphabet = Record<string, Glyph & { left?: number }>;
type Control = { key: keyof Parameters; code: string; label: string; min: number; max: number; step?: number; unit?: string; hint: string };
const GROUPS: { name: string; number: string; controls: Control[] }[] = [
  { name: 'The pen', number: '01', controls: [
    { key: 'weight', code: 'WEIGHT', label: 'Stroke weight', min: 1, max: 12, step: .1, unit: 'px', hint: 'From a fine nib to a heavy marker.' },
    { key: 'pressure', code: 'PRESSURE', label: 'Pressure variation', min: 0, max: 100, hint: 'Let the ink thicken and thin through each stroke.' },
    { key: 'tremor', code: 'TREMOR', label: 'Hand tremor', min: 0, max: 100, hint: 'Add a little wobble to the path of the pen.' },
    { key: 'grain', code: 'ROUGHNESS', label: 'Ink roughness', min: 0, max: 100, hint: 'Break up smooth edges with a dry, textured finish.' },
  ] },
  { name: 'The letter', number: '02', controls: [
    { key: 'width', code: 'WIDTH', label: 'Letter width', min: 45, max: 120, unit: '%', hint: 'Stretch from narrow capitals to broad, open shapes.' },
    { key: 'slant', code: 'SLANT', label: 'Slant', min: -20, max: 25, unit: '°', hint: 'Lean the whole family backward or forward.' },
    { key: 'roundness', code: 'ROUNDNESS', label: 'Roundness', min: 0, max: 100, hint: 'Move between angular bowls and flowing curves.' },
    { key: 'xHeight', code: 'HEIGHT', label: 'Lowercase height', min: 45, max: 82, unit: '%', hint: 'Set the height of small letters against the capitals.' },
    { key: 'flare', code: 'FLARE', label: 'Terminal flare', min: 0, max: 100, hint: 'Add a calligraphic finish to the ends of strokes.' },
  ] },
  { name: 'The personality', number: '03', controls: [
    { key: 'irregularity', code: 'IRREGULARITY', label: 'Irregularity', min: 0, max: 100, hint: 'Give each letter its own imperfect proportions.' },
    { key: 'bounce', code: 'BOUNCE', label: 'Baseline bounce', min: 0, max: 100, hint: 'Let letters wander above and below the baseline.' },
    { key: 'spacing', code: 'SPACING', label: 'Letter spacing', min: 2, max: 32, unit: 'px', hint: 'Give your handwriting room to breathe.' },
  ] },
];
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const SYMBOLS = ['!?.,:;\'"@#$%&', '()[]{}<>+-=*/', '\\|_^`~'];

function GlyphLine({ text, glyphs, className = '', guides = false, canvasWidth = 1040 }: { text: string; glyphs: Alphabet; className?: string; guides?: boolean; canvasWidth?: number }) {
  let position = 12;
  const lineWidth = measureLine(text, glyphs);
  const viewWidth = Math.max(canvasWidth, lineWidth + 28);
  return <svg className={`glyph-line ${className}`} viewBox={`0 -22 ${viewWidth} 162`} role="img" aria-label={text}>
    {guides && <g className="guide-lines" fill="none" stroke="currentColor" strokeWidth=".6"><path d={`M0 0H${viewWidth} M0 100H${viewWidth}`} /><path strokeDasharray="3 5" d={`M0 36H${viewWidth}`} /></g>}
    {[...text].map((char, index) => {
      const glyph = glyphs[char] || glyphs['?'];
      const x = position - (glyph.left || 0); position += glyph.advance;
      return <path key={index} d={glyph.path} transform={`translate(${x} 0)`} fill="currentColor" />;
    })}
  </svg>;
}

function GlyphSection({ title, count, lines, glyphs, guides, className = '' }: { title: string; count: string; lines: string[]; glyphs: Alphabet; guides: boolean; className?: string }) {
  return <section className={`glyph-section ${className}`} aria-label={title}>
    <div className="section-label"><span>{title}</span><span>{count}</span></div>
    <div className="letter-lines">{lines.map(line => <GlyphLine key={line} text={line} glyphs={glyphs} guides={guides} />)}</div>
  </section>;
}

export default function Home() {
  const [seed, setSeed] = useState(417208);
  const [parameters, setParameters] = useState<Parameters>({ ...DEFAULTS });
  const [initialParameters, setInitialParameters] = useState<Parameters>({ ...DEFAULTS });
  const [preset, setPreset] = useState('Custom hand');
  const [guides, setGuides] = useState(true);
  const [palette, setPalette] = useState(1);
  const [text, setText] = useState('Stay curious.\nMake beautiful mistakes.');
  const [activeTab, setActiveTab] = useState('alphabet');
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState('parameters');
  const [exported, setExported] = useState(false);
  const initialized = useRef(false);
  const exportTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glyphs = useMemo(() => generateAlphabet(seed, parameters), [seed, parameters]);
  const name = familyName(seed);
  const seedLabel = seed.toString(16).padStart(8, '0').toUpperCase();
  const colors = PAPER_TEXTURES[palette];
  const regenerate = () => {
    let next = newSeed();
    while (next === seed) next = newSeed();
    const params = seededParameters(next);
    setSeed(next); setParameters(params); setInitialParameters(params); setPreset('Custom hand');
  };
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const next = newSeed(); const params = seededParameters(next);
    setSeed(next); setParameters(params); setInitialParameters(params);
  }, []);
  useEffect(() => () => { if (exportTimer.current) clearTimeout(exportTimer.current); }, []);

  function downloadFont() {
    const buffer = buildFontBuffer(glyphs, name);
    const url = URL.createObjectURL(new Blob([new Uint8Array(buffer)], { type: 'font/otf' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = fontFileName(name); anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setExported(true); if (exportTimer.current) clearTimeout(exportTimer.current);
    exportTimer.current = setTimeout(() => setExported(false), 2200);
  }

  return <div className="studio">
    <header className="topbar">
      <a className="brand" href="/" aria-label="Offscript, generate a new hand">offscript<span className="brand-dot">®</span></a>
    </header>

    <div className="workspace">
      <Tabs value={activeTab} onValueChange={value => setActiveTab(String(value))} className="specimen-workspace">
        <div className="specimen-toolbar">
          <TabsList variant="line" className="view-tabs"><TabsTrigger value="alphabet"><Grid2X2 size={15} />Character set</TabsTrigger><TabsTrigger value="tester"><Type size={17} />Type tester</TabsTrigger></TabsList>
          <div className="toolbar-end"><div className="specimen-heading"><h1>{name}</h1><div className="seed-stamp">{seedLabel}</div></div><div className="toolbar-actions"><button className="icon-button" onClick={downloadFont} aria-label={exported ? 'Downloaded' : 'Download font'}>{exported ? <Check size={15} /> : <ArrowDownToLine size={15} />}</button><button className="icon-button icon-button-solid" onClick={regenerate} aria-label="New handwriting"><Shuffle size={16} /></button></div><button className="mobile-controls" onClick={() => setPanelOpen(true)} aria-label="Open handwriting parameters"><SlidersHorizontal size={18} /></button></div>
        </div>

        <div className={`paper-scroll ${colors.surfaceClassName}`} style={{ '--paper': colors.paper, '--ink': colors.ink } as CSSProperties}>
          <div className="paper">
            <TabsContent value="alphabet" className="alphabet-view">
              <GlyphSection title="Uppercase" count="26 GLYPHS" lines={[UPPER.slice(0, 13), UPPER.slice(13)]} glyphs={glyphs} guides={guides} />
              <GlyphSection title="Lowercase" count="26 GLYPHS" lines={[LOWER.slice(0, 13), LOWER.slice(13)]} glyphs={glyphs} guides={guides} />
              <GlyphSection title="Numbers" count="10 GLYPHS" lines={['0123456789']} glyphs={glyphs} guides={guides} />
              <GlyphSection title="Punctuation & symbols" count="32 GLYPHS" lines={SYMBOLS} glyphs={glyphs} guides={guides} className="symbols-section" />
              <div className="specimen-footnote"><span>94 characters. Infinite personalities.</span><span>OFFSCRIPT TYPE STUDY <ArrowUpRight size={13} /></span></div>
            </TabsContent>
            <TabsContent value="tester" className="tester-panel">
              <TypeTester glyphs={glyphs} guides={guides} value={text} onChange={setText} active={activeTab === 'tester'} />
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {panelOpen && <button className="panel-scrim" aria-label="Close handwriting parameters" onClick={() => setPanelOpen(false)} />}
      <aside className={`parameter-panel ${panelOpen ? 'is-open' : ''}`} aria-label="Handwriting parameters">
        <Tabs value={panelMode} onValueChange={value => setPanelMode(String(value))} className="panel-modes">
          <div className="panel-mode-bar"><TabsList variant="line" className="panel-mode-tabs"><TabsTrigger value="parameters"><SlidersHorizontal size={14} />Parameters</TabsTrigger><TabsTrigger value="draw"><PenLine size={15} />Draw</TabsTrigger></TabsList><button className="mobile-close" aria-label="Close parameters" onClick={() => setPanelOpen(false)}><X size={18} /></button></div>
          <TabsContent value="parameters" className="parameters-scroll">
            <div className="preset-control"><div className="preset-grid" role="group" aria-label="Starting point">{Object.keys(PRESETS).map(key => <button key={key} type="button" className={`preset-button ${preset === key ? 'is-selected' : ''}`} aria-pressed={preset === key} onClick={() => { setParameters({ ...PRESETS[key] }); setPreset(key); }}><span className="preset-icon">{PRESET_ICONS[key]}</span><span className="preset-label">{key}</span></button>)}</div></div>
            <section className="control-group"><h3><span>The paper</span><label className="guides-toggle" htmlFor="show-guides"><Switch id="show-guides" checked={guides} onCheckedChange={setGuides} size="sm" />Show guides</label></h3><div className="paper-options" role="group" aria-label="Paper">{PAPER_TEXTURES.map((item, index) => <item.Swatch key={item.id} selected={palette === index} onSelect={() => setPalette(index)} />)}</div></section>
            {GROUPS.map(group => <section className="control-group" key={group.name}><h3><span>{group.name}</span><span>{group.number}</span></h3>{group.controls.map(control => <div className="parameter" key={control.key}><InstrumentSlider id={`control-${control.key}`} code={control.code} label={control.label} hint={control.hint} value={parameters[control.key]} display={`${control.step ? parameters[control.key].toFixed(1) : parameters[control.key]}${control.unit || '%'}`} min={control.min} max={control.max} step={control.step || 1} onValueChange={number => { setParameters(current => ({ ...current, [control.key]: number })); setPreset('Custom hand'); }} /></div>)}</section>)}
          </TabsContent>
          <TabsContent value="draw" keepMounted className="draw-mode">
            <DrawPad fallback={parameters} onHandChange={next => { setParameters(next); setPreset('Custom hand'); }} />
          </TabsContent>
        </Tabs>
        <div className="panel-footer"><button onClick={() => { setParameters({ ...initialParameters }); setPreset('Custom hand'); }} className="reset-button"><RotateCcw size={14} />Reset adjustments</button><span className="settings-count">12 controls</span></div>
      </aside>
    </div>
  </div>;
}
