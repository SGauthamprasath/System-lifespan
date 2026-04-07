import { Activity, LayoutDashboard, ShieldAlert, Settings, Info } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Metrics', icon: Activity },
  { name: 'Alerts', icon: ShieldAlert },
  { name: 'Settings', icon: Settings },
  { name: 'About', icon: Info },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-20 h-full flex flex-col items-center py-6 bg-kronos-card backdrop-blur-md border-r border-r-kronos-primary/20 z-10">
      <div className="flex flex-col gap-6 mt-16 w-full">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative flex items-center justify-center w-full h-14 transition-all duration-300 group
                ${isActive ? 'text-kronos-primary' : 'text-gray-500 hover:text-kronos-secondaryLight'}
              `}
              title={tab.name}
            >
              {/* Active glow / border */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-kronos-primary shadow-[0_0_15px_rgba(0,255,209,0.8)]" />
              )}
              
              <Icon size={28} className={isActive ? 'drop-shadow-[0_0_8px_rgba(0,255,209,0.8)]' : 'group-hover:scale-110 transition-transform'} />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
