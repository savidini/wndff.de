export type ProfileTheme = {
  background: string;
  backgroundDeep: string;
  foreground: string;
  muted: string;
  accent: string;
  accentSoft: string;
};

export type Portrait = {
  alt: string;
  focalPoint: {
    x: `${number}%`;
    y: `${number}%`;
  };
  sources: {
    avif: string;
    webp: string;
    jpeg: string;
  };
};

export type Profile = {
  id: 'david' | 'eva';
  name: string;
  field: string;
  linkedInUrl: `https://www.linkedin.com/in/${string}/`;
  links: readonly {
    label: string;
    url: `https://${string}`;
    icon: 'linkedin' | 'github' | 'website';
  }[];
  portrait: Portrait;
  theme: ProfileTheme;
};

export const portraitWidths = [640, 960, 1280] as const;

export const profiles = [
  {
    id: 'david',
    name: 'David Wendorff',
    field: 'Industrial Robotics and Assembly Automation',
    linkedInUrl: 'https://www.linkedin.com/in/wndff/',
    links: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/wndff/',
        icon: 'linkedin',
      },
      {
        label: 'GitHub',
        url: 'https://github.com/savidini',
        icon: 'github',
      },
    ],
    portrait: {
      alt: 'Portrait of David Wendorff.',
      focalPoint: { x: '50%', y: '36%' },
      sources: {
        avif: '/portraits/david-{width}.avif',
        webp: '/portraits/david-{width}.webp',
        jpeg: '/portraits/david-{width}.jpg',
      },
    },
    theme: {
      background: '#07111f',
      backgroundDeep: '#050617',
      foreground: '#f2f6f7',
      muted: '#aebfcb',
      accent: '#5ee3d2',
      accentSoft: '#a2ffe7',
    },
  },
  {
    id: 'eva',
    name: 'Eva Wendorff',
    field: 'Specialty Coffee Operations & Leadership',
    linkedInUrl: 'https://www.linkedin.com/in/evawendorff/',
    links: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/evawendorff/',
        icon: 'linkedin',
      },
    ],
    portrait: {
      alt: 'Portrait of Eva Wendorff.',
      focalPoint: { x: '50%', y: '34%' },
      sources: {
        avif: '/portraits/eva-{width}.avif',
        webp: '/portraits/eva-{width}.webp',
        jpeg: '/portraits/eva-{width}.jpg',
      },
    },
    theme: {
      background: '#dfc291',
      backgroundDeep: '#c87854',
      foreground: '#352018',
      muted: '#6d493b',
      accent: '#783e2d',
      accentSoft: '#713526',
    },
  },
] as const satisfies readonly Profile[];

export function portraitSrcset(template: string): string {
  return portraitWidths
    .map((width) => `${template.replace('{width}', String(width))} ${width}w`)
    .join(', ');
}
