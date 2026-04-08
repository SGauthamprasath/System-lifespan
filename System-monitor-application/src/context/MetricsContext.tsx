import React, { useEffect, useReducer } from 'react'
import type { MetricSnapshot } from '../services/metrics'
import { MetricsContext } from './MetricsContextValue'
import type { MetricsState } from './MetricsContextValue'

// ── Actions ───────────────────────────────────────────────────────────────────
type Action =
  | { type: 'SNAPSHOT'; payload: MetricSnapshot }   // live push from main.ts
  | { type: 'LOAD';     payload: MetricSnapshot[] } // boot fetch from NeDB

// ── Reducer ───────────────────────────────────────────────────────────────────
const initialState: MetricsState = {
  current: null,
  history: [],
}

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

// ── Provider ──────────────────────────────────────────────────────────────────
// This file exports ONLY this component — required by react-refresh/only-export-components.
// The context object lives in MetricsContextValue.ts; the hook lives in useMetrics.ts.
export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(metricsReducer, initialState)

  useEffect(() => {
    window.electron.getRecentSnapshots().then((snapshots) => {
      dispatch({ type: 'LOAD', payload: snapshots })
    })

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