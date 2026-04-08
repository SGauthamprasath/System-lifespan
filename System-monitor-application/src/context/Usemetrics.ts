import { useContext } from 'react'
import { MetricsContext } from './MetricsContextValue'

// Exports only a hook — satisfies react-refresh/only-export-components.
export function useMetrics() {
  const ctx = useContext(MetricsContext)
  if (ctx === undefined) {
    throw new Error('useMetrics must be used inside <MetricsProvider>')
  }
  return ctx
}