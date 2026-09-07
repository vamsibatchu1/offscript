import type { ReactNode } from 'react';

const frame = { viewBox: '0 0 32 32', fill: 'none', 'aria-hidden': true } as const;

export const PRESET_ICONS: Record<string, ReactNode> = {
  Notebook: (
    <svg {...frame}>
      <rect x="7.5" y="4" width="18" height="24" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 10.5h18M11 4v24" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14.5 15.5h7.5M14.5 19.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  'Felt tip': (
    <svg {...frame}>
      <path d="M13 3.5h6v8.5l-1.6 2.8v8.2a3.4 3.4 0 0 1-2.8 3.4 3.4 3.4 0 0 1-2.8-3.4v-8.2L10.2 12V3.5h2.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10.2 10.8h11.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="26.2" r="1.3" fill="currentColor" />
    </svg>
  ),
  Manifesto: (
    <svg {...frame}>
      <path d="M8 6.5 24.5 4.2 22.8 27.5 6.2 24.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11.2 12.2 20.4 10.8M10.8 16.6 19.2 15.4M10.6 21 16.8 20.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  Bookplate: (
    <svg {...frame}>
      <ellipse cx="16" cy="16" rx="11.2" ry="12.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 8.2v15.4M9.6 14.6c4.2 2.6 8.6 2.6 12.8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.8 23.8c2.4 1.6 8 1.6 10.4 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  'First letters': (
    <svg {...frame}>
      <path d="M6.5 24.5q4.2-18 8.2-16.6 1.4 1.8 8.8 16.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.8 17.4h9.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M23.4 8.2 24.6 6.3M26.6 9.5 28.3 8.4M24.8 11.7l1.7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
};
