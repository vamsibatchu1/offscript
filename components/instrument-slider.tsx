'use client';

import { Slider as SliderPrimitive } from '@base-ui/react/slider';

type InstrumentSliderProps = {
  id: string;
  code: string;
  label: string;
  hint: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
};

export function InstrumentSlider({ id, code, label, hint, value, display, min, max, step, onValueChange }: InstrumentSliderProps) {
  return (
    <div className="instrument" title={hint}>
      <span className="instrument-code">{code}</span>
      <output className="instrument-value" htmlFor={id}>{display}</output>
      <span className="instrument-ticks" aria-hidden />
      <SliderPrimitive.Root
        id={id}
        className="instrument-root"
        value={[value]}
        min={min}
        max={max}
        step={step}
        thumbAlignment="edge"
        aria-label={label}
        aria-valuetext={display}
        onValueChange={next => {
          const number = Array.isArray(next) ? next[0] : next;
          onValueChange(number);
        }}
      >
        <SliderPrimitive.Control className="instrument-control">
          <SliderPrimitive.Track className="instrument-track">
            <SliderPrimitive.Indicator className="instrument-range" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="instrument-needle" />
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    </div>
  );
}
