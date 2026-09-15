import type { PersistedUIState } from './persisted-ui-state-types'
import {
  DEFAULT_USAGE_PERCENTAGE_DISPLAY,
  normalizeUsagePercentageDisplay
} from './usage-percentage-display'
import { DEFAULT_STATUS_BAR_USAGE_MODE, normalizeStatusBarUsageMode } from './status-bar-usage-mode'
import {
  DEFAULT_STATUS_BAR_USAGE_FORMAT,
  normalizeStatusBarUsageFormat
} from './status-bar-usage-format'

export type StatusBarUsageState = Required<
  Pick<PersistedUIState, 'usagePercentageDisplay' | 'statusBarUsageMode' | 'statusBarUsageFormat'>
>

export function getDefaultStatusBarUsageState(): StatusBarUsageState {
  return {
    usagePercentageDisplay: DEFAULT_USAGE_PERCENTAGE_DISPLAY,
    statusBarUsageMode: DEFAULT_STATUS_BAR_USAGE_MODE,
    statusBarUsageFormat: { ...DEFAULT_STATUS_BAR_USAGE_FORMAT }
  }
}

/** Sanitizes the persisted status-bar usage fields; each falls back to its default independently. */
export function normalizeStatusBarUsageState(
  ui: Partial<StatusBarUsageState>
): StatusBarUsageState {
  return {
    usagePercentageDisplay: normalizeUsagePercentageDisplay(ui.usagePercentageDisplay),
    statusBarUsageMode: normalizeStatusBarUsageMode(ui.statusBarUsageMode),
    statusBarUsageFormat: normalizeStatusBarUsageFormat(ui.statusBarUsageFormat)
  }
}
