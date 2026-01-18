import { HTMLAttributes, useState } from 'react';
import { cn } from '@/app/components/ui/utils';
import { SuitBadge } from './SuitBadge';
import { motion } from 'motion/react';

interface TarotCardProps extends HTMLAttributes<HTMLDivElement> {
  cardId: string;
  suit?: 'pentacles' | 'swords' | 'wands' | 'cups' | 'major';
  rank?: string;
  isFlipped?: boolean;
  onFlip?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function TarotCard({
  cardId,
  suit = 'major',
  rank,
  isFlipped = false,
  onFlip,
  size = 'md',
  className,
  ...props
}: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-36',
    md: 'w-40 h-60',
    lg: 'w-52 h-80',
  };

  const handleClick = () => {
    if (onFlip) onFlip();
  };

  return (
    <motion.div
      className={cn(
        'relative cursor-pointer',
        sizeClasses[size],
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <div
          className={cn(
            'absolute inset-0 rounded-[16px] overflow-hidden',
            'bg-forest-900 border-2 border-border-glass-strong',
            'backface-hidden',
            isHovered && !isFlipped && 'shadow-[0_0_28px_rgba(16,185,129,0.35)]'
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-forest-850 to-forest-950 opacity-80" />
          
          {/* Wolf footprint pattern */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl text-mist-600 opacity-20">🐺</div>
          </div>
          
          {/* Moon glyph */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="text-2xl text-gold-500 opacity-30">☽</div>
          </div>
          
          {/* Ornamental corners */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-gold-500 opacity-20" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-gold-500 opacity-20" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-gold-500 opacity-20" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-gold-500 opacity-20" />
        </div>

        {/* Card Front */}
        <div
          className={cn(
            'absolute inset-0 rounded-[16px] overflow-hidden',
            'bg-glass backdrop-blur-xl border-2 border-border-glass-strong',
            'backface-hidden'
          )}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-glass to-transparent" />
          
          {/* Suit badge */}
          <div className="absolute top-3 left-3">
            <SuitBadge suit={suit} size="sm" />
          </div>
          
          {/* Card number/rank */}
          {rank && (
            <div className="absolute top-3 right-3 text-mist-200 text-sm font-medium">
              {rank}
            </div>
          )}
          
          {/* Card title placeholder */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-forest-950 to-transparent">
            <div className="text-mist-50 text-sm text-center">
              {`t('decks.[deckId].${suit === 'major' ? 'majorArcana' : `suits.${suit}`}.[${cardId}].name')`}
            </div>
          </div>
          
          {/* Central illustration area */}
          <div className="absolute inset-8 flex items-center justify-center">
            <div className="text-6xl opacity-30">🌙</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
