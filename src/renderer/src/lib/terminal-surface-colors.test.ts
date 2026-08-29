import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { getDefaultSettings } from '../../../shared/constants'
import {
  buildSurfaceTextTokenVariables,
  resolveTerminalSurfaceColors
} from './terminal-surface-colors'
import { resolveMutedForegroundMixPercent } from './muted-foreground-contrast'

describe('buildSurfaceTextTokenVariables', () => {
  it('emits the resolved mix into --muted-foreground', () => {
    const vars = buildSurfaceTextTokenVariables({ background: '#fdf6e3', foreground: '#586e75' })
    const percent = resolveMutedForegroundMixPercent('#fdf6e3', '#586e75')
    expect(vars['--muted-foreground']).toBe(`color-mix(in srgb, #586e75 ${percent}%, #fdf6e3)`)
  })

  it('gates a translucent background on its composite over the app surface', () => {
    const background = 'rgba(253, 246, 227, 0.5)'
    const vars = buildSurfaceTextTokenVariables({
      background,
      foreground: '#586e75',
      appSurface: 'dark'
    })
    const percent = resolveMutedForegroundMixPercent(background, '#586e75', { appSurface: 'dark' })
    expect(percent).toBeGreaterThan(resolveMutedForegroundMixPercent('#fdf6e3', '#586e75'))
    expect(vars['--muted-foreground']).toBe(
      `color-mix(in srgb, #586e75 ${percent}%, ${background})`
    )
  })
})

describe('resolveTerminalSurfaceColors', () => {
  it('reports the effective app mode as the compositing surface', () => {
    const base = {
      ...getDefaultSettings(tmpdir()),
      terminalColorOverrides: { background: '#fdf6e3', foreground: '#586e75' },
      terminalBackgroundOpacity: 0.5
    }
    expect(resolveTerminalSurfaceColors({ ...base, theme: 'light' }, true)).toEqual({
      background: 'rgba(253, 246, 227, 0.5)',
      foreground: '#586e75',
      appSurface: 'light'
    })
    expect(resolveTerminalSurfaceColors({ ...base, theme: 'system' }, true).appSurface).toBe('dark')
  })
})
