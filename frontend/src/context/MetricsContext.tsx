import React, { createContext, useContext, useEffect, useReducer } from 'react'
import type { MetricSnapshot } from '../services/metrics'

// ── State ─────────────────────────────────────────────────────────────────────
interface MetricsState {
  current: MetricSnapshot | null  // latest live snapshot
  history: MetricSnapshot[]       // rolling 60-entry window (~5 min at 5s intervals)
}

const initialState: MetricsState = {
  current: null,
  history: [],
}

// ── Actions ───────────────────────────────────────────────────────────────────
type Action =
  | { type: 'SNAPSHOT'; payload: MetricSnapshot }   // live push from main.ts
  | { type: 'LOAD';     payload: MetricSnapshot[] } // boot fetch from NeDB

// ── Reducer ───────────────────────────────────────────────────────────────────
function metricsReducer(state: MetricsState, action: Action): MetricsState {
  switch (action.type) {
    case 'SNAPSHOT':
      return {
        current: action.payload,
        history: [...state.history, action.payload].slice(-60),
      }
    case 'LOAD': {
      const sorted = [...action.payload].sort((a, b) => a.timestamp - b.timestamp)
      return {
        current: sorted[sorted.length - 1] ?? null,
        history: sorted.slice(-60),
      }
    }
    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const MetricsContext = createContext<MetricsState | undefined>(undefined)

// ── Provider ──────────────────────────────────────────────────────────────────
export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(metricsReducer, initialState)

  useEffect(() => {
    // Boot: pre-populate history from NeDB (last 1 hour of saved snapshots)
    window.electron.getRecentSnapshots().then((snapshots) => {
      dispatch({ type: 'LOAD', payload: snapshots })
    })

    // Live: subscribe to 5-second pushes from main.ts
    // onMetricsUpdate returns an unsubscribe fn — React calls it on unmount
    const unsubscribe = window.electron.onMetricsUpdate((snapshot) => {
      dispatch({ type: 'SNAPSHOT', payload: snapshot })
    })

    return unsubscribe
  }, [])

  return (
    <MetricsContext.Provider value={state}>
      {children}
    </MetricsContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useMetrics() {
  const ctx = useContext(MetricsContext)
  if (ctx === undefined) {
    throw new Error('useMetrics must be used inside <MetricsProvider>')
  }
  return ctx
}