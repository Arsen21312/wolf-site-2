import { GlassCard } from '@/app/components/GlassCard';
import { CardMini } from '@/app/components/CardMini';
import { GlassSecondaryButton } from '@/app/components/GlassSecondaryButton';
import { NeonPrimaryButton } from '@/app/components/NeonPrimaryButton';
import { Input } from '@/app/components/ui/input';
import { Search, Repeat, FolderOpen } from 'lucide-react';

export function HistoryPage() {
  const readings = [
    {
      id: '1',
      date: '18 января 2026, 14:30',
      spreadType: 'Три карты',
      deckName: 'forest-noir',
      cards: [
        { id: 'card-1', suit: 'major' as const },
        { id: 'card-2', suit: 'swords' as const },
        { id: 'card-3', suit: 'cups' as const },
      ],
    },
    {
      id: '2',
      date: '17 января 2026, 19:15',
      spreadType: 'Пять карт',
      deckName: 'meme-mode',
      cards: [
        { id: 'card-4', suit: 'wands' as const },
        { id: 'card-5', suit: 'pentacles' as const },
        { id: 'card-6', suit: 'major' as const },
        { id: 'card-7', suit: 'cups' as const },
        { id: 'card-8', suit: 'swords' as const },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-forest-950 pt-20">
      <div className="max-w-[1320px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-mist-50 text-4xl mb-2">История раскладов</h1>
          <p className="text-mist-400">Твои прошлые чтения карт</p>
        </div>

        {/* Search and filters */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mist-400" />
            <Input
              placeholder="Поиск по раскладам..."
              className="pl-12 bg-glass border-border-glass text-mist-50 placeholder:text-mist-600"
            />
          </div>
        </div>

        {/* Readings list */}
        <div className="space-y-4">
          {readings.map((reading) => (
            <GlassCard
              key={reading.id}
              className="p-6 hover:bg-glass-strong transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                {/* Cards preview */}
                <div className="flex gap-2">
                  {reading.cards.map((card) => (
                    <CardMini key={card.id} cardId={card.id} suit={card.suit} />
                  ))}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="text-mist-400 text-sm mb-1">{reading.date}</div>
                  <h3 className="text-mist-50 text-lg mb-2">{reading.spreadType}</h3>
                  <div className="text-mist-400 text-sm">
                    Колода: {`t('decks.${reading.deckName}.title')`}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <GlassSecondaryButton>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Открыть
                  </GlassSecondaryButton>
                  <GlassSecondaryButton>
                    <Repeat className="h-4 w-4" />
                  </GlassSecondaryButton>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Empty state if no readings */}
        {readings.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-20">🃏</div>
            <h3 className="text-mist-50 text-xl mb-2">Пока нет раскладов</h3>
            <p className="text-mist-400 mb-6">Сделай свой первый расклад, чтобы начать</p>
            <NeonPrimaryButton>Сделать расклад</NeonPrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
