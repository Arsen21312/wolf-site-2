import { HTMLAttributes } from 'react';
import { cn } from '@/app/components/ui/utils';

interface SuitBadgeProps extends HTMLAttributes<HTMLDivElement> {
  suit: 'pentacles' | 'swords' | 'wands' | 'cups' | 'major';
  size?: 'sm' | 'md' | 'lg';
}

const suitIcons: Record<string, string> = {
  pentacles: '⬟',
  swords: '⚔',
  wands: '⚡',
  cups: '◈',
  major: '★',
};

const suitColors: Record<string, string> = {
  pentacles: 'text-neon-amber-400',
  swords: 'text-neon-ice-400',
  wands: 'text-neon-amber-500',
  cups: 'text-neon-ice-300',
  major: 'text-gold-500',
};

export function SuitBadge({ suit, size = 'md', className, ...props }: SuitBadgeProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full',
        'bg-glass backdrop-blur-sm border border-border-glass',
        sizeClasses[size],
        suitColors[suit],
        className
      )}
      {...props}
    >
      {suitIcons[suit]}
    </div>
  );
}
