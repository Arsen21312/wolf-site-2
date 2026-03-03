import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { calculateResults, determinePersonalityType } from '../data/test-data';
import type { PersonalityType, ScaleType } from '../data/test-data';
import { RotateCcw, TrendingUp, Zap, Users, Target } from 'lucide-react';

const scaleIcons: Record<ScaleType, any> = {
  stress: TrendingUp,
  impulse: Zap,
  social: Users,
  control: Target,
};

const scaleNames: Record<ScaleType, string> = {
  stress: 'Стрессоустойчивость',
  impulse: 'Импульсивность',
  social: 'Социальная энергия',
  control: 'Самоконтроль',
};

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const [percentages, setPercentages] = useState<Record<ScaleType, number> | null>(null);
  const [personalityType, setPersonalityType] = useState<PersonalityType | null>(null);

  useEffect(() => {
    // Сначала проверяем state из навигации
    let answers = location.state?.answers;
    
    // Если нет в state, проверяем localStorage
    if (!answers) {
      const savedAnswers = localStorage.getItem('wolfTestAnswers');
      if (savedAnswers) {
        try {
          answers = JSON.parse(savedAnswers);
        } catch (e) {
          console.error('Error parsing saved answers:', e);
        }
      }
    }
    
    // Если все равно нет ответов, редиректим на главную
    if (!answers) {
      navigate('/');
      return;
    }

    const results = calculateResults(answers);
    const type = determinePersonalityType(results);
    
    setPercentages(results);
    setPersonalityType(type);
  }, [location.state, navigate]);

  if (!percentages || !personalityType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Загрузка результатов...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 py-20">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl" style={{ fontWeight: 700 }}>
            Твой профиль готов
          </h1>
          <p className="text-muted-foreground text-lg">
            Анализ завершён. Вот что мы узнали о тебе
          </p>
        </motion.div>

        {/* Scales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl p-8 md:p-10 border border-border space-y-6"
        >
          <h2 className="text-xl" style={{ fontWeight: 600 }}>Твои показатели</h2>
          
          <div className="space-y-6">
            {(Object.keys(percentages) as ScaleType[]).map((scale, index) => {
              const Icon = scaleIcons[scale];
              const percentage = percentages[scale];
              
              return (
                <motion.div
                  key={scale}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-foreground">{scaleNames[scale]}</span>
                    </div>
                    <span className="text-primary" style={{ fontWeight: 600 }}>
                      {percentage}%
                    </span>
                  </div>
                  
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Personality type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-3xl p-8 md:p-10 border border-border space-y-6 relative overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          
          <div className="relative space-y-4">
            <div className="text-center space-y-3">
              <div className="text-6xl">{personalityType.emoji}</div>
              <h2 className="text-3xl text-primary" style={{ fontWeight: 700 }}>
                {personalityType.name}
              </h2>
            </div>
            
            <p className="text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
              {personalityType.description}
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Очищаем результаты и возвращаемся на главную
              localStorage.removeItem('wolfTestAnswers');
              navigate('/');
            }}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2"
            style={{ fontWeight: 600 }}
          >
            <RotateCcw className="w-5 h-5" />
            Пройти ещё раз
          </motion.button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-sm text-muted-foreground/60 text-center max-w-xl mx-auto"
        >
          Тест носит информационный характер и не является медицинской диагностикой. 
          Для получения профессиональной психологической помощи обратитесь к специалисту.
        </motion.p>
      </div>
    </div>
  );
}
