import { describe, expect, it } from 'vitest'
import {
  MUTED_FOREGROUND_MIN_CONTRAST,
  MUTED_FOREGROUND_MIX_PERCENT,
  resolveMutedForegroundMixPercent
} from './muted-foreground-contrast'

/** `#rrggbb` → [r, g, b] in 0–255. */
function hexChannels(hex: string): number[] {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16)
  ]
}

/** sRGB 0–255 channel → linear-light value per WCAG 2.x; independent of the implementation under test. */
function linearize(channel: number): number {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG 2.x relative luminance of an [r, g, b] triple. */
function luminance([r, g, b]: number[]): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

/** WCAG contrast of `color-mix(in srgb, fg P%, bg)` over bg, mirroring the browser's sRGB mix. */
function mixedContrast(background: string, foreground: string, percent: number): number {
  const bg = hexChannels(background)
  const fg = hexChannels(foreground)
  const weight = percent / 100
  const mixed = [
    fg[0] * weight + bg[0] * (1 - weight),
    fg[1] * weight + bg[1] * (1 - weight),
    fg[2] * weight + bg[2] * (1 - weight)
  ]
  const lb = luminance(bg)
  const lm = luminance(mixed)
  return (Math.max(lb, lm) + 0.05) / (Math.min(lb, lm) + 0.05)
}

describe('resolveMutedForegroundMixPercent', () => {
  it('keeps the global mix ratio for a high-contrast pair', () => {
    expect(resolveMutedForegroundMixPercent('#101820', '#f0f4f8')).toBe(
      MUTED_FOREGROUND_MIX_PERCENT
    )
    expect(resolveMutedForegroundMixPercent('#fafafa', '#0a0a0a')).toBe(
      MUTED_FOREGROUND_MIX_PERCENT
    )
  })

  it('raises the mix until muted text clears the contrast floor on a low-contrast light theme', () => {
    // Solarized Light: fg #586e75 is ~5:1, so the fixed 62% mix lands at ~2.4:1 (#16999).
    const percent = resolveMutedForegroundMixPercent('#fdf6e3', '#586e75')
    expect(percent).toBeGreaterThan(MUTED_FOREGROUND_MIX_PERCENT)
    expect(percent).toBeLessThan(100)
    expect(mixedContrast('#fdf6e3', '#586e75', percent)).toBeGreaterThanOrEqual(
      MUTED_FOREGROUND_MIN_CONTRAST
    )
    expect(mixedContrast('#fdf6e3', '#586e75', percent - 1)).toBeLessThan(
      MUTED_FOREGROUND_MIN_CONTRAST
    )
  })

  it('raises the mix on a low-contrast dark theme too', () => {
    const percent = resolveMutedForegroundMixPercent('#002b36', '#839496')
    expect(percent).toBeGreaterThan(MUTED_FOREGROUND_MIX_PERCENT)
    expect(mixedContrast('#002b36', '#839496', percent)).toBeGreaterThanOrEqual(
      MUTED_FOREGROUND_MIN_CONTRAST
    )
  })

  it('falls back to the foreground itself when even that misses the floor', () => {
    expect(resolveMutedForegroundMixPercent('#fdf6e3', '#93a1a1')).toBe(100)
  })

  it('treats a fully opaque rgba() background like its hex form', () => {
    expect(resolveMutedForegroundMixPercent('rgba(253, 246, 227, 1)', '#586e75')).toBe(
      resolveMutedForegroundMixPercent('#fdf6e3', '#586e75')
    )
  })

  it('composites a translucent background over the app surface before gating', () => {
    const translucent = 'rgba(253, 246, 227, 0.5)'
    // 50% Solarized Light over the light surface (#ffffff) / the dark surface (#0a0a0a).
    const overLight = resolveMutedForegroundMixPercent(translucent, '#586e75', {
      appSurface: 'light'
    })
    const overDark = resolveMutedForegroundMixPercent(translucent, '#586e75', {
      appSurface: 'dark'
    })
    expect(overLight).toBe(resolveMutedForegroundMixPercent('#fefbf1', '#586e75'))
    expect(overDark).toBe(resolveMutedForegroundMixPercent('#848077', '#586e75'))
    // The dark surface pulls the composited background toward the foreground, so it needs far more mix.
    expect(overDark).toBeGreaterThan(overLight)
  })

  it('keeps the global ratio for colors it cannot parse', () => {
    expect(resolveMutedForegroundMixPercent('var(--background)', 'var(--foreground)')).toBe(
      MUTED_FOREGROUND_MIX_PERCENT
    )
  })
})
