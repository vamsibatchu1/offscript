import { TextureSwatch } from './TextureSwatch';
import type { PaperTexture, TextureSwatchProps } from './types';

export const blueNotebook: PaperTexture = {
  id: 'blue-notebook',
  name: 'Blue notebook',
  paper: '#e7edf1',
  ink: '#264765',
  surfaceClassName: 'paper-blue-notebook',
  css: `
.paper-blue-notebook .paper {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.87' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='%23777' opacity='.045' filter='url(%23n)' d='M0 0h160v160H0z'/%3E%3C/svg%3E");
}
`,
  Swatch: BlueNotebook,
};

export default function BlueNotebook(props: TextureSwatchProps) {
  return <TextureSwatch texture={blueNotebook} {...props} />;
}
