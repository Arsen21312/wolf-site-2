import { Link, useLocation } from 'wouter';
import { cn } from '@/app/components/ui/utils';
import { NeonPrimaryButton } from './NeonPrimaryButton';

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { label: 'Колоды', href: '/decks' },
    { label: 'История', href: '/history' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-950/80 backdrop-blur-xl border-b border-border-glass">
      <div className="max-w-[1320px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/">
          <a className="flex items-center gap-2 group cursor-pointer">
            <div className="text-2xl">🐺</div>
            <div>
              <div className="text-mist-50 text-lg tracking-wide transition-colors group-hover:text-neon-emerald-400">
                НЕЙРОННЫЙ ВОЛК
              </div>
              <div className="text-mist-400 text-xs -mt-1">Neural Wolf Tarot</div>
            </div>
          </a>
        </Link>

        {/* Nav items */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  'text-base transition-colors',
                  location === item.href
                    ? 'text-neon-emerald-400'
                    : 'text-mist-200 hover:text-mist-50'
                )}
              >
                {item.label}
              </a>
            </Link>
          ))}
          
          <Link href="/spread-selector">
            <a>
              <NeonPrimaryButton>Сделать расклад</NeonPrimaryButton>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
