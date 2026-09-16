// Paleta da marca (mesma do web: tailwind.config.js do monorepo antigo)
export const colors = {
  navy: '#1E3A5F',
  navyDark: '#102a43',
  navyLight: '#334e68',
  green: '#4ade80',
  greenDark: '#22c55e',
  income: '#16a34a',
  expense: '#dc2626',
  warning: '#d97706',
  background: '#f0f4f8',
  surface: '#ffffff',
  border: '#d9e2ec',
  text: '#102a43',
  textMuted: '#627d98',
  white: '#ffffff',
} as const

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const
