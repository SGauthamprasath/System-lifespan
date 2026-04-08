import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: 'teal' | 'purple' | 'amber' | 'red' | 'none';
  hasBrackets?: boolean;
}

const glowVariants = {
  teal: 'hover:shadow-[0_0_20px_rgba(0,255,209,0.15)] focus-within:shadow-[0_0_20px_rgba(0,255,209,0.15)]',
  purple: 'hover:shadow-[0_0_20px_rgba(123,97,255,0.15)] focus-within:shadow-[0_0_20px_rgba(123,97,255,0.15)]',
  amber: 'hover:shadow-[0_0_20px_rgba(255,183,0,0.15)] focus-within:shadow-[0_0_20px_rgba(255,183,0,0.15)]',
  red: 'hover:shadow-[0_0_20px_rgba(255,69,96,0.15)] focus-within:shadow-[0_0_20px_rgba(255,69,96,0.15)]',
  none: '',
};

export function GlassCard({ children, className, glowColor = 'teal', hasBrackets = true, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative bg-kronos-card backdrop-blur-md border border-kronos-primary/20 transition-all duration-300',
        glowVariants[glowColor],
        className
      )}
      {...props}
    >
      {hasBrackets && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t font-mono border-l border-kronos-primary/50" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-kronos-primary/50" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-kronos-primary/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-kronos-primary/50" />
        </>
      )}
      {children}
    </div>
  );
}