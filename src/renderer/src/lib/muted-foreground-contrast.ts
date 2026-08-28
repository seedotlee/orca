import { parseCssRgbColor, type RgbaColor } from './terminal-title-contrast'

/** Global --muted-foreground ratio; the light default (#737373 on #fafafa) sits right at 4.5:1. */
export const MUTED_FOREGROUND_MIX_PERCENT = 62
export const MUTED_FOREGROUND_MIN_CONTRAST = 4.5

function relativeLuminance({ r, g, b }: RgbaColor): number {
  const linear = (channel: number): number => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

function contrastRatio(a: RgbaColor, b: RgbaColor): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** `color-mix(in srgb, fg P%, bg)` as the browser computes it (gamma-space channel interpolation). */
function mixSrgb(foreground: RgbaColor, background: RgbaColor, percent: number): RgbaColor {
  const weight = percent / 100
  return {
    r: foreground.r * weight + background.r * (1 - weight),
    g: foreground.g * weight + background.g * (1 - weight),
    b: foreground.b * weight + background.b * (1 - weight),
    a: 1
  }
}

/** Why: a fixed 62% mix assumes a near-black/near-white foreground. Low-contrast themes (Solarized
 *  Light's #586e75 on #fdf6e3 is ~5:1) mix down to ~2.4:1 and sidebar captions vanish, so raise the
 *  mix until muted text clears the floor — up to the foreground itself when nothing less will. */
export function resolveMutedForegroundMixPercent(background: string, foreground: string): number {
  const bg = parseCssRgbColor(background)
  const fg = parseCssRgbColor(foreground)
  if (!bg || !fg) {
    return MUTED_FOREGROUND_MIX_PERCENT
  }
  for (let percent = MUTED_FOREGROUND_MIX_PERCENT; percent < 100; percent += 1) {
    if (contrastRatio(mixSrgb(fg, bg, percent), bg) >= MUTED_FOREGROUND_MIN_CONTRAST) {
      return percent
    }
  }
  return 100
}
