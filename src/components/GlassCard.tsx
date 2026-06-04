import React from 'react';
import { cn } from '@/src/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
}

export const GlassCard = ({ children, className, hoverable, ...props }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "glass-morphism rounded-2xl p-6 transition-all duration-300",
        hoverable && "hover:bg-white/60 hover:translate-y-[-2px] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
