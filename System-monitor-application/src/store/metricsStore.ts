import { create } from 'zustand';

interface MetricsState {
  healthScore: number;
  cpuUsage: number;
  ramUsage: number;
  diskSpace: number;
  networkUp: number;
  networkDown: number;
  activeProcesses: number;
}

export const useMetricsStore = create<MetricsState>(() => ({
  healthScore: 92,
  cpuUsage: 14,
  ramUsage: 45,
  diskSpace: 78,
  networkUp: 2.4,
  networkDown: 14.1,
  activeProcesses: 142,
}));

// Mock tick interval
setInterval(() => {
  useMetricsStore.setState((state) => {
    const jitter = (val: number, max: number, volatility: number) => {
      const delta = (Math.random() * volatility * 2) - volatility;
      return Math.min(max, Math.max(0, val + delta));
    };

    return {
      healthScore: jitter(state.healthScore, 100, 0.5),
      cpuUsage: jitter(state.cpuUsage, 100, 5),
      ramUsage: jitter(state.ramUsage, 100, 1),
      networkUp: jitter(state.networkUp, 100, 5),
      networkDown: jitter(state.networkDown, 1000, 20),
      activeProcesses: Math.max(50, state.activeProcesses + Math.floor(Math.random() * 5 - 2)),
    };
  });
}, 2000);
