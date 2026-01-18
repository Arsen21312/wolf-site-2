import { Link } from 'wouter';
import { NeonPrimaryButton } from '@/app/components/NeonPrimaryButton';
import { GlassSecondaryButton } from '@/app/components/GlassSecondaryButton';
import { GlassCard } from '@/app/components/GlassCard';
import { Sparkles, LayoutGrid, History } from 'lucide-react';

export function HomePage() {
  const spreads = [
    { id: '1-card', name: '1 карта', cards: 1 },
    { id: '3-cards', name: '3 карты', cards: 3 },
    { id: '5-cards', name: '5 карт', cards: 5 },
    { id: 'pack-7', name: 'Pack 7 карт', cards: 7 },
  ];

  return (
    <div className="min-h-screen bg-forest-950 pt-20">
      <div className="max-w-[1320px] mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="text-6xl mb-4">🐺</div>
          <h1 className="text-mist-50 text-5xl md:text-6xl mb-4 tracking-tight">
            Нейронное Таро Волка
          </h1>
          <p className="text-mist-400 text-xl mb-8 max-w-2xl mx-auto">
            Достаём арканы, читаем судьбу, не ноем
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/spread-selector">
              <a>
                <NeonPrimaryButton className="px-8 py-4 text-lg">
                  <Sparkles className="inline mr-2 h-5 w-5" />
                  Сделать расклад
                </NeonPrimaryButton>
              </a>
            </Link>
            <Link href="/decks">
              <a>
                <GlassSecondaryButton className="px-8 py-4 text-lg">
                  <LayoutGrid className="inline mr-2 h-5 w-5" />
                  Выбрать колоду
                </GlassSecondaryButton>
              </a>
            </Link>
            <Link href="/history">
              <a>
                <GlassSecondaryButton className="px-8 py-4 text-lg">
                  <History className="inline mr-2 h-5 w-5" />
                  Моя история
                </GlassSecondaryButton>
              </a>
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-20">
          <h2 className="text-mist-50 text-3xl text-center mb-12">Как это работает</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Выбери колоду и расклад', icon: '🎴' },
              { step: '2', title: 'Перетасуй карты', icon: '🔮' },
              { step: '3', title: 'Открывай и читай', icon: '✨' },
            ].map((item) => (
              <GlassCard key={item.step} className="p-8 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-neon-emerald-400 text-sm mb-2">Шаг {item.step}</div>
                <h3 className="text-mist-50 text-lg">{item.title}</h3>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Spreads */}
        <div className="mb-20">
          <h2 className="text-mist-50 text-3xl text-center mb-12">Расклады</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spreads.map((spread) => (
              <Link key={spread.id} href="/spread-selector">
                <a>
                  <GlassCard className="p-6 hover:bg-glass-strong transition-all duration-300 hover:shadow-[0_0_28px_rgba(16,185,129,0.2)] cursor-pointer group">
                    <div className="text-center">
                      <div className="text-4xl mb-3">🃏</div>
                      <h3 className="text-mist-50 text-lg mb-2">{spread.name}</h3>
                      <p className="text-mist-400 text-sm">{spread.cards} {spread.cards === 1 ? 'карта' : 'карт'}</p>
                    </div>
                  </GlassCard>
                </a>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border-glass pt-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐺</span>
              <span className="text-mist-200 text-sm">НЕЙРОННЫЙ ВОЛК</span>
            </div>
            <div className="text-mist-400 text-sm">
              Pull a card, don't pull time
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
