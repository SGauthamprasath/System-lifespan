import { createContext } from 'react'
import type { MetricSnapshot } from '../services/metrics'

// Isolated here so MetricsContext.tsx can export only MetricsProvider (a component)
// and useMetrics.ts can export only the hook — satisfying react-refresh/only-export-components
// in both files.

export interface MetricsState {
  current: MetricSnapshot | null  // latest live snapshot
  history: MetricSnapshot[]       // rolling 60-entry window (~5 min at 5s intervals)
}

export const MetricsContext = createContext<MetricsState | undefined>(undefined)