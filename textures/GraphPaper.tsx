import artwork from './GraphPaper.svg?raw';
import { svgUrl } from './svg-url';
import { TextureSwatch } from './TextureSwatch';
import type { PaperTexture, TextureSwatchProps } from './types';

const artworkUrl = svgUrl(artwork);

export const graphPaper: PaperTexture = {
  id: 'graph-paper',
  name: 'Graph paper',
  paper: '#fbf8ed',
  ink: '#292b28',
  surfaceClassName: 'paper-graph',
  swatchClassName: 'paper-swatch-graph',
  css: `
.paper-swatch-graph { background-image: url("${artworkUrl}"); background-size: 160px auto; }

.paper-graph .paper {
  background-image: url("${artworkUrl}");
  background-size: 100% auto;
  background-repeat: repeat-y;
}
`,
  Swatch: GraphPaper,
};

export default function GraphPaper(props: TextureSwatchProps) {
  return <TextureSwatch texture={graphPaper} {...props} />;
}
