import artwork from './EngineeringPaper.svg?raw';
import { svgUrl } from './svg-url';
import { TextureSwatch } from './TextureSwatch';
import type { PaperTexture, TextureSwatchProps } from './types';

const artworkUrl = svgUrl(artwork);

export const engineeringPaper: PaperTexture = {
  id: 'engineering-paper',
  name: 'Engineering paper',
  paper: '#f7f5e8',
  ink: '#292b28',
  surfaceClassName: 'paper-engineering',
  swatchClassName: 'paper-swatch-engineering',
  css: `
.paper-swatch-engineering { background-image: url("${artworkUrl}"); background-size: 300px auto; background-position: -36px -27px; }

.paper-engineering .paper {
  background-image: url("${artworkUrl}");
  background-size: 100% auto;
  background-repeat: repeat-y;
}
`,
  Swatch: EngineeringPaper,
};

export default function EngineeringPaper(props: TextureSwatchProps) {
  return <TextureSwatch texture={engineeringPaper} {...props} />;
}
