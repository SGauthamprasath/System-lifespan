import { cn } from '../../utils/cn';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300 font-mono tracking-wider text-sm">{label}</span>
      <button
        onClick={onChange}
        className={cn(
          "w-12 h-6 rounded-full relative transition-colors duration-300",
          checked ? "bg-kronos-primary shadow-[0_0_10px_rgba(0,255,209,0.5)]" : "bg-gray-800"
        )}
      >
        <div 
          className={cn(
            "w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-300",
            checked ? "translate-x-7" : "translate-x-1 opacity-50"
          )}
        />
      </button>
    </div>
  );
}
