import type React from 'react'
import type { GlobalSettings } from '../../../../shared/global-settings-types'
import type { WorkspaceChromeAppearanceMode } from '../../../../shared/ui-chrome-types'
import { translate } from '@/i18n/i18n'
import { SettingsRow, SettingsSegmentedControl } from './SettingsFormControls'
import { SearchableSetting } from './SearchableSetting'
import { getWorkspaceChromeAppearanceEntry } from './appearance-sidebar-search'

type WorkspaceChromeAppearanceSettingProps = {
  settings: GlobalSettings
  updateSettings: (updates: Partial<GlobalSettings>) => void
}

/** Default / Match Terminal toggle for the app chrome surfaces. */
export function WorkspaceChromeAppearanceSetting({
  settings,
  updateSettings
}: WorkspaceChromeAppearanceSettingProps): React.JSX.Element {
  const title = translate(
    'auto.components.settings.AppearancePane.workspaceChromeAppearance.title',
    'App Chrome Appearance'
  )
  return (
    <SettingsRow
      alignTop
      label={title}
      description={translate(
        'auto.components.settings.AppearancePane.workspaceChromeAppearance.rowDescription',
        'Make the tab bar, status bar, side panels, full-page views, and popovers match your terminal theme, or keep the app theme.'
      )}
      control={
        <SettingsSegmentedControl<WorkspaceChromeAppearanceMode>
          size="sm"
          value={settings.workspaceChromeAppearanceMode ?? 'default'}
          onChange={(workspaceChromeAppearanceMode) =>
            updateSettings({ workspaceChromeAppearanceMode })
          }
          ariaLabel={title}
          options={[
            {
              value: 'default',
              label: translate(
                'auto.components.settings.AppearancePane.workspaceChromeAppearance.default',
                'Default'
              )
            },
            {
              value: 'match-terminal',
              label: translate(
                'auto.components.settings.AppearancePane.workspaceChromeAppearance.matchTerminal',
                'Match Terminal'
              )
            }
          ]}
        />
      }
    />
  )
}

/** Searchable row for the app-chrome appearance mode; forced visible with the rest of the primary settings. */
export function WorkspaceChromeAppearanceSearchableSetting({
  settings,
  updateSettings,
  forceVisible
}: WorkspaceChromeAppearanceSettingProps & { forceVisible: boolean }): React.JSX.Element {
  const entry = getWorkspaceChromeAppearanceEntry()
  return (
    <SearchableSetting
      title={entry.title}
      description={entry.description}
      keywords={entry.keywords}
      forceVisible={forceVisible}
    >
      <WorkspaceChromeAppearanceSetting settings={settings} updateSettings={updateSettings} />
    </SearchableSetting>
  )
}
