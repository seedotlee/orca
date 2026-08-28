import { COMPUTER_USE_HELPER_BUNDLE_DIR_NAME } from '../../shared/distribution-identity'
export function computerProviderUnavailableMessage(platform: NodeJS.Platform): string {
  if (platform === 'darwin') {
    return [
      `computer-use has no native provider for darwin because ${COMPUTER_USE_HELPER_BUNDLE_DIR_NAME} was not found or this macOS version is unsupported.`,
      'For local development, run pnpm build:computer-macos and restart Orca from this worktree.'
    ].join(' ')
  }
  if (platform === 'linux' || platform === 'win32') {
    return `computer-use has no native provider for ${platform}; the platform runtime file was not found`
  }
  return `computer-use has no native provider for ${platform}`
}
