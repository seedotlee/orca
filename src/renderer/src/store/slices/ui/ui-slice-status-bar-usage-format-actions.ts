import type { UISlice, UISliceSet } from './ui-slice-contract'
import {
  DEFAULT_STATUS_BAR_USAGE_FORMAT,
  normalizeStatusBarUsageFormat
} from '../../../../../shared/status-bar-usage-format'

/** Footer usage template state plus the action that persists it. */
export function createStatusBarUsageFormatActions(
  set: UISliceSet
): Pick<UISlice, 'statusBarUsageFormat' | 'setStatusBarUsageFormat'> {
  return {
    statusBarUsageFormat: { ...DEFAULT_STATUS_BAR_USAGE_FORMAT },
    setStatusBarUsageFormat: (format) => {
      const normalized = normalizeStatusBarUsageFormat(format)
      window.api.ui.set({ statusBarUsageFormat: normalized }).catch(console.error)
      set({ statusBarUsageFormat: normalized })
    }
  }
}
