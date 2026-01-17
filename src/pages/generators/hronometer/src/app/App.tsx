import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export default function App() {
  const [text, setText] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mode, setMode] = useState<'read' | 'type'>('read');
  const timerRef = useRef<number | null>(null);

  // Calculate stats
  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  
  // Reading speed: ~225 words per minute (average)
  const readingTimeMinutes = wordCount / 225;
  
  // Typing speed: ~40 words per minute (average)
  const typingTimeMinutes = wordCount / 40;

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive]);

  const handleStartTimer = (selectedMode: 'read' | 'type') => {
    if (text.trim() === '') return;
    setMode(selectedMode);
    setElapsedTime(0);
    setIsTimerActive(true);
  };

  const handlePauseTimer = () => {
    setIsTimerActive(false);
  };

  const handleResetTimer = () => {
    setIsTimerActive(false);
    setElapsedTime(0);
  };

  // Calculate progress
  const estimatedTime = mode === 'read' ? readingTimeMinutes * 60 : typingTimeMinutes * 60;
  const progress = estimatedTime > 0 ? Math.min((elapsedTime / estimatedTime) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-auto">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 shadow-lg shadow-cyan-500/10">
              <Timer className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Хронометр текста
          </h1>
          <p className="text-lg text-slate-300/80">
            Узнай, сколько времени займёт чтение или набор
          </p>
        </header>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/20 mb-8">
          {/* Textarea */}
          <div className="mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Вставь или напиши текст здесь…"
              className="w-full h-48 md:h-64 bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-400/50 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              disabled={isTimerActive}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center group hover:border-cyan-500/30 transition-all">
              <div className="text-2xl md:text-3xl mb-1 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {charCount}
              </div>
              <div className="text-xs text-slate-400">Символов</div>
            </div>

            <div className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center group hover:border-purple-500/30 transition-all">
              <div className="text-2xl md:text-3xl mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {wordCount}
              </div>
              <div className="text-xs text-slate-400">Слов</div>
            </div>

            <div className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center group hover:border-blue-500/30 transition-all">
              <div className="text-2xl md:text-3xl mb-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {readingTimeMinutes.toFixed(1)}
              </div>
              <div className="text-xs text-slate-400">Мин. чтения</div>
            </div>

            <div className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center group hover:border-indigo-500/30 transition-all">
              <div className="text-2xl md:text-3xl mb-1 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {typingTimeMinutes.toFixed(1)}
              </div>
              <div className="text-xs text-slate-400">Мин. набора</div>
            </div>
          </div>

          {/* Timer Controls */}
          {!isTimerActive && elapsedTime === 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleStartTimer('read')}
                disabled={text.trim() === ''}
                className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:shadow-none"
              >
                <span className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Запустить для чтения
                </span>
              </button>
              <button
                onClick={() => handleStartTimer('type')}
                disabled={text.trim() === ''}
                className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 disabled:shadow-none"
              >
                <span className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Запустить для набора
                </span>
              </button>
            </div>
          )}

          {/* Active Timer Display */}
          {(isTimerActive || elapsedTime > 0) && (
            <div className="space-y-4">
              {/* Timer Display */}
              <div className="text-center">
                <div className="text-6xl md:text-7xl mb-2 font-mono bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-sm text-slate-400 mb-4">
                  {isTimerActive 
                    ? (mode === 'read' ? 'Читай в своём ритме' : 'Пиши в своём ритме')
                    : 'Пауза'
                  }
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 rounded-full shadow-lg shadow-cyan-500/50"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Timer Controls */}
              <div className="flex gap-3">
                <button
                  onClick={isTimerActive ? handlePauseTimer : () => setIsTimerActive(true)}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-all backdrop-blur-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isTimerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isTimerActive ? 'Пауза' : 'Продолжить'}
                  </span>
                </button>
                <button
                  onClick={handleResetTimer}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-slate-500/20 to-slate-600/20 border border-slate-500/30 hover:border-slate-400/50 transition-all backdrop-blur-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    Сбросить
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center space-y-3">
          <p className="text-sm text-slate-400/60">
            Инструмент от <span className="text-cyan-400/80">Нейронного Волка</span>
          </p>
          <div className="flex justify-center gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-cyan-400 transition-colors">О проекте</a>
            <span>•</span>
            <a href="#" className="hover:text-cyan-400 transition-colors">Помощь</a>
            <span>•</span>
            <a href="#" className="hover:text-cyan-400 transition-colors">Контакты</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
