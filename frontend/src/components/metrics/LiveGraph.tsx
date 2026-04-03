import React, { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { GlassCard } from '../common/GlassCard';

interface LiveGraphProps {
  title: string;
  dataValue: number;
  dataValue2?: number; // for network download
  unit: string;
  color?: string;
  color2?: string;
}

export function LiveGraph({ 
  title, 
  dataValue, 
  dataValue2, 
  unit, 
  color = '#00FFD1', 
  color2 = '#7B61FF' 
}: LiveGraphProps) {
  const [data, setData] = useState<any[]>(Array(30).fill({ time: 0, val: 0, val2: 0 }));

  useEffect(() => {
    setData((prev) => {
      const next = [...prev.slice(1), { val: dataValue, val2: dataValue2 || 0 }];
      return next;
    });
  }, [dataValue, dataValue2]);

  return (
    <GlassCard className="p-5 h-56 flex flex-col hover:-translate-y-1 relative overflow-hidden">
      <div className="flex justify-between items-start z-10 w-full mb-2">
        <div className="text-kronos-primary/80 font-mono text-[10px] uppercase font-bold tracking-widest">{title}</div>
        <div className="text-3xl font-mono font-bold tracking-widest drop-shadow-[0_0_5px_currentColor]" style={{ color }}>
          {Math.round(dataValue)} 
          {dataValue2 !== undefined && <span style={{ color: color2 }}> / {Math.round(dataValue2)}</span>}
          <span className="text-sm opacity-60 ml-1">{unit}</span>
        </div>
      </div>

      <div className="flex-1 mt-2 -mx-4 -mb-4 opacity-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
              {dataValue2 !== undefined && (
                <linearGradient id={`grad2-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color2} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color2} stopOpacity={0} />
                </linearGradient>
              )}
            </defs>
            <YAxis domain={['auto', 'auto']} hide />
            <XAxis dataKey="time" hide />
            <Area 
              type="monotone" 
              dataKey="val" 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#grad-${title})`} 
              isAnimationActive={false}
              strokeWidth={2}
            />
            {dataValue2 !== undefined && (
              <Area 
                type="monotone" 
                dataKey="val2" 
                stroke={color2} 
                fillOpacity={1} 
                fill={`url(#grad2-${title})`} 
                isAnimationActive={false}
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
