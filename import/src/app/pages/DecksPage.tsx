import { useState } from 'react';
import { DeckCoverCard } from '@/app/components/DeckCoverCard';
import { GlassSecondaryButton } from '@/app/components/GlassSecondaryButton';
import { Grid3x3, List } from 'lucide-react';
import { useLocation } from 'wouter';

export function DecksPage() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const decks = [
    {
      id: 'forest-noir',
      majorCount: 22,
      minorCount: 56,
      tags: ['forest noir', 'neon', 'премиум'],
    },
    {
      id: 'classic-rider',
      majorCount: 22,
      minorCount: 56,
      tags: ['classic', 'traditional'],
    },
    {
      id: 'meme-mode',
      majorCount: 22,
      minorCount: 56,
      tags: ['meme mode', 'AUF', 'городская степь'],
    },
    {
      id: 'shadow-pack',
      majorCount: 22,
      minorCount: 56,
      tags: ['shadow', 'harsh truth', 'crimson'],
    },
  ];

  return (
    <div className="min-h-screen bg-forest-950 pt-20">
      <div className="max-w-[1320px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-mist-50 text-4xl mb-2">Колоды</h1>
              <p className="text-mist-400">Выбери свою колоду для расклада</p>
            </div>
            
            {/* View mode toggle */}
            <div className="flex gap-2">
              <GlassSecondaryButton
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'border-neon-emerald' : ''}
              >
                <Grid3x3 className="h-5 w-5" />
              </GlassSecondaryButton>
              <GlassSecondaryButton
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'border-neon-emerald' : ''}
              >
                <List className="h-5 w-5" />
              </GlassSecondaryButton>
            </div>
          </div>
        </div>

        {/* Decks Grid */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {decks.map((deck) => (
            <DeckCoverCard
              key={deck.id}
              deckId={deck.id}
              majorCount={deck.majorCount}
              minorCount={deck.minorCount}
              tags={deck.tags}
              onOpen={() => console.log('Open deck:', deck.id)}
              onStartReading={() => setLocation('/spread-selector')}
              className={viewMode === 'list' ? 'flex-row items-center' : ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
