/// Bundle ids of the apps whose computer-use sidecar may drive this helper.
public enum TrustedOrcaApplication {
    public static func isTrusted(bundleId: String) -> Bool {
        // Why: `pnpm dev` launches as `com.seedotlee.orca.dev` and per-worktree wrapper apps use
        // `com.seedotlee.orca.dev.<name>`; the sidecar peer check must authorize both (#26498).
        bundleId == "com.seedotlee.orca" ||
            bundleId == "com.seedotlee.orca.dev" ||
            bundleId.hasPrefix("com.seedotlee.orca.dev.") ||
            bundleId == "com.github.Electron"
    }
}
