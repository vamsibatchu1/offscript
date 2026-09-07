import type { PaperTexture, TextureSwatchProps } from './types';

export function TextureSwatch({ texture, selected, onSelect }: TextureSwatchProps & { texture: PaperTexture }) {
  return (
    <>
    <style data-paper-texture={texture.id}>{texture.css}</style>
    <button
      className={`paper-swatch ${texture.swatchClassName || ''} ${selected ? 'selected' : ''}`}
      style={{ backgroundColor: texture.paper }}
      onClick={onSelect}
      aria-label={texture.name}
      title={texture.name}
      aria-pressed={selected}
    >
      <span style={{ background: texture.ink }} />
    </button>
    </>
  );
}
