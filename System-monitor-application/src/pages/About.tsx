import { Code, AlertCircle } from 'lucide-react';

export function About() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-kronos-primary/10 to-kronos-secondary/20 blur-[100px] rounded-full" />
      
      {/* Floating particles - simulated with CSS */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px', animation: 'spin 120s linear infinite' }} />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Wordmark */}
        <h1 className="text-8xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-kronos-primary to-kronos-secondary drop-shadow-[0_0_20px_rgba(123,97,255,0.4)]">
          KRONOS
        </h1>
        
        {/* Tagline */}
        <p className="mt-4 text-gray-400 font-mono tracking-[0.3em] uppercase text-sm">
          Always watching. Always ahead.
        </p>

        {/* Version Info */}
        <div className="mt-12 bg-black/40 border border-white/10 px-4 py-2 font-mono text-xs text-gray-500 backdrop-blur-md">
          VERSION 1.0.0-rc2 // BUILD 8492.x
        </div>

        {/* Description */}
        <p className="mt-8 max-w-md text-gray-300 leading-relaxed text-sm backdrop-blur-sm">
          KRONOS is an AI-powered System Health Monitor designed to provide real-time telemetry, 
          predictive threat analysis, and deep-level diagnostics with zero latency.
        </p>

        {/* Action Buttons */}
        <div className="mt-12 flex gap-6">
          <button className="flex items-center gap-2 bg-kronos-card border border-kronos-primary/30 px-6 py-2 rounded-full text-kronos-primary font-mono text-sm hover:shadow-[0_0_15px_rgba(0,255,209,0.3)] hover:border-kronos-primary transition-all hover:-translate-y-1">
            <Code size={16} /> Source Repo
          </button>
          
          <button className="flex items-center gap-2 bg-kronos-card border border-white/20 px-6 py-2 rounded-full text-white font-mono text-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:border-white transition-all hover:-translate-y-1">
            <AlertCircle size={16} /> Report Bug
          </button>
        </div>
      </div>
    </div>
  );
}
