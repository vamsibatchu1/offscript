import artwork from './AquaLedger.svg?raw';
import { svgUrl } from './svg-url';
import { TextureSwatch } from './TextureSwatch';
import type { PaperTexture, TextureSwatchProps } from './types';

const artworkUrl = svgUrl(artwork);

export const aquaLedger: PaperTexture = {
  id: 'aqua-ledger',
  name: 'Aqua ledger',
  paper: '#dfe7e5',
  ink: '#292b28',
  surfaceClassName: 'paper-aqua-ledger',
  swatchClassName: 'paper-swatch-aqua-ledger',
  css: `
.paper-swatch-aqua-ledger {
  background-image: url("${artworkUrl}");
  background-size: 180px auto;
  background-position: -146px -16px;
}

.paper-aqua-ledger .paper {
  background-image: url("${artworkUrl}");
  background-size: 100% auto;
  background-repeat: repeat-y;
}
`,
  Swatch: AquaLedger,
};

export default function AquaLedger(props: TextureSwatchProps) {
  return <TextureSwatch texture={aquaLedger} {...props} />;
}
