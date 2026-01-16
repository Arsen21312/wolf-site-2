import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "When she says 'I'm fine' what does she really mean?",
    options: [
      "She's actually fine",
      "Something's wrong but she won't tell you",
      "She wants you to read her mind",
      "She's testing if you care enough to ask again",
    ],
  },
  {
    id: 2,
    text: "She posts a selfie at 2am. What's the message?",
    options: [
      "She's bored and can't sleep",
      "She's fishing for your attention",
      "She wants someone else to notice",
      "She's feeling herself and doesn't need validation",
    ],
  },
  {
    id: 3,
    text: "She asks 'What are you thinking?' The real question is...",
    options: [
      "Are you thinking about me?",
      "Are you hiding something?",
      "Do you even care about us?",
      "She's just making conversation",
    ],
  },
];

interface QuizScreenProps {
  onComplete: () => void;
}

export function QuizScreen({ onComplete }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    if (isTransitioning) return;

    const newAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(newAnswers);
    setIsTransitioning(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
      } else {
        onComplete();
      }
    }, 600);
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-violet-950/20 to-black" />
      
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/20 blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[100px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-violet-950/50">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 shadow-[0_0_10px_2px_rgba(139,92,246,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-8 right-6 text-violet-300 text-sm tracking-widest">
        {currentQuestion + 1}/{questions.length}
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-12 max-w-xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Question Card */}
            <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-violet-950/40 to-purple-950/40 backdrop-blur-xl border border-violet-500/20 shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)]">
              <motion.h2
                className="text-2xl md:text-3xl text-white leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {question.text}
              </motion.h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-5 text-left rounded-xl bg-gradient-to-r from-violet-900/30 to-purple-900/30 backdrop-blur-md border border-violet-500/20 text-violet-100 hover:border-violet-400/50 hover:bg-violet-800/30 transition-all group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-violet-400 group-hover:bg-violet-300 transition-colors shadow-[0_0_10px_2px_rgba(167,139,250,0.4)]" />
                    <span className="text-base md:text-lg">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>
    </motion.div>
  );
}
