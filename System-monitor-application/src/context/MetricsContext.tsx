import React, { useEffect, useReducer } from 'react'
import type { MetricSnapshot } from '../services/metrics'
import { MetricsContext } from './MetricsContextValue'
import type { MetricsState, PredictionState } from './MetricsContextValue'

// ── Actions ───────────────────────────────────────────────────────────────────
type Action =
  | { type: 'SNAPSHOT';   payload: MetricSnapshot }
  | { type: 'LOAD';       payload: MetricSnapshot[] }
  | { type: 'PREDICTION'; payload: PredictionState }   // ← add this

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState: MetricsState = {
  current:  null,
  history:  [],
  prediction: {                        // ← add this
    prediction:   'Normal',
    reason:       'Normal behavior',
    health_score: 100,
    health_label: 'Healthy',
  }
}

// ── Reducer ───────────────────────────────────────────────────────────────────
function metricsReducer(state: MetricsState, action: Action): MetricsState {
  switch (action.type) {
    case 'SNAPSHOT':
      return {
        ...state,
        current: action.payload,
        history: [...state.history, action.payload].slice(-60),
      }
    case 'LOAD': {
      const sorted = [...action.payload].sort((a, b) => a.timestamp - b.timestamp)
      return {
        ...state,
        current: sorted[sorted.length - 1] ?? null,
        history: sorted.slice(-60),
      }
    }
    case 'PREDICTION':               // ← add this
      return {
        ...state,
        prediction: action.payload,
      }
    default:
      return state
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(metricsReducer, initialState)

  useEffect(() => {
    // Load history from NeDB
    window.electron.getRecentSnapshots().then((snapshots) => {
      dispatch({ type: 'LOAD', payload: snapshots })
    })

    // Listen to live metrics
    const unsubscribeMetrics = window.electron.onMetricsUpdate((snapshot) => {
      dispatch({ type: 'SNAPSHOT', payload: snapshot })
    })

    // Listen to ML prediction ← add this
    const unsubscribePrediction = window.electron.onPredictionUpdate((result) => {
      dispatch({
        type: 'PREDICTION',
        payload: {
          prediction:   result.prediction,
          reason:       result.reason,
          health_score: result.health_score,
          health_label: result.health_label,
        }
      })
    })

    return () => {
      unsubscribeMetrics()
      unsubscribePrediction()     // ← add this
    }
  }, [])

  return (
    <MetricsContext.Provider value={state}>
      {children}
    </MetricsContext.Provider>
  )
}