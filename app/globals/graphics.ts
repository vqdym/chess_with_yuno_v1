export const GRAPHICS_LEVELS = ["ultraLow", "low", "medium", "high", "ultra"] as const;
export type GraphicsQuality = (typeof GRAPHICS_LEVELS)[number];

export function isGraphicsQuality(value: unknown): value is GraphicsQuality {
  return GRAPHICS_LEVELS.some((level) => level === value);
}

export const GRAPHICS_PRESETS = {
  ultraLow: { dpr: 0.5, shadows: false, shadowSize: 256, effects: false, bloomScale: 0.25, samples: 0 },
  low: { dpr: 0.75, shadows: false, shadowSize: 256, effects: false, bloomScale: 0.25, samples: 0 },
  medium: { dpr: 1, shadows: true, shadowSize: 512, effects: false, bloomScale: 0.5, samples: 0 },
  high: { dpr: 1, shadows: true, shadowSize: 512, effects: true, bloomScale: 0.5, samples: 0 },
  ultra: { dpr: 1.5, shadows: true, shadowSize: 1024, effects: true, bloomScale: 1, samples: 4 },
} as const;
