import identity from './distribution-identity.json'

/**
 * Single source of truth for what makes this distribution *this* app: the
 * bundle id TCC/Keychain/LaunchServices key on, and the GitHub repo the
 * updater pulls from. Everything else derives from here so a rebase onto
 * upstream can never drag the upstream identity back in.
 *
 * Bundle id and Team ID together anchor macOS permission grants — change the
 * bundle id and every user re-grants everything. JSON rather than TS so the
 * CJS/.mjs build scripts can `require` the same values.
 */
export const APP_BUNDLE_ID: string = identity.appBundleId
export const APP_HELPER_BUNDLE_ID = `${APP_BUNDLE_ID}.helper`
export const DEV_APP_BUNDLE_ID = `${APP_BUNDLE_ID}.dev`
export const DEV_APP_HELPER_BUNDLE_ID = `${DEV_APP_BUNDLE_ID}.helper`
export const LOCAL_APP_BUNDLE_ID = `${APP_BUNDLE_ID}.local`
export const LOCAL_APP_HELPER_BUNDLE_ID = `${LOCAL_APP_BUNDLE_ID}.helper`
export const COMPUTER_USE_BUNDLE_ID = `${APP_BUNDLE_ID}.computer-use`

/** Drives the .app / .exe names, userData directory, Keychain item, Dock and window titles. */
export const APP_PRODUCT_NAME: string = identity.productName
export const APP_BUNDLE_DIR_NAME = `${APP_PRODUCT_NAME}.app`
export const APP_WINDOWS_EXECUTABLE_NAME = `${APP_PRODUCT_NAME}.exe`
export const COMPUTER_USE_HELPER_NAME = `${APP_PRODUCT_NAME} Computer Use`
export const COMPUTER_USE_HELPER_BUNDLE_DIR_NAME = `${COMPUTER_USE_HELPER_NAME}.app`

export const RELEASE_GITHUB_OWNER: string = identity.githubOwner
export const RELEASE_GITHUB_REPO: string = identity.githubRepo

export const MAIN_RELEASE_REPO = `${RELEASE_GITHUB_OWNER}/${RELEASE_GITHUB_REPO}`
export const HOURLY_RELEASE_REPO = `${MAIN_RELEASE_REPO}-hourly`
export const DAILY_RELEASE_REPO = `${MAIN_RELEASE_REPO}-daily`
export const ADHOC_RELEASE_REPO = `${MAIN_RELEASE_REPO}-adhoc`

export const MAIN_RELEASE_REPO_URL = `https://github.com/${MAIN_RELEASE_REPO}`
export const MAIN_RELEASE_LATEST_DOWNLOAD_URL = `${MAIN_RELEASE_REPO_URL}/releases/latest/download`
