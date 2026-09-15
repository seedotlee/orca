import { describe, expect, it } from 'vitest'
import {
  getDefaultStatusBarUsageState,
  normalizeStatusBarUsageState
} from './status-bar-usage-state'

describe('status-bar usage state', () => {
  it('normalizes missing or invalid fields to the defaults', () => {
    expect(normalizeStatusBarUsageState({})).toEqual(getDefaultStatusBarUsageState())
    expect(
      normalizeStatusBarUsageState({
        usagePercentageDisplay: 'nope' as never,
        statusBarUsageMode: 42 as never,
        statusBarUsageFormat: 'x' as never
      })
    ).toEqual(getDefaultStatusBarUsageState())
  })

  it('keeps valid persisted values', () => {
    expect(
      normalizeStatusBarUsageState({
        usagePercentageDisplay: 'remaining',
        statusBarUsageMode: 'compact',
        statusBarUsageFormat: { template: '{used}%' }
      })
    ).toEqual({
      usagePercentageDisplay: 'remaining',
      statusBarUsageMode: 'compact',
      statusBarUsageFormat: { template: '{used}%' }
    })
  })

  it('returns a fresh default format object each call', () => {
    expect(getDefaultStatusBarUsageState().statusBarUsageFormat).not.toBe(
      getDefaultStatusBarUsageState().statusBarUsageFormat
    )
  })
})
