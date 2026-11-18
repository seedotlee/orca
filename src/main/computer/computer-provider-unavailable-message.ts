import { COMPUTER_USE_HELPER_BUNDLE_DIR_NAME } from '../../shared/distribution-identity'
export function computerProviderUnavailableMessage(platform: NodeJS.Platform): string {
  if (platform === 'darwin') {
    return [
      `computer-use has no native provider for darwin because ${COMPUTER_USE_HELPER_BUNDLE_DIR_NAME} was not found or this macOS version is unsupported.`,
      'For local development, run pnpm build:computer-macos and restart Orca from this worktree.'
    ].join(' ')
  }
  if (platform === 'linux' || platform === 'win32') {
    const runtime =
      platform === 'linux' ? 'computer-use-linux/runtime.py' : 'computer-use-windows/runtime.ps1'
    return `Computer use isn't available on this host: its Orca install has no ${runtime}. On an Orca server installed before computer use shipped with it, update or reprovision the server.`
  }
  return `computer-use has no native provider for ${platform}`
}
