import { Route, Switch } from 'wouter';
import { Navigation } from '@/app/components/Navigation';
import { HomePage } from '@/app/pages/HomePage';
import { DecksPage } from '@/app/pages/DecksPage';
import { SpreadSelectorPage } from '@/app/pages/SpreadSelectorPage';
import { ReadingTablePage } from '@/app/pages/ReadingTablePage';
import { HistoryPage } from '@/app/pages/HistoryPage';
import { SettingsPage } from '@/app/pages/SettingsPage';

export default function App() {
  return (
    <div className="min-h-screen bg-forest-950">
      <Navigation />
      
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/decks" component={DecksPage} />
        <Route path="/spread-selector" component={SpreadSelectorPage} />
        <Route path="/reading" component={ReadingTablePage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/settings" component={SettingsPage} />
        
        {/* 404 */}
        <Route>
          <div className="min-h-screen bg-forest-950 flex items-center justify-center pt-20">
            <div className="text-center">
              <div className="text-6xl mb-4">🐺</div>
              <h1 className="text-mist-50 text-4xl mb-2">404</h1>
              <p className="text-mist-400 mb-6">Страница не найдена</p>
              <a href="/" className="text-neon-emerald-400 hover:text-neon-emerald-300">
                Вернуться на главную
              </a>
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
}
