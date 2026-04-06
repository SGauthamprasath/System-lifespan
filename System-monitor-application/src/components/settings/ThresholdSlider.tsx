import React from 'react';

interface ThresholdSliderProps {
  label: string;
  value: number;
  unit: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ThresholdSlider({ label, value, unit, onChange }: ThresholdSliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm font-mono tracking-wider">
        <span className="text-gray-400">{label}</span>
        <span className="text-kronos-primary">{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min="0" max="100" 
        value={value} 
        onChange={onChange}
        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer outline-none"
        style={{
          background: `linear-gradient(to right, #00FFD1 ${value}%, #1f2937 ${value}%)`
        }}
      />
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 8px;
          height: 16px;
          background: #00FFD1;
          cursor: pointer;
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(0, 255, 209, 0.8);
        }
      `}</style>
    </div>
  );
}
