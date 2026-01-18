import { useState } from 'react';
import { GlassCard } from '@/app/components/GlassCard';
import { NeonPrimaryButton } from '@/app/components/NeonPrimaryButton';
import { useLocation } from 'wouter';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';

export function SpreadSelectorPage() {
  const [, setLocation] = useLocation();
  const [selectedSpread, setSelectedSpread] = useState('3-cards');
  const [isMemeMode, setIsMemeMode] = useState(false);
  const [showShadow, setShowShadow] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState('forest-noir');

  const spreads = [
    { id: '1-card', name: 'Одна карта', description: 'Быстрый ответ', layout: [1] },
    { id: '3-cards', name: 'Три карты', description: 'Прошлое · Настоящее · Будущее', layout: [1, 1, 1] },
    { id: '5-cards', name: 'Пять карт', description: 'Кельтский крест (упрощённый)', layout: [1, 1, 1, 1, 1] },
    { id: 'pack-7', name: 'Pack Семь карт', description: 'Недельный расклад', layout: [1, 1, 1, 1, 1, 1, 1] },
  ];

  const handleStartShuffle = () => {
    setLocation('/reading');
  };

  return (
    <div className="min-h-screen bg-forest-950 pt-20">
      <div className="max-w-[1320px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Spread selection */}
          <div className="lg:col-span-2">
            <h1 className="text-mist-50 text-4xl mb-2">Выбери расклад</h1>
            <p className="text-mist-400 mb-8">Каждый расклад откроет свою часть истины</p>

            <div className="grid md:grid-cols-2 gap-6">
              {spreads.map((spread) => (
                <GlassCard
                  key={spread.id}
                  onClick={() => setSelectedSpread(spread.id)}
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    selectedSpread === spread.id
                      ? 'border-neon-emerald shadow-[0_0_28px_rgba(16,185,129,0.35)]'
                      : 'hover:bg-glass-strong'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🃏</div>
                    <div className="flex-1">
                      <h3 className="text-mist-50 text-lg mb-1">{spread.name}</h3>
                      <p className="text-mist-400 text-sm mb-3">{spread.description}</p>
                      
                      {/* Visual layout */}
                      <div className="flex gap-2">
                        {spread.layout.map((_, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-9 rounded bg-forest-850 border border-border-glass"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Mode toggles */}
            <div className="mt-8">
              <GlassCard className="p-6">
                <h3 className="text-mist-50 text-lg mb-4">Настройки</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meme-mode" className="text-mist-200">
                      Мемный режим
                    </Label>
                    <Switch
                      id="meme-mode"
                      checked={isMemeMode}
                      onCheckedChange={setIsMemeMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-shadow" className="text-mist-200">
                      Показывать тень
                    </Label>
                    <Switch
                      id="show-shadow"
                      checked={showShadow}
                      onCheckedChange={setShowShadow}
                    />
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Right: Settings panel */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <h3 className="text-mist-50 text-xl mb-6">Параметры расклада</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-mist-400 text-sm mb-2 block">Колода</label>
                  <div className="text-mist-50">{`t('decks.${selectedDeck}.title')`}</div>
                </div>
                
                <div>
                  <label className="text-mist-400 text-sm mb-2 block">Тип расклада</label>
                  <div className="text-mist-50">
                    {spreads.find((s) => s.id === selectedSpread)?.name}
                  </div>
                </div>
                
                <div>
                  <label className="text-mist-400 text-sm mb-2 block">Количество карт</label>
                  <div className="text-mist-50">
                    {spreads.find((s) => s.id === selectedSpread)?.layout.length}
                  </div>
                </div>

                <div className="pt-4 border-t border-border-glass">
                  <NeonPrimaryButton onClick={handleStartShuffle} className="w-full">
                    Начать тасовать
                  </NeonPrimaryButton>
                  <p className="text-mist-600 text-xs text-center mt-3">
                    The pack already knows
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
