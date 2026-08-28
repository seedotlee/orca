import { describe, expect, it } from 'vitest'
import { buildSurfaceTextTokenVariables } from './terminal-surface-colors'
import { resolveMutedForegroundMixPercent } from './muted-foreground-contrast'

describe('buildSurfaceTextTokenVariables', () => {
  it('emits the resolved mix into --muted-foreground', () => {
    const vars = buildSurfaceTextTokenVariables({ background: '#fdf6e3', foreground: '#586e75' })
    const percent = resolveMutedForegroundMixPercent('#fdf6e3', '#586e75')
    expect(vars['--muted-foreground']).toBe(`color-mix(in srgb, #586e75 ${percent}%, #fdf6e3)`)
  })
})
