
interface FilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  const tabs = ['All', 'Warnings', 'Critical', 'Resolved'];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-6 py-2 border rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300
              ${isActive 
                ? 'border-kronos-primary bg-kronos-primary/10 text-kronos-primary shadow-[0_0_15px_rgba(0,255,209,0.3)]' 
                : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'
              }
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
