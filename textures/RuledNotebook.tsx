import artwork from './RuledNotebook.svg?raw';
import { svgUrl } from './svg-url';
import { TextureSwatch } from './TextureSwatch';
import type { PaperTexture, TextureSwatchProps } from './types';

const artworkUrl = svgUrl(artwork);

export const ruledNotebook: PaperTexture = {
  id: 'ruled-notebook',
  name: 'Ruled notebook',
  paper: '#ffffff',
  ink: '#292b28',
  surfaceClassName: 'paper-notebook',
  swatchClassName: 'paper-swatch-notebook',
  css: `
.paper-swatch-notebook { background-image: url("${artworkUrl}"); background-size: 48px auto; background-position: -1px -4px; }

.paper-notebook .paper {
  background-image: url("${artworkUrl}");
  background-size: 100% auto;
  background-repeat: repeat-y;
  padding-left: calc(10.65% + 20px);
}
`,
  Swatch: RuledNotebook,
};

export default function RuledNotebook(props: TextureSwatchProps) {
  return <TextureSwatch texture={ruledNotebook} {...props} />;
}
