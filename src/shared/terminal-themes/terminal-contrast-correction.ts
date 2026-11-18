import {
  isTerminalBackgroundLight,
  resolveTerminalTextContrastRatio
} from './terminal-title-contrast'
import { normalizeTerminalMinimumContrastRatio } from './terminal-minimum-contrast-settings'

// Light backgrounds use 4.5 for invisible white ANSI text; dark uses 3 to rescue near-background glyphs without washing saturated colors (#7934/#9599/#10104). Accept mild lifts for below-floor Homebrew red/blue and Gruvbox Dark red; builtin tests pin exceptions.
export const LIGHT_BG_MIN_CONTRAST = 4.5
export const DARK_BG_MIN_CONTRAST = 3
// Keep the floor at half the foreground contrast so low-contrast themes (e.g. Solarized Light) don't collapse dim ANSI 8 ghost text into body text.
export const DIM_TEXT_CONTRAST_HEADROOM = 2

// Follow composed luminance, not app mode: either slot may contain light/dark themes. Clamp explicit overrides too, including hand-edited nonfinite/out-of-range values.
export function resolveTerminalMinimumContrastRatio(
  background: string | undefined,
  appSurface: 'dark' | 'light',
  override?: unknown,
  foreground?: string
): number {
  const configured = normalizeTerminalMinimumContrastRatio(override)
  if (configured !== undefined) {
    return configured
  }
  const floor = isTerminalBackgroundLight(background, { appSurface })
    ? LIGHT_BG_MIN_CONTRAST
    : DARK_BG_MIN_CONTRAST
  const foregroundContrast = resolveTerminalTextContrastRatio(background, foreground, {
    appSurface
  })
  if (foregroundContrast === null) {
    return floor
  }
  return Math.max(1, Math.min(floor, foregroundContrast / DIM_TEXT_CONTRAST_HEADROOM))
}
