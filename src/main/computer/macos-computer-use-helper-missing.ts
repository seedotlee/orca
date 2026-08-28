import { COMPUTER_USE_HELPER_BUNDLE_DIR_NAME } from '../../shared/distribution-identity'
import { resolveMacOSComputerUseExecutablePath } from './macos-native-provider-paths'
import { RuntimeClientError } from './runtime-client-error'

export const COMPUTER_USE_HELPER_MISSING_MESSAGE = `${COMPUTER_USE_HELPER_BUNDLE_DIR_NAME} was not found`

/** Why: separate from the paths module so tests can mock path resolution without losing the error. */
export function requireMacOSComputerUseExecutablePath(): string {
  const executablePath = resolveMacOSComputerUseExecutablePath()
  if (!executablePath) {
    throw new RuntimeClientError('accessibility_error', COMPUTER_USE_HELPER_MISSING_MESSAGE)
  }
  return executablePath
}
