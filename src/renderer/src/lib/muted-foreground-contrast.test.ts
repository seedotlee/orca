import { describe, expect, it } from 'vitest'
import {
  MUTED_FOREGROUND_MIN_CONTRAST,
  MUTED_FOREGROUND_MIX_PERCENT,
  resolveMutedForegroundMixPercent
} from './muted-foreground-contrast'

// WCAG contrast of `color-mix(in srgb, fg P%, bg)` over bg, mirroring the browser's sRGB mix.
function mixedContrast(background: string, foreground: string, percent: number): number {
  const channels = (hex: string): number[] =>
    [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16))
  const luminance = (rgb: number[]): number => {
    const [r, g, b] = rgb.map((channel) => {
      const c = channel / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const bg = channels(background)
  const fg = channels(foreground)
  const mixed = fg.map(
    (channel, index) => channel * (percent / 100) + bg[index] * (1 - percent / 100)
  )
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

  it('reads rgba() backgrounds (terminal background opacity applied)', () => {
    expect(resolveMutedForegroundMixPercent('rgba(253, 246, 227, 0.9)', '#586e75')).toBe(
      resolveMutedForegroundMixPercent('#fdf6e3', '#586e75')
    )
  })

  it('keeps the global ratio for colors it cannot parse', () => {
    expect(resolveMutedForegroundMixPercent('var(--background)', 'var(--foreground)')).toBe(
      MUTED_FOREGROUND_MIX_PERCENT
    )
  })
})
