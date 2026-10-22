import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { APP_BUNDLE_ID } from '../../shared/distribution-identity'
import { PROTOCOL_VERSION } from './daemon-protocol-version'

/** One job per profile and protocol, including jobs retained across app upgrades. */
export function macDaemonJobLabel(
  userDataPath: string,
  protocolVersion = PROTOCOL_VERSION
): string {
  const profileKey = createHash('sha256').update(resolve(userDataPath)).digest('hex').slice(0, 16)
  return `${APP_BUNDLE_ID}.terminal.${profileKey}.v${protocolVersion}`
}
