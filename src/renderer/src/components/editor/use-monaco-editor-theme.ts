import { useLayoutEffect, useMemo } from 'react'
import { monaco } from '@/lib/monaco-setup'
import { buildMonacoThemeData, TERMINAL_MONACO_THEME_NAME } from '@/lib/terminal-editor-palette'
import { useEditorSurfaceAppearance } from './use-editor-surface-appearance'

let definedThemeSignature: string | null = null

/** Monaco theme name for the current appearance; defines/re-applies the terminal-derived theme as it changes. */
export function useMonacoEditorTheme(): { isDark: boolean; theme: string } {
  const { isDark, palette } = useEditorSurfaceAppearance()
  const theme = useMemo(() => {
    if (!palette) {
      return isDark ? 'vs-dark' : 'vs'
    }
    // Why: define during render so a child <Editor> mounting before this hook's effects already finds
    // the theme registered; the signature guard keeps the global redefinition idempotent across instances.
    const themeData = buildMonacoThemeData(palette)
    const signature = JSON.stringify(themeData)
    if (signature !== definedThemeSignature) {
      monaco.editor.defineTheme(TERMINAL_MONACO_THEME_NAME, themeData)
      definedThemeSignature = signature
    }
    return TERMINAL_MONACO_THEME_NAME
  }, [isDark, palette])
  useLayoutEffect(() => {
    // Why: Monaco's theme is global and @monaco-editor/react only re-applies on a name change, so a
    // redefined orca-terminal (terminal theme switched) needs an explicit setTheme; same-theme calls are no-ops.
    monaco.editor.setTheme(theme)
  }, [theme, palette])
  return { isDark, theme }
}
