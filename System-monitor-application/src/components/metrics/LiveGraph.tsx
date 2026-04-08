import { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { GlassCard } from '../common/GlassCard';

interface LiveGraphProps {
  title: string;
  dataValue: number;
  dataValue2?: number;
  unit: string;
  color?: string;
  color2?: string;
}

type DataPoint = { val: number; val2: number }

const BUFFER_SIZE = 30

const makeEmptyBuffer = (): DataPoint[] =>
  Array.from({ length: BUFFER_SIZE }, () => ({ val: 0, val2: 0 }))

export function LiveGraph({
  title,
  dataValue,
  dataValue2,
  unit,
  color = '#00FFD1',
  color2 = '#7B61FF',
}: LiveGraphProps) {
  const [data, setData] = useState<DataPoint[]>(makeEmptyBuffer)

  // Store the last-seen prop values in state so we can detect changes during render.
  // This is the pattern React recommends for deriving state from props without effects:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevVal,  setPrevVal]  = useState(dataValue)
  const [prevVal2, setPrevVal2] = useState(dataValue2)

  if (dataValue !== prevVal || dataValue2 !== prevVal2) {
    setPrevVal(dataValue)
    setPrevVal2(dataValue2)
    // setData called during render (not inside an effect) is batched by React
    // into the current render pass — no extra render, no cascade.
    setData((prev) => [
      ...prev.slice(1),
      { val: dataValue, val2: dataValue2 ?? 0 },
    ])
  }

  const yDomain: [number, (v: number) => number] = [
    0,
    (dataMax: number) => Math.max(dataMax * 1.2, 10),
  ]

  // Sanitise title for use as SVG gradient id (no spaces or special chars)
  const gradId  = `grad-${title.replace(/[^a-z0-9]/gi, '-')}`
  const gradId2 = `grad2-${title.replace(/[^a-z0-9]/gi, '-')}`

  return (
    <GlassCard
      className="p-5 flex flex-col hover:-translate-y-1 relative overflow-hidden"
      style={{ height: '14rem' }}
    >
      {/* Header — shrink-0 so it never gets squashed by the chart */}
      <div className="flex justify-between items-start z-10 w-full mb-2 shrink-0">
        <div className="text-kronos-primary/80 font-mono text-[10px] uppercase font-bold tracking-widest">
          {title}
        </div>
        <div
          className="text-3xl font-mono font-bold tracking-widest drop-shadow-[0_0_5px_currentColor]"
          style={{ color }}
        >
          {Math.round(dataValue)}
          {dataValue2 !== undefined && (
            <span style={{ color: color2 }}> / {Math.round(dataValue2)}</span>
          )}
          <span className="text-sm opacity-60 ml-1">{unit}</span>
        </div>
      </div>

      {/* Chart wrapper — explicit px height, NOT flex-1.
          ResponsiveContainer reads parentElement.clientHeight to size the SVG.
          flex-1 resolves to 0px at first render so recharts draws nothing.
          A hard px value is always resolved and always non-zero. */}
      <div className="shrink-0 -mx-4 -mb-4 opacity-80" style={{ height: '7rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
              {dataValue2 !== undefined && (
                <linearGradient id={gradId2} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color2} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color2} stopOpacity={0} />
                </linearGradient>
              )}
            </defs>

            <YAxis domain={yDomain} hide />

            <Area
              type="monotone"
              dataKey="val"
              stroke={color}
              fillOpacity={1}
              fill={`url(#${gradId})`}
              isAnimationActive={false}
              strokeWidth={2}
            />
            {dataValue2 !== undefined && (
              <Area
                type="monotone"
                dataKey="val2"
                stroke={color2}
                fillOpacity={1}
                fill={`url(#${gradId2})`}
                isAnimationActive={false}
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}