import type { ComponentType } from 'react';

export type TextureSwatchProps = {
  selected: boolean;
  onSelect: () => void;
};

export type PaperTexture = {
  id: string;
  name: string;
  paper: string;
  ink: string;
  surfaceClassName: string;
  swatchClassName?: string;
  css: string;
  Swatch: ComponentType<TextureSwatchProps>;
};
