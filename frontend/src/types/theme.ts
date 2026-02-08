/**
 * Theme-related types for next-themes integration
 */

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  attribute: 'class' | 'data-theme' | 'data-mode'
  defaultTheme: Theme
  enableSystem: boolean
  storageKey: string
}
