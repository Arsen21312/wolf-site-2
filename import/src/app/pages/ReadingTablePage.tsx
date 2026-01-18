import { useState } from 'react';
import { GlassCard } from '@/app/components/GlassCard';
import { TarotCard } from '@/app/components/TarotCard';
import { NeonPrimaryButton } from '@/app/components/NeonPrimaryButton';
import { GlassSecondaryButton } from '@/app/components/GlassSecondaryButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Share2, Save, Info } from 'lucide-react';

export function ReadingTablePage() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isShuffling, setIsShuffling] = useState(true);

  const cards = [
    { id: 'card-1', suit: 'major' as const },
    { id: 'card-2', suit: 'swords' as const },
    { id: 'card-3', suit: 'cups' as const },
  ];

  const handleCardFlip = (index: number) => {
    if (!flippedCards.includes(index)) {
      setFlippedCards([...flippedCards, index]);
      setSelectedCard(index);
    } else {
      setSelectedCard(index);
    }
  };

  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setIsShuffling(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-forest-950 pt-20">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left: Reading Table */}
          <div>
            {/* Status */}
            <div className="mb-6 text-center">
              {isShuffling ? (
                <div className="flex items-center justify-center gap-2 text-neon-emerald-400">
                  <div className="animate-spin">⚡</div>
                  <span>Shuffling… The pack is watching</span>
                </div>
              ) : (
                <div className="text-mist-400">Нажми на карту, чтобы открыть</div>
              )}
            </div>

            {/* Cards Table */}
            <GlassCard className="p-12 bg-forest-850">
              <div className="relative">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent to-forest-950 opacity-50 pointer-events-none" />
                
                {/* Deck at bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-48 rounded-[16px] bg-forest-900 border-2 border-border-glass-strong opacity-30" />
                </div>

                {/* Card spread */}
                <div className="relative flex justify-center items-center gap-8 min-h-[400px]">
                  {cards.map((card, index) => (
                    <TarotCard
                      key={card.id}
                      cardId={card.id}
                      suit={card.suit}
                      isFlipped={flippedCards.includes(index)}
                      onFlip={() => handleCardFlip(index)}
                      className={selectedCard === index ? 'ring-2 ring-neon-emerald-400' : ''}
                    />
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Actions */}
            <div className="flex gap-4 mt-6 justify-center">
              <GlassSecondaryButton onClick={handleShuffle}>
                Перетасовать
              </GlassSecondaryButton>
            </div>
          </div>

          {/* Right: Reading Panel */}
          <div>
            <GlassCard className="p-6 sticky top-24">
              {selectedCard !== null ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-mist-50 text-xl">
                      {`t('decks.[deckId].${cards[selectedCard].suit === 'major' ? 'majorArcana' : 'suits.' + cards[selectedCard].suit}.[${cards[selectedCard].id}].name')`}
                    </h3>
                  </div>

                  {/* Meme quote */}
                  <div className="mb-6 p-4 rounded-lg bg-glass border border-border-glass">
                    <p className="text-mist-300 text-sm italic">
                      {`t('decks.[deckId].${cards[selectedCard].suit === 'major' ? 'majorArcana' : 'suits.' + cards[selectedCard].suit}.[${cards[selectedCard].id}].meme_quote')`}
                    </p>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue="upright" className="mb-6">
                    <TabsList className="grid w-full grid-cols-2 bg-glass">
                      <TabsTrigger value="upright">Прямое</TabsTrigger>
                      <TabsTrigger value="reversed">Перевёрнутое</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upright" className="space-y-4 pt-4">
                      <div>
                        <h4 className="text-mist-200 text-sm mb-2">Значение</h4>
                        <p className="text-mist-400 text-sm">
                          {`t('...meaning_upright')`}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-neon-amber-400 text-sm mb-2">Тень</h4>
                        <p className="text-mist-400 text-sm">
                          {`t('...shadow_upright')`}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-mist-200 text-sm mb-2">Совет</h4>
                        <p className="text-mist-400 text-sm">
                          {`t('...advice_upright')`}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="reversed" className="space-y-4 pt-4">
                      <div>
                        <h4 className="text-mist-200 text-sm mb-2">Значение</h4>
                        <p className="text-mist-400 text-sm">
                          {`t('...meaning_reversed')`}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Actions */}
                  <div className="space-y-3">
                    <GlassSecondaryButton className="w-full">
                      <Info className="mr-2 h-4 w-4" />
                      Подробнее о карте
                    </GlassSecondaryButton>
                    <GlassSecondaryButton className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      Поделиться раскладом
                    </GlassSecondaryButton>
                    <NeonPrimaryButton className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Сохранить в историю
                    </NeonPrimaryButton>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-20">🌙</div>
                  <p className="text-mist-400">Выбери карту, чтобы увидеть значение</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
