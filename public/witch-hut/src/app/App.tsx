import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { HeroScreen } from '@/app/components/HeroScreen';
import { QuizScreen } from '@/app/components/QuizScreen';
import { ResultScreen } from '@/app/components/ResultScreen';

type Screen = 'hero' | 'quiz' | 'result';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('hero');

  const handleStart = () => {
    setCurrentScreen('quiz');
  };

  const handleQuizComplete = () => {
    setCurrentScreen('result');
  };

  const handleCTA = () => {
    // In a real app, this would redirect to the actual product/service
    console.log('User clicked CTA - redirect to product page');
    alert('This is where you would enter the actual experience/product.');
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <AnimatePresence mode="wait">
        {currentScreen === 'hero' && (
          <HeroScreen key="hero" onStart={handleStart} />
        )}
        {currentScreen === 'quiz' && (
          <QuizScreen key="quiz" onComplete={handleQuizComplete} />
        )}
        {currentScreen === 'result' && (
          <ResultScreen key="result" onCTA={handleCTA} />
        )}
      </AnimatePresence>
    </div>
  );
}
