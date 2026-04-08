import { useState } from 'react';
import { ThresholdSlider } from '../components/settings/ThresholdSlider';
import { ToggleSwitch } from '../components/settings/ToggleSwitch';
import { GlassCard } from '../components/common/GlassCard';

export function Settings() {
  const [thresholds, setThresholds] = useState({ cpu: 85, ram: 80, disk: 90, network: 50 });
  const [notifications, setNotifications] = useState({ desktop: true, sound: false, startup: true });
  const [aiEnabled, setAiEnabled] = useState(true);
  const [intervalOption, setIntervalOption] = useState('2s');

  const handleSave = () => {
    // Mock save
    console.log('Saved config');
  };

  return (
    <div className="w-full h-full flex flex-col pb-8">
      <h2 className="text-2xl font-display text-white mb-8">Configuration</h2>

      <div className="flex-1 overflow-y-auto space-y-8 pr-4">
        {/* Section 1: Thresholds */}
        <section>
          <h3 className="text-kronos-primary font-mono text-sm uppercase tracking-widest border-b border-b-kronos-primary/20 pb-2 mb-4">Warning Thresholds</h3>
          <div className="grid grid-cols-2 gap-8">
            <ThresholdSlider label="CPU CRITICAL LEVEL" value={thresholds.cpu} unit="%" onChange={(e) => setThresholds({ ...thresholds, cpu: Number(e.target.value) })} />
            <ThresholdSlider label="RAM CRITICAL LEVEL" value={thresholds.ram} unit="%" onChange={(e) => setThresholds({ ...thresholds, ram: Number(e.target.value) })} />
            <ThresholdSlider label="DISK WARNING" value={thresholds.disk} unit="%" onChange={(e) => setThresholds({ ...thresholds, disk: Number(e.target.value) })} />
            <ThresholdSlider label="NETWORK SPIKE" value={thresholds.network} unit="%" onChange={(e) => setThresholds({ ...thresholds, network: Number(e.target.value) })} />
          </div>
        </section>

        {/* Section 2: Notifications */}
        <section>
          <h3 className="text-kronos-primary font-mono text-sm uppercase tracking-widest border-b border-b-kronos-primary/20 pb-2 mb-4 mt-8">Notifications & System</h3>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-w-2xl">
            <ToggleSwitch label="Desktop Notifications" checked={notifications.desktop} onChange={() => setNotifications({ ...notifications, desktop: !notifications.desktop })} />
            <ToggleSwitch label="Sound Alerts" checked={notifications.sound} onChange={() => setNotifications({ ...notifications, sound: !notifications.sound })} />
            <ToggleSwitch label="Launch on Startup" checked={notifications.startup} onChange={() => setNotifications({ ...notifications, startup: !notifications.startup })} />
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-mono tracking-wider text-sm">Monitoring Interval</span>
              <select 
                title="Monitoring Interval"
                className="bg-kronos-card border border-kronos-primary/30 text-kronos-primary px-3 py-1 font-mono text-sm outline-none focus:border-kronos-primary transition-colors cursor-pointer"
                value={intervalOption}
                onChange={(e) => setIntervalOption(e.target.value)}
              >
                <option value="2s">2s</option>
                <option value="5s">5s</option>
                <option value="10s">10s</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 3: AI Engine */}
        <section>
          <h3 className="text-kronos-secondary font-mono text-sm uppercase tracking-widest border-b border-b-kronos-secondary/20 pb-2 mb-6 mt-8">Neural Sentinel (AI)</h3>
          <GlassCard glowColor="purple" className="p-6">
            <ToggleSwitch label="Enable Anomaly Detection" checked={aiEnabled} onChange={() => setAiEnabled(!aiEnabled)} />
            <div className={`mt-6 transition-opacity duration-300 ${aiEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <ThresholdSlider label="SENSITIVITY (LOW <-> HIGH)" value={75} unit="%" onChange={() => {}} />
            </div>
          </GlassCard>
        </section>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave}
          className="bg-kronos-primary text-black font-bold uppercase tracking-widest py-3 px-8 hover:shadow-[0_0_20px_rgba(0,255,209,0.6)] hover:bg-white focus:bg-white transition-all transform hover:-translate-y-1"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
