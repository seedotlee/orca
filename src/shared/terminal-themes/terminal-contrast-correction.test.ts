import { describe, expect, it } from 'vitest'
import {
  DARK_BG_MIN_CONTRAST,
  DIM_TEXT_CONTRAST_HEADROOM,
  LIGHT_BG_MIN_CONTRAST,
  resolveTerminalMinimumContrastRatio
} from './terminal-contrast-correction'
import { resolveTerminalTextContrastRatio } from './terminal-title-contrast'

describe('resolveTerminalMinimumContrastRatio', () => {
  it('uses explicit user override when configured', () => {
    expect(resolveTerminalMinimumContrastRatio('#000000', 'dark', 7, '#ffffff')).toBe(7)
  })

  it('keeps standard dark and light floors when foreground contrast has ample headroom', () => {
    expect(resolveTerminalMinimumContrastRatio('#000000', 'dark', undefined, '#ffffff')).toBe(
      DARK_BG_MIN_CONTRAST
    )
    expect(resolveTerminalMinimumContrastRatio('#ffffff', 'light', undefined, '#000000')).toBe(
      LIGHT_BG_MIN_CONTRAST
    )
  })

  it('caps the floor below low-contrast theme foregrounds so dim ANSI 8 text stays distinct', () => {
    // Solarized Light: background #fdf6e3, foreground #657b83 (~4.26:1), brightBlack #93a1a1 (~2.32:1)
    const fgContrast = resolveTerminalTextContrastRatio('#fdf6e3', '#657b83', {
      appSurface: 'light'
    })
    const dimContrast = resolveTerminalTextContrastRatio('#fdf6e3', '#93a1a1', {
      appSurface: 'light'
    })
    expect(fgContrast).not.toBeNull()
    expect(dimContrast).not.toBeNull()

    const floor = resolveTerminalMinimumContrastRatio('#fdf6e3', 'light', undefined, '#657b83')
    expect(floor).toBeCloseTo(fgContrast! / DIM_TEXT_CONTRAST_HEADROOM, 5)
    expect(floor).toBeLessThan(dimContrast!)
    expect(floor).toBeGreaterThan(1)
  })
})
