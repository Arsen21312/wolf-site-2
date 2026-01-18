import { HTMLAttributes } from 'react';
import { cn } from '@/app/components/ui/utils';
import { SuitBadge } from './SuitBadge';

interface CardMiniProps extends HTMLAttributes<HTMLDivElement> {
  cardId: string;
  suit: 'pentacles' | 'swords' | 'wands' | 'cups' | 'major';
}

export function CardMini({ cardId, suit, className, ...props }: CardMiniProps) {
  return (
    <div
      className={cn(
        'w-12 h-16 rounded-lg overflow-hidden',
        'bg-glass backdrop-blur-sm border border-border-glass',
        'flex items-center justify-center',
        'transition-all duration-200 hover:border-border-neon-ice',
        className
      )}
      {...props}
    >
      <SuitBadge suit={suit} size="sm" />
    </div>
  );
}
