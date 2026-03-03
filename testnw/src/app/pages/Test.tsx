import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { questions, answerOptions } from '../data/test-data';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Test() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (value: number) => {
    setSelectedAnswer(value);
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[questions[currentQuestion + 1]?.id] ?? null);
    } else {
      // Сохраняем результаты в localStorage перед переходом
      localStorage.setItem('wolfTestAnswers', JSON.stringify(answers));
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[questions[currentQuestion - 1]?.id] ?? null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-2xl"
            >
              <h2 className="text-2xl md:text-3xl mb-12" style={{ fontWeight: 600 }}>
                {question.text}
              </h2>

              {/* Answer options */}
              <div className="space-y-3">
                {answerOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswerSelect(option.value)}
                    className={`
                      w-full p-4 rounded-2xl text-left transition-all duration-200
                      ${
                        selectedAnswer === option.value
                          ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                          : 'bg-muted/50 hover:bg-muted border border-border'
                      }
                    `}
                    style={{ fontWeight: 500 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-4 justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`
                px-6 py-3 rounded-2xl flex items-center gap-2 transition-all
                ${
                  currentQuestion === 0
                    ? 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }
              `}
            >
              <ChevronLeft className="w-5 h-5" />
              Назад
            </motion.button>

            <motion.button
              whileHover={{ scale: selectedAnswer !== null ? 1.02 : 1 }}
              whileTap={{ scale: selectedAnswer !== null ? 0.98 : 1 }}
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={`
                px-6 py-3 rounded-2xl flex items-center gap-2 transition-all
                ${
                  selectedAnswer !== null
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                }
              `}
              style={{ fontWeight: 600 }}
            >
              {currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}