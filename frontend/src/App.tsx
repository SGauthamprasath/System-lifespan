import React, { useState } from 'react';
import { Sidebar } from './components/common/Sidebar';
import { Topbar } from './components/common/Topbar';
import { Dashboard } from './pages/Dashboard';
import { Metrics } from './pages/Metrics';
import { Alerts } from './pages/Alerts';
import { Settings } from './pages/Settings';
import { About } from './pages/About';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <Dashboard />;
      case 'Metrics': return <Metrics />;
      case 'Alerts': return <Alerts />;
      case 'Settings': return <Settings />;
      case 'About': return <About />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="w-screen h-screen flex relative overflow-hidden bg-kronos-bg text-gray-200 selection:bg-kronos-primary/30">
      <div className="hud-overlay" />
      <div className="scanline" />
      
      {/* Topbar needs to sit above the main content but below overlays if we want overlays on it, wait we want it above overlays. Let's rely on z-index */}
      <Topbar />

      <div className="flex w-full h-full pt-14">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
