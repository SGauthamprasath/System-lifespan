import React from 'react';
import { useMetricsStore } from '../../store/metricsStore';

export function HealthScoreRing() {
  const healthScore = useMetricsStore((state) => state.healthScore);
  const roundedScore = Math.round(healthScore);
  
  let colorClass = 'text-kronos-primary';
  let glowClass = 'drop-shadow-[0_0_15px_rgba(0,255,209,0.8)]';
  
  if (healthScore < 60) {
    colorClass = 'text-kronos-critical';
    glowClass = 'drop-shadow-[0_0_15px_rgba(255,69,96,0.8)]';
  } else if (healthScore < 85) {
    colorClass = 'text-kronos-warning';
    glowClass = 'drop-shadow-[0_0_15px_rgba(255,183,0,0.8)]';
  }

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-80 h-80 mx-auto">
      {/* Outer rotating decorative dashes */}
      <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-30" viewBox="0 0 300 300">
        <circle
          cx="150" cy="150" r="140"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 12"
          className={colorClass}
        />
      </svg>
      
      {/* Inner rotating solid segments */}
      <svg className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite_reverse] opacity-50" viewBox="0 0 300 300">
        <circle
          cx="150" cy="150" r="130"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="60 40 20 40"
          className={colorClass}
        />
      </svg>

      {/* Main progress ring */}
      <svg className="relative w-full h-full transform -rotate-90" viewBox="0 0 300 300">
        {/* Track */}
        <circle
          cx="150" cy="150" r={radius}
          fill="none"
          stroke="rgba(26, 26, 46, 0.8)"
          strokeWidth="12"
        />
        {/* Progress */}
        <circle
          cx="150" cy="150" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-1000 ease-out`}
          style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
        />
      </svg>

      {/* Center text */}
      <div className={`absolute flex flex-col items-center justify-center ${glowClass}`}>
        <div className="text-gray-500 font-mono text-sm tracking-widest mb-1">SYSTEM HEALTH</div>
        <div className={`text-7xl font-mono font-bold ${colorClass}`}>
          {roundedScore}
        </div>
        <div className="text-gray-500 font-mono text-xs mt-2 relative overflow-hidden group">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">Optimal Parameters</span>
          <span className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
            [ OK ]
          </span>
        </div>
      </div>
    </div>
  );
}
