import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { APP_BUNDLE_ID, DEV_APP_BUNDLE_ID, MAIN_RELEASE_REPO } from './distribution-identity'

const repoRoot = resolve(__dirname, '../..')
const UPSTREAM_BUNDLE_ID = 'com.stablyai.orca'
// Why: also catches the regex-escaped spelling tests use in matchers.
const UPSTREAM_BUNDLE_ID_PATTERN = String.raw`com\\?\.stablyai\\?\.orca`

// Why: git grep exits 1 on zero matches, which is the passing case here.
function gitGrepFiles(args: string[]): string {
  try {
    return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' })
  } catch (error) {
    const status = (error as { status?: number }).status
    if (status === 1) {
      return ''
    }
    throw error
  }
}

describe('distribution identity', () => {
  it('is a valid reverse-DNS bundle id distinct from upstream', () => {
    expect(APP_BUNDLE_ID).toMatch(/^[a-z0-9-]+(\.[a-z0-9-]+)+$/)
    expect(APP_BUNDLE_ID).not.toBe(UPSTREAM_BUNDLE_ID)
    expect(MAIN_RELEASE_REPO).toMatch(/^[\w.-]+\/[\w.-]+$/)
  })

  // Why: Swift cannot import the JSON, so the sidecar's peer-trust check is a
  // literal that must be kept in step by hand.
  it('matches the computer-use sidecar trust check', () => {
    const swift = readFileSync(
      resolve(repoRoot, 'native/computer-use-macos/Sources/OrcaComputerUseMacOS/main.swift'),
      'utf8'
    )
    expect(swift).toContain(`bundleId == "${APP_BUNDLE_ID}"`)
    expect(swift).toContain(`bundleId.hasPrefix("${DEV_APP_BUNDLE_ID}.")`)
  })

  it('leaves no upstream bundle id in tracked files', () => {
    const hits = gitGrepFiles([
      'grep',
      '-l',
      '-E',
      '--untracked',
      UPSTREAM_BUNDLE_ID_PATTERN,
      '--',
      '.',
      ':!src/shared/distribution-identity.test.ts'
    ])
      .split('\n')
      .filter(Boolean)
    expect(hits).toEqual([])
  })
})
