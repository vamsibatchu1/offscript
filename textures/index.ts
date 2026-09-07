import { paperAndInk } from './PaperAndInk';
import { oliveAndChalk } from './OliveAndChalk';
import { blueNotebook } from './BlueNotebook';
import { midnight } from './Midnight';
import { ruledNotebook } from './RuledNotebook';
import { graphPaper } from './GraphPaper';
import { engineeringPaper } from './EngineeringPaper';
import { aquaLedger } from './AquaLedger';
import { redChart } from './RedChart';
import type { PaperTexture } from './types';

// This order is the order of the Paper selector. Append new textures here.
export const PAPER_TEXTURES: readonly PaperTexture[] = [
  paperAndInk,
  oliveAndChalk,
  blueNotebook,
  midnight,
  ruledNotebook,
  graphPaper,
  engineeringPaper,
  aquaLedger,
  redChart,
];

export type { PaperTexture, TextureSwatchProps } from './types';
