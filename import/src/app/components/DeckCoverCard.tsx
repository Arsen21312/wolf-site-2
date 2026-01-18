import { HTMLAttributes } from 'react';
import { cn } from '@/app/components/ui/utils';
import { GlassCard } from './GlassCard';
import { NeonPrimaryButton } from './NeonPrimaryButton';
import { GlassSecondaryButton } from './GlassSecondaryButton';

interface DeckCoverCardProps extends HTMLAttributes<HTMLDivElement> {
  deckId: string;
  majorCount?: number;
  minorCount?: number;
  tags?: string[];
  onOpen?: () => void;
  onStartReading?: () => void;
}

export function DeckCoverCard({
  deckId,
  majorCount = 22,
  minorCount = 56,
  tags = [],
  onOpen,
  onStartReading,
  className,
  ...props
}: DeckCoverCardProps) {
  return (
    <GlassCard
      className={cn(
        'group p-6 hover:bg-glass-strong transition-all duration-300',
        'hover:shadow-[0_0_28px_rgba(16,185,129,0.2)]',
        className
      )}
      {...props}
    >
      {/* Cover illustration area */}
      <div className="relative w-full aspect-[3/4] mb-4 rounded-[12px] overflow-hidden bg-forest-850">
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
          🐺
        </div>
        <div className="absolute top-2 right-2">
          <div className="text-gold-500 text-sm opacity-50">☽</div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-mist-50 text-xl mb-2">
        {`t('decks.${deckId}.title')`}
      </h3>

      {/* Card counts */}
      <div className="text-mist-400 text-sm mb-3">
        {majorCount} Старших + {minorCount} Младших
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-lg bg-glass text-mist-300 text-xs border border-border-glass"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <GlassSecondaryButton onClick={onOpen} className="flex-1">
          Открыть
        </GlassSecondaryButton>
        <NeonPrimaryButton onClick={onStartReading} className="flex-1">
          Расклад
        </NeonPrimaryButton>
      </div>
    </GlassCard>
  );
}
