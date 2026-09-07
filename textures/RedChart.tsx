import artwork from './RedChart.svg?raw';
import { svgUrl } from './svg-url';
import { TextureSwatch } from './TextureSwatch';
import type { PaperTexture, TextureSwatchProps } from './types';

const artworkUrl = svgUrl(artwork);

export const redChart: PaperTexture = {
  id: 'red-chart',
  name: 'Red chart paper',
  paper: '#f5f5f0',
  ink: '#292b28',
  surfaceClassName: 'paper-red-chart',
  swatchClassName: 'paper-swatch-red-chart',
  css: `
.paper-swatch-red-chart {
  background-image: url("${artworkUrl}");
  background-size: 220px auto;
  background-position: -18px -23px;
}

.paper-red-chart .paper {
  background-image: url("${artworkUrl}");
  background-size: 100% auto;
  background-repeat: repeat-y;
}
`,
  Swatch: RedChart,
};

export default function RedChart(props: TextureSwatchProps) {
  return <TextureSwatch texture={redChart} {...props} />;
}
